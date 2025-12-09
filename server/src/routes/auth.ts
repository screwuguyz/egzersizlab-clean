import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js';
import { generateToken, protect, AuthRequest } from '../middleware/auth.js';
import { CustomError } from '../middleware/errorHandler.js';
import { authLimiter } from '../config/security.js';
import { sendVerificationCode } from '../services/emailService.js';

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

      // Email gönder (geçici olarak password ve name'i sakla - güvenli değil ama pratik)
      // Production'da bu bilgileri session'da saklamak daha iyi olur
      try {
        await sendVerificationCode(email, code, name);
      } catch (emailError) {
        console.error('Email gönderme hatası:', emailError);
        // Email gönderilemese bile devam et (development için)
      }

      res.json({
        success: true,
        message: 'Aktivasyon kodu e-posta adresinize gönderildi',
        // Development için konsola da yazdırılıyor
      });
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
          error: 'E-posta veya şifre hatalı', // Güvenlik: Hangi alanın hatalı olduğunu söyleme
        });
      }

      // Şifreyi kontrol et
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          error: 'E-posta veya şifre hatalı', // Güvenlik: Aynı mesaj
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

export default router;

