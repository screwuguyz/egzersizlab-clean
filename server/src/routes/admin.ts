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
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı',
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


