# MongoDB Kurulum Rehberi

## Seçenek 1: MongoDB Atlas (Önerilen - Ücretsiz)

### Adımlar:

1. **MongoDB Atlas'a kaydol:**
   - https://www.mongodb.com/cloud/atlas/register adresine git
   - Ücretsiz hesap oluştur (M0 - Free Tier)

2. **Cluster oluştur:**
   - "Build a Database" tıkla
   - "Free" seçeneğini seç
   - Cloud provider ve region seç (AWS, Europe - Frankfurt önerilir)
   - Cluster adı: `egersizlab-cluster`
   - "Create" tıkla

3. **Database User oluştur:**
   - "Database Access" menüsüne git
   - "Add New Database User" tıkla
   - Authentication Method: "Password"
   - Username ve Password oluştur (güçlü bir şifre!)
   - Database User Privileges: "Atlas admin" veya "Read and write to any database"
   - "Add User" tıkla

4. **Network Access ayarla:**
   - "Network Access" menüsüne git
   - "Add IP Address" tıkla
   - Development için: "Allow Access from Anywhere" (0.0.0.0/0)
   - Production için: Sadece kendi IP'nizi ekleyin
   - "Confirm" tıkla

5. **Connection String al:**
   - "Database" menüsüne git
   - "Connect" butonuna tıkla
   - "Connect your application" seç
   - Driver: Node.js, Version: 5.5 or later
   - Connection string'i kopyala
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/egersizlab?retryWrites=true&w=majority`

6. **.env dosyasını güncelle:**
   ```env
   MONGODB_URI=mongodb+srv://kullaniciadi:sifre@cluster.mongodb.net/egersizlab?retryWrites=true&w=majority
   ```
   - `<username>` ve `<password>` yerine kendi bilgilerinizi yazın

## Seçenek 2: Local MongoDB (Gelişmiş)

### Windows için:

1. **MongoDB Community Server indir:**
   - https://www.mongodb.com/try/download/community
   - Windows için MSI installer indir
   - Kurulum sırasında "Install MongoDB as a Service" seçeneğini işaretle

2. **MongoDB'yi başlat:**
   - Windows Services'ten MongoDB servisini başlat
   - Veya komut satırından: `net start MongoDB`

3. **Bağlantıyı test et:**
   - `.env` dosyasında zaten doğru: `mongodb://localhost:27017/egersizlab`

## Test

Backend'i başlattığınızda şu mesajı görmelisiniz:
```
✅ MongoDB bağlantısı başarılı
🚀 Server çalışıyor!
```

Eğer hata alırsanız, MongoDB bağlantı string'inizi kontrol edin.


