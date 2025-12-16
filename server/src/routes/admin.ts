import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js';

const router = express.Router();

// Admin şifresi (environment variable'dan al)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'EgzersizLabAdmin2024!';

/**
 * Admin Authentication Middleware
 */
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminToken = req.headers['x-admin-token'];
  
  if (adminToken !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: 'Yetkisiz erişim. Admin şifresi gerekli.',
    });
  }
  
  next();
};

/**
 * Admin Giriş Kontrolü
 */
router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Admin girişi başarılı',
      token: ADMIN_PASSWORD, // Basit token olarak şifreyi kullan
    });
  }
  
  return res.status(401).json({
    success: false,
    error: 'Yanlış admin şifresi',
  });
});

/**
 * Tüm Kullanıcıları Getir
 */
router.get('/users', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({})
      .select('-password') // Şifreleri hariç tut
      .sort({ createdAt: -1 }); // En yeni önce
    
    return res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Tek Kullanıcı Detayı
 */
router.get('/users/:id', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    // Video verilerini temizle (çok büyük, sayfayı çökertiyor)
    if ((user as any).dashboardData?.clinicalAssessments) {
      Object.keys((user as any).dashboardData.clinicalAssessments).forEach(testType => {
        const tests = (user as any).dashboardData.clinicalAssessments[testType];
        if (Array.isArray(tests)) {
          tests.forEach((test: any) => {
            if (test.video && test.video.length > 1000) {
              test.hasVideo = true;
              test.videoSize = Math.round(test.video.length / 1024) + ' KB';
              delete test.video; // Videoyu sil, sadece bilgiyi göster
            }
          });
        }
      });
    }
    
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Kullanıcı Dashboard Verilerini Getir
 */
router.get('/users/:id/dashboard', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('dashboardData name email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    return res.json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        dashboardData: user.dashboardData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Kullanıcı Sil
 */
router.delete('/users/:id', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    // Kullanıcıyı ve ilgili verileri sil
    await User.findByIdAndDelete(req.params.id);
    await VerificationCode.deleteMany({ email: user.email });
    
    return res.json({
      success: true,
      message: `Kullanıcı silindi: ${user.email}`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * İstatistikler
 */
router.get('/stats', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const usersWithData = await User.countDocuments({ 'dashboardData': { $exists: true, $ne: null } });
    
    // Son 7 günde kayıt olanlar
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newUsersLastWeek = await User.countDocuments({ createdAt: { $gte: lastWeek } });
    
    // Son 30 günde kayıt olanlar
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    const newUsersLastMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    
    return res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        usersWithData,
        newUsersLastWeek,
        newUsersLastMonth,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Kullanıcıya Paket Ata
 */
router.put('/users/:id/package', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { selectedPackage, purchases } = req.body;
    
    // findByIdAndUpdate kullan - Mixed type için daha güvenilir
    const updateData: any = {
      'dashboardData.selectedPackage': selectedPackage,
      'packageType': selectedPackage.name?.includes('Premium') ? 'premium' : 
                     selectedPackage.name?.includes('Pro') ? 'pro' : 'basic',
    };
    
    // Purchases için $push kullan
    const updateOperations: any = { $set: updateData };
    
    if (purchases && purchases.length > 0) {
      updateOperations.$push = { 
        'dashboardData.purchases': { $each: purchases } 
      };
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateOperations,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    return res.json({
      success: true,
      message: `Paket atandı: ${selectedPackage.name}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Tek Video Getir (büyük veri için ayrı endpoint)
 */
router.get('/users/:id/video/:testType/:testIndex', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, testType, testIndex } = req.params;
    const user = await User.findById(id).select('dashboardData.clinicalAssessments').lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    const tests = (user as any).dashboardData?.clinicalAssessments?.[testType];
    if (!tests || !tests[parseInt(testIndex)]) {
      return res.status(404).json({
        success: false,
        error: 'Video bulunamadı',
      });
    }
    
    const video = tests[parseInt(testIndex)].video;
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Bu test için video yok',
      });
    }
    
    return res.json({
      success: true,
      data: { video },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Admin Notları Kaydet
 */
router.put('/users/:id/notes', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminNotes, noteDate } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          'dashboardData.adminNotes': adminNotes,
          'dashboardData.adminNoteDate': noteDate 
        } 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    return res.json({
      success: true,
      message: 'Admin notları kaydedildi',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Kullanıcı Verilerini Sil (KVKK uyumlu)
 */
router.delete('/users/:id/clear-data', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dataType } = req.body; // 'all', 'clinical', 'photos', 'form'
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    let updateQuery: any = {};
    let message = '';
    
    switch (dataType) {
      case 'clinical':
        updateQuery = { $unset: { 'dashboardData.clinicalAssessments': 1 } };
        message = 'Klinik test sonuçları silindi';
        break;
        
      case 'photos':
        updateQuery = { $unset: { 'dashboardData.photos': 1 } };
        message = 'Fotoğraflar silindi';
        break;
        
      case 'form':
        updateQuery = { 
          $unset: { 
            'dashboardData.assessmentResults': 1,
            'dashboardData.formData': 1 
          } 
        };
        message = 'Form verileri silindi';
        break;
        
      case 'all':
        const dashboardData = user.dashboardData as any;
        updateQuery = { 
          $set: { 
            dashboardData: {
              adminNotes: dashboardData?.adminNotes, // Admin notlarını koru
              adminNoteDate: dashboardData?.adminNoteDate
            }
          } 
        };
        message = 'Tüm veriler silindi (admin notları korundu)';
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veri tipi',
        });
    }
    
    await User.findByIdAndUpdate(userId, updateQuery);
    
    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Egzersiz Programı Ata
 */
router.post('/users/:id/exercise-program', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, exercises, frequency, duration, notes, assignedAt, assignedBy } = req.body;
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    // Yeni program objesi
    const newProgram = {
      id: Date.now().toString(),
      title,
      description,
      exercises,
      frequency: parseInt(frequency),
      duration: parseInt(duration),
      notes,
      assignedAt,
      assignedBy,
      status: 'active',
      progress: 0,
      completedSessions: 0,
      totalSessions: parseInt(frequency) * parseInt(duration)
    };
    
    // Dashboard data'yı güncelle
    const dashboardData = user.dashboardData as any || {};
    
    // Mevcut programları al veya boş array oluştur
    const existingPrograms = dashboardData.exercisePrograms || [];
    
    // Eski aktif programları pasif yap
    existingPrograms.forEach((p: any) => {
      if (p.status === 'active') p.status = 'archived';
    });
    
    // Yeni programı ekle
    existingPrograms.unshift(newProgram);
    
    // Bildirim ekle - eski program bildirimlerini temizle
    let notifications = dashboardData.notifications || [];
    // Eski program bildirimlerini sil (sadece en son program bildirimi kalsın)
    notifications = notifications.filter((n: any) => n.type !== 'program');
    notifications.unshift({
      id: Date.now().toString(),
      type: 'program',
      title: '🎉 Yeni Egzersiz Programınız Hazır!',
      message: `"${title}" programı sizin için hazırlandı. Hemen başlayın!`,
      date: new Date().toISOString(),
      read: false
    });
    
    // Güncelle
    await User.findByIdAndUpdate(userId, {
      $set: {
        'dashboardData.exercisePrograms': existingPrograms,
        'dashboardData.notifications': notifications,
        'dashboardData.hasNewProgram': true
      }
    });
    
    return res.json({
      success: true,
      message: 'Egzersiz programı başarıyla atandı',
      data: newProgram
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Egzersiz Programı Sil
 */
router.delete('/users/:id/delete-program', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { programIndex } = req.body;
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    // Dashboard data'yı al
    const dashboardData = user.dashboardData as any || {};
    const existingPrograms = dashboardData.exercisePrograms || [];
    
    // Program index kontrolü
    if (programIndex < 0 || programIndex >= existingPrograms.length) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz program indeksi',
      });
    }
    
    // Programı sil
    existingPrograms.splice(programIndex, 1);
    
    // Güncelle
    await User.findByIdAndUpdate(userId, {
      $set: {
        'dashboardData.exercisePrograms': existingPrograms,
        'dashboardData.hasNewProgram': false
      }
    });
    
    return res.json({
      success: true,
      message: 'Egzersiz programı başarıyla silindi'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Kullanıcı Dashboard Verisini Güncelle (Genel)
 */
router.put('/users/:id/dashboard', adminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
      });
    }
    
    // Dashboard data'yı merge et
    user.dashboardData = {
      ...user.dashboardData,
      ...updateData,
    };
    
    await user.save();
    
    return res.json({
      success: true,
      message: 'Dashboard verisi güncellendi',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Development için: Email ile kullanıcı silme
 */
router.delete('/user/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Bu endpoint sadece development modunda kullanılabilir',
      });
    }

    const { email } = req.params;
    const result = await User.deleteOne({ email });
    
    await VerificationCode.deleteMany({ email });

    return res.json({
      success: true,
      message: `Kullanıcı silindi: ${email}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


