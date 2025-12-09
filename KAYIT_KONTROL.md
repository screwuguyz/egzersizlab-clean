# Kayıt Kontrol Rehberi

## ✅ Kayıt Başarılı mı Kontrol Etme

### 1. Tarayıcı Console (F12)
1. Tarayıcıda **F12** tuşuna basın
2. **Console** sekmesine gidin
3. Hata mesajı var mı kontrol edin
4. **Application** (veya Storage) sekmesine gidin
5. **Local Storage** > `http://localhost:3001` seçin
6. **`token`** anahtarı var mı kontrol edin
   - Varsa: ✅ Token kaydedilmiş, kayıt başarılı!
   - Yoksa: ❌ Token kaydedilmemiş, sorun var

### 2. MongoDB Atlas'ta Kontrol
1. https://cloud.mongodb.com adresine gidin
2. Giriş yapın
3. Sol menüden **"Database"** tıklayın
4. **"Browse Collections"** butonuna tıklayın
5. **`egersizlab`** veritabanını seçin
6. **`users`** koleksiyonunu açın
7. Kayıtlı kullanıcıyı görmelisiniz:
   ```json
   {
     "_id": "...",
     "email": "ataafurkan@gmail.com",
     "name": "...",
     "packageType": "none",
     "createdAt": "...",
     "updatedAt": "..."
   }
   ```
   - **Not:** `password` alanı görünmez (güvenlik için hashlenmiş)

### 3. Backend Terminalinde Kontrol
Backend terminalinde şu mesajları görmelisiniz:
```
POST /api/auth/register 201
```

### 4. Dashboard'a Yönlendirme
Kayıt sonrası otomatik olarak Dashboard'a (`/#dashboard`) yönlendirilmiş olmalısınız.

## 🔍 Sorun Giderme

### Token yoksa:
- Backend çalışıyor mu kontrol edin
- Network sekmesinde (F12) `/api/auth/register` isteğini kontrol edin
- Response'u kontrol edin

### MongoDB'de kullanıcı yoksa:
- Backend MongoDB'ye bağlanabildi mi kontrol edin
- Backend terminalinde hata var mı bakın

### Dashboard'a yönlendirilmediyse:
- Tarayıcı URL'ini kontrol edin
- Manuel olarak `/#dashboard` adresine gidin

