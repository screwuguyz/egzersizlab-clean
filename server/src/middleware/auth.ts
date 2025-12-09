import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

/**
 * JWT Authentication Middleware - Güvenli token doğrulama
 */

// Request interface'i genişlet
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Token'ı header'dan al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Yetkilendirme hatası. Lütfen giriş yapın.',
      });
      return;
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Kullanıcıyı bul (password olmadan)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Kullanıcı bulunamadı.',
      });
      return;
    }

    // Request'e kullanıcıyı ekle
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Geçersiz veya süresi dolmuş token.',
    });
  }
};

// JWT token oluştur
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

