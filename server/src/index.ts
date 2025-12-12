import express, { Application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import { connectDatabase } from './config/database.js';
import {
  corsConfig,
  helmetConfig,
  apiLimiter,
  sanitizeInput,
  securityHeaders,
} from './config/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Güvenlik: Middleware'ler (sıra önemli!)
app.use(helmetConfig); // Güvenlik headers
app.use(securityHeaders); // Ek güvenlik headers
app.use(corsConfig); // CORS
app.use(compression()); // Performans: Gzip compression
app.use(express.json({ limit: '10mb' })); // Body parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput); // XSS koruması

// Logging (development'ta detaylı, production'da minimal)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting (tüm API'ler için)
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Development için

// 404 handler
app.use(notFound);

// Error handler (en sonda olmalı)
app.use(errorHandler);

// Server başlat
const startServer = async () => {
  try {
    // Database bağlantısı
    await connectDatabase();

    // Server'ı dinle
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Server çalışıyor!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔒 Güvenlik: Aktif
      `);
    });

    // Port kullanımda hatası için özel hata yönetimi
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`
❌ HATA: Port ${PORT} zaten kullanımda!
        
🔧 Çözüm seçenekleri:
   1. Port 5000'i kullanan işlemi kapatın:
      netstat -ano | findstr :5000
      taskkill /PID [PID_NUMARASI] /F
   
   2. Veya farklı bir port kullanın:
      set PORT=5001
      npm run dev
        `);
        process.exit(1);
      } else {
        console.error('❌ Server hatası:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Server başlatılamadı:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM sinyali alındı, server kapatılıyor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT sinyali alındı, server kapatılıyor...');
  process.exit(0);
});

startServer();

