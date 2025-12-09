# EgzersizLab Backend API

Güvenli, hacklenmesi zor backend API sistemi.

## 🔒 Güvenlik Özellikleri

- ✅ **Helmet.js** - Güvenlik headers (XSS, clickjacking koruması)
- ✅ **CORS** - Sadece izin verilen origin'lerden istek kabul eder
- ✅ **Rate Limiting** - Brute force saldırılarına karşı koruma
- ✅ **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama
- ✅ **bcrypt** - Şifreler hashlenir (salt + rounds)
- ✅ **Input Validation** - express-validator ile güvenli input kontrolü
- ✅ **XSS Protection** - Input sanitization
- ✅ **SQL Injection Protection** - MongoDB ile NoSQL injection koruması
- ✅ **Error Handling** - Güvenli hata mesajları (production'da detay gizlenir)

## 📋 Gereksinimler

- Node.js 18+ 
- MongoDB (local veya MongoDB Atlas)
- npm veya yarn

## 🚀 Kurulum

1. **Bağımlılıkları yükle:**
```bash
cd server
npm install
```

2. **Environment variables oluştur:**
```bash
# .env dosyası oluştur ve aşağıdaki değerleri doldur:
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-immediately-min-32-chars
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/egersizlab
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_KEY=your-gemini-api-key
```

**⚠️ ÖNEMLİ:** 
- `JWT_SECRET` için güçlü bir random string kullanın (en az 32 karakter)
- Linux/Mac: `openssl rand -base64 32`
- Windows: PowerShell'de random string oluşturun
- `.env` dosyasını ASLA Git'e commit etmeyin!

3. **MongoDB'yi başlat:**
```bash
# Local MongoDB için:
mongod

# Veya MongoDB Atlas kullanıyorsanız, connection string'i .env'e ekleyin
```

4. **Development modunda çalıştır:**
```bash
npm run dev
```

5. **Production build:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri (Token gerekli)

### Health Check

- `GET /health` - Server durumu

## 🔐 Güvenlik Best Practices

1. **JWT Secret:** Production'da mutlaka güçlü bir secret kullanın
2. **HTTPS:** Production'da mutlaka HTTPS kullanın
3. **Environment Variables:** Hassas bilgileri .env'de saklayın
4. **Rate Limiting:** Brute force saldırılarına karşı aktif
5. **Password Policy:** Minimum 8 karakter, büyük/küçük harf + rakam
6. **Error Messages:** Production'da detaylı hata mesajları gizlenir

## 🛠️ Geliştirme

- TypeScript kullanılıyor
- Hot reload: `npm run dev`
- Type checking: `npm run type-check`

## 📝 Notlar

- Şifreler bcrypt ile hashlenir (10 rounds)
- Token süresi varsayılan 7 gün
- Rate limiting: 15 dakikada 100 istek (genel), 5 istek (auth)
- CORS sadece FRONTEND_URL'den istek kabul eder

