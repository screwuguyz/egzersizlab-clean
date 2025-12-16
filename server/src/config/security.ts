import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Güvenlik yapılandırmaları - Hacklenmesi zor ayarlar
 */

// CORS yapılandırması - Sadece izin verilen origin'lerden istek kabul et
export const corsConfig = cors({
  origin: (origin, callback) => {
    // Development ve production origin'leri
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173', // Vite default
      // Production URLs
      'https://egzersizlab.com',
      'https://www.egzersizlab.com',
      'http://egzersizlab.com',
      'http://www.egzersizlab.com',
    ];
    
    // Origin yoksa (same-origin request) veya izin verilen listede ise kabul et
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by CORS'));
    }
  },
  credentials: true, // Cookie'ler için
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token'],
  exposedHeaders: ['X-Total-Count'],
});

// Helmet - Güvenlik headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Frontend için gerekli
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Rate Limiting - Brute force saldırılarına karşı koruma
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 dakika
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 istek
  message: {
    error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoint'leri için daha sıkı rate limiting
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // Sadece 5 deneme
  message: {
    error: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
  },
  skipSuccessfulRequests: true, // Başarılı istekleri sayma
});

// Input sanitization middleware - XSS koruması
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Basit XSS koruması - Daha gelişmiş için express-validator kullanılacak
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        // Tehlikeli karakterleri temizle
        return obj
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
          acc[key] = sanitize(obj[key]);
          return acc;
        }, {} as any);
      }
      return obj;
    };
    req.body = sanitize(req.body);
  }
  next();
};

// Güvenlik headers ekle
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // XSS koruması
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

