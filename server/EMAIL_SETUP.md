# Email Aktivasyon Sistemi Kurulumu

## ✅ Sistem Hazır!

Email aktivasyon sistemi kuruldu. Şimdi email göndermek için SMTP ayarlarını yapmanız gerekiyor.

## 📧 Email Ayarları

### Development Modu (Test için)

**Email ayarları yoksa:** Sistem konsola kod yazdırır, email göndermez. Bu şekilde test edebilirsiniz.

Backend terminalinde şunu göreceksiniz:
```
📧 EMAIL AKTİVASYON KODU (Development Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
E-posta: user@example.com
Kod: 1234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Production Modu (Gerçek Email)

`server/.env` dosyasına şunları ekleyin:

```env
# Email (Gmail için)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔐 Gmail App Password Oluşturma

1. Google Account → Security
2. "2-Step Verification" aktif olmalı
3. "App passwords" → "Select app" → "Mail"
4. "Select device" → "Other (Custom name)" → "EgzersizLab"
5. "Generate" → 16 haneli şifreyi kopyala
6. `.env` dosyasındaki `SMTP_PASS` değerine yapıştır

## 🧪 Test Etme

1. Backend'i başlat: `cd server && npm run dev`
2. Frontend'i başlat: `npm run dev`
3. Kayıt formunu doldur
4. "Hesabımı Oluştur" butonuna tıkla
5. **Development modunda:** Backend terminalinde kodu gör
6. **Production modunda:** Email'de kodu gör
7. Aktivasyon modalında kodu gir
8. Kayıt tamamlanır!

## 📝 Özellikler

- ✅ 4 haneli rastgele kod (1000-9999)
- ✅ 10 dakika geçerlilik süresi
- ✅ Kod tekrar gönderme (60 saniye bekleme)
- ✅ Otomatik kod temizleme (süresi dolunca)
- ✅ Güvenli email gönderimi
- ✅ Modern aktivasyon modalı

## 🔄 Akış

1. Kullanıcı formu doldurur
2. "Hesabımı Oluştur" → Aktivasyon kodu gönderilir
3. Aktivasyon modalı açılır
4. Kullanıcı 4 haneli kodu girer
5. Kod doğrulanır → Kullanıcı kaydedilir
6. Token oluşturulur → Dashboard'a yönlendirilir

## ⚠️ Notlar

- Development'ta email göndermeden test edebilirsiniz (konsola yazdırılır)
- Production'da mutlaka SMTP ayarlarını yapın
- Gmail için App Password kullanın (normal şifre çalışmaz)
- Kod 10 dakika geçerlidir, süresi dolunca otomatik silinir

