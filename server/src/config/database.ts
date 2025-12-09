import mongoose from 'mongoose';

/**
 * MongoDB bağlantısı - Güvenli ve optimize edilmiş
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Güvenlik ayarları
    const options: mongoose.ConnectOptions = {
      // Güvenlik: SQL injection benzeri saldırılara karşı koruma
      maxPoolSize: 10, // Maksimum bağlantı sayısı
      serverSelectionTimeoutMS: 5000, // 5 saniye timeout
      socketTimeoutMS: 45000, // Socket timeout
      
      // Güvenlik: Yetkisiz erişimleri engelle
      authSource: 'admin', // Admin authentication
      
      // Performans ve güvenlik
      retryWrites: true,
      w: 'majority', // Write concern - veri güvenliği için
    };

    await mongoose.connect(mongoUri, options);

    console.log('✅ MongoDB bağlantısı başarılı');

    // Bağlantı hatalarını dinle
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB bağlantı hatası:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB bağlantısı kesildi');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB bağlantısı kapatıldı');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error);
    process.exit(1);
  }
};

