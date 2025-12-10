import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js';
import { PasswordResetCode } from '../models/PasswordResetCode.js';
import { generateToken, protect, AuthRequest } from '../middleware/auth.js';
import { CustomError } from '../middleware/errorHandler.js';
import { authLimiter } from '../config/security.js';
import { sendVerificationCode, sendPasswordResetCode } from '../services/emailService.js';

const router = express.Router();

/**
 * 4 haneli rastgele kod oluştur
 */
const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999 arası
};

/**
 * Aktivasyon Kodu Gönder - Kayıt başlatma
 */
router.post(
  '/send-verification-code',
  authLimiter, // Rate limiting
  [
    body('email')
      .isEmail()
      .withMessage('Geçerli bir e-posta adresi giriniz')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Şifre en az 8 karakter olmalıdır')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('İsim 2-100 karakter arasında olmalıdır')
      .escape(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password, name, phone } = req.body;

      // Kullanıcı zaten var mı kontrol et
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Bu e-posta adresi zaten kullanılıyor',
        });
      }

      // 4 haneli kod oluştur
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

      // Eski kodları sil (aynı email için)
      await VerificationCode.deleteMany({ email, verified: false });

      // Yeni kod kaydet
      await VerificationCode.create({
        email,
        code,
        expiresAt,
        verified: false,
      });

      // Email gönder
      try {
        await sendVerificationCode(email, code, name);
        return res.json({
          success: true,
          message: 'Aktivasyon kodu e-posta adresinize gönderildi',
          code, // güvenlik gereği prod’da kaldırılmalı; ağ kısıtı için ekliyoruz
        });
      } catch (emailError) {
        console.error('Email gönderme hatası:', emailError);
        // Email gönderilemese bile kodu response'a ekleyelim (ağ engeli yaşayan kullanıcılar için)
        return res.status(200).json({
          success: true,
          message: 'Email gönderilemedi, aşağıdaki kodu manuel girin.',
          code,
          error: emailError instanceof Error ? emailError.message : 'email error',
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Aktivasyon Kodunu Doğrula ve Kayıt Tamamla
 */
router.post(
  '/verify-and-register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz').normalizeEmail(),
    body('code')
      .isLength({ min: 4, max: 4 })
      .withMessage('Kod 4 haneli olmalıdır')
      .matches(/^\d{4}$/)
      .withMessage('Kod sadece rakamlardan oluşmalıdır'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Şifre en az 8 karakter olmalıdır')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('İsim 2-100 karakter arasında olmalıdır')
      .escape(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, code, password, name, phone } = req.body;

      // Kodu kontrol et
      const verificationCode = await VerificationCode.findOne({
        email,
        code,
        verified: false,
        expiresAt: { $gt: new Date() }, // Süresi dolmamış
      });

      if (!verificationCode) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veya süresi dolmuş aktivasyon kodu',
        });
      }

      // Kullanıcı zaten var mı kontrol et (son bir kontrol)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Bu e-posta adresi zaten kullanılıyor',
        });
      }

      // Kullanıcıyı oluştur
      const user = await User.create({
        email,
        password,
        name,
        phone,
      });

      // Kodu işaretle (verified = true)
      verificationCode.verified = true;
      await verificationCode.save();

      // Token oluştur
      const token = generateToken(user._id.toString());

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          packageType: user.packageType,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Kullanıcı Girişi - Güvenli doğrulama
 */
router.post(
  '/login',
  authLimiter, // Rate limiting - brute force koruması
  [
    body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz').normalizeEmail(),
    body('password').notEmpty().withMessage('Şifre gereklidir'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Kullanıcıyı bul (password ile birlikte)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Kullanıcı bulunamadı',
          errorCode: 'USER_NOT_FOUND',
        });
      }

      // Şifreyi kontrol et
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          error: 'Şifre hatalı',
          errorCode: 'INVALID_PASSWORD',
        });
      }

      // Token oluştur
      const token = generateToken(user._id.toString());

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          packageType: user.packageType,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Mevcut Kullanıcı Bilgileri - Token ile korumalı
 */
router.get('/me', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Şifre Sıfırlama - Kod Gönder
 */
router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Geçerli bir e-posta adresi giriniz')
      .normalizeEmail(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      // Kullanıcı var mı kontrol et
      const user = await User.findOne({ email });
      if (!user) {
        // Güvenlik: Kullanıcı yoksa da aynı mesajı döndür (email enumeration koruması)
        return res.json({
          success: true,
          message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama kodu gönderildi',
        });
      }

      // 4 haneli kod oluştur
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

      // Eski kodları sil (aynı email için)
      await PasswordResetCode.deleteMany({ email, used: false });

      // Yeni kod kaydet
      await PasswordResetCode.create({
        email,
        code,
        expiresAt,
        used: false,
      });

      // Development modunda kodu konsola yazdırma - artık sadece email gönderilecek

      // Email gönder
      try {
        await sendPasswordResetCode(email, code, user.name);
      } catch (emailError: any) {
        console.error('❌ Email gönderme hatası:', emailError);
        // Email gönderilemediyse hata döndür
        return res.status(500).json({
          success: false,
          error: `Email gönderilemedi: ${emailError.message}. Lütfen daha sonra tekrar deneyin veya sistem yöneticisiyle iletişime geçin.`,
        });
      }

      // Development ortamında kolay test için kodu response'a ekle
      const responsePayload: any = {
        success: true,
        message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama kodu gönderildi',
      };
      
      // Development modunda kodu response'a da ekle (test için)
      if (process.env.NODE_ENV === 'development') {
        responsePayload.code = code;
        responsePayload.debug = 'Development modu: Kod response içinde';
      }
      if (process.env.NODE_ENV === 'development') {
        responsePayload.code = code;
      }

      res.json(responsePayload);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Şifre Sıfırlama - Kodu Doğrula ve Şifreyi Güncelle
 */
router.post(
  '/reset-password',
  authLimiter,
  [
    body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz').normalizeEmail(),
    body('code')
      .isLength({ min: 4, max: 4 })
      .withMessage('Kod 4 haneli olmalıdır')
      .matches(/^\d{4}$/)
      .withMessage('Kod sadece rakamlardan oluşmalıdır'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Şifre en az 8 karakter olmalıdır')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, code, newPassword } = req.body;

      // Kodu kontrol et
      const resetCode = await PasswordResetCode.findOne({
        email,
        code,
        used: false,
        expiresAt: { $gt: new Date() }, // Süresi dolmamış
      });

      if (!resetCode) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veya süresi dolmuş şifre sıfırlama kodu',
        });
      }

      // Kullanıcıyı bul
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Kullanıcı bulunamadı',
        });
      }

      // Şifreyi güncelle
      user.password = newPassword;
      await user.save();

      // Kodu işaretle (used = true)
      resetCode.used = true;
      await resetCode.save();

      res.json({
        success: true,
        message: 'Şifreniz başarıyla güncellendi. Lütfen yeni şifrenizle giriş yapın.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Dashboard Verilerini Kaydet
 */
router.put(
  '/dashboard/data',
  protect, // Kullanıcı giriş yapmış olmalı
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Yetkilendirme hatası',
        });
      }

      const { assessmentResults, exercisePrograms, progressData, notifications, photos, formData, clinicalAssessments } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Kullanıcı bulunamadı',
        });
      }

      // Dashboard verilerini güncelle - Her yeni assessment eski verileri üzerine yazar
      if (!user.dashboardData) {
        user.dashboardData = {};
      }

      // Assessment verileri geldiğinde - ESKİ VERİLERİ SİL, YENİSİNİ KAYDET
      if (assessmentResults !== undefined) {
        // Eski assessment verilerini tamamen sil, yenisini kaydet
        user.dashboardData.assessmentResults = assessmentResults;
        // Assessment yapıldığında tarihi güncelle
        user.dashboardData.lastAssessmentDate = new Date();
      }
      
      // Fotoğraflar geldiğinde - ESKİ FOTOĞRAFLARI SİL, YENİLERİNİ KAYDET
      if (photos !== undefined) {
        user.dashboardData.photos = photos;
      }
      
      // Form verileri geldiğinde - ESKİ FORM VERİLERİNİ SİL, YENİSİNİ KAYDET
      if (formData !== undefined) {
        user.dashboardData.formData = formData;
      }
      
      // Klinik test assessment'ları geldiğinde - ESKİ VERİLERİ SİL, YENİSİNİ KAYDET
      if (clinicalAssessments !== undefined) {
        user.dashboardData.clinicalAssessments = clinicalAssessments;
        user.dashboardData.lastClinicalAssessmentDate = new Date();
      }
      
      // Diğer veriler (egzersiz programları, ilerleme, bildirimler) - bunlar korunur
      if (exercisePrograms !== undefined) {
        user.dashboardData.exercisePrograms = exercisePrograms;
      }
      if (progressData !== undefined) {
        user.dashboardData.progressData = progressData;
      }
      if (notifications !== undefined) {
        user.dashboardData.notifications = notifications;
      }

      user.dashboardData.lastLogin = new Date();

      await user.save();

      res.json({
        success: true,
        message: 'Dashboard verileri başarıyla kaydedildi',
        data: user.dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Dashboard Verilerini Getir
 */
router.get(
  '/dashboard/data',
  protect,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Yetkilendirme hatası',
        });
      }

      const user = await User.findById(userId).select('dashboardData');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Kullanıcı bulunamadı',
        });
      }

      res.json({
        success: true,
        data: user.dashboardData || {},
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

