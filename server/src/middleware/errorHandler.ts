import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

/**
 * Merkezi Hata Yönetimi - Güvenli hata mesajları
 */

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error (production'da gerçek logging servisi kullanılmalı)
  console.error('❌ Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Geçersiz ID formatı';
    error = new CustomError(message, 400);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = 'Bu e-posta adresi zaten kullanılıyor';
    error = new CustomError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new CustomError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Geçersiz token';
    error = new CustomError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token süresi dolmuş';
    error = new CustomError(message, 401);
  }

  res.status((error.statusCode as number) || 500).json({
    success: false,
    error: error.message || 'Sunucu hatası',
    // Development'ta stack trace göster, production'da gösterme
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Route bulunamadı: ${req.originalUrl}`, 404);
  next(error);
};

