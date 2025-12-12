# Klinik Testler - Şikayete Göre Filtreleme Test Rehberi

## 🎯 Test Senaryoları

### Senaryo 1: Boyun Ağrısı Testi

**Adımlar:**
1. Frontend'i başlatın: `start-frontend.bat`
2. Tarayıcıda `http://localhost:3000` açın
3. Dashboard'a giriş yapın
4. "Analizi Başlat" butonuna tıklayın
5. AssessmentWizard'da:
   - Adım 1: Kişisel bilgileri doldurun
   - Adım 2: **Boyun bölgesini seçin** (vücut diyagramında boyun bölgesine tıklayın)
   - Adım 3-5: Diğer adımları tamamlayın
6. Assessment'ı tamamlayın
7. Dashboard'a dönün
8. "Klinik Testler" bölümünden **"Kas Kuvveti Değerlendirmesi"** butonuna tıklayın

**Beklenen Sonuç:**
- ✅ Sadece boyun/omuz ile ilgili testler görünmeli
- ❌ Squat testi görünmemeli (boyun ile ilgili değil)
- ✅ Duvarda Şınav testi görünebilir (omuz ile ilgili)

---

### Senaryo 2: Diz Ağrısı Testi

**Adımlar:**
1. AssessmentWizard'ı tekrar açın
2. Adım 2'de **diz bölgesini seçin** (her iki diz)
3. Assessment'ı tamamlayın
4. "Kas Kuvveti Değerlendirmesi" butonuna tıklayın

**Beklenen Sonuç:**
- ✅ Squat testi görünmeli (diz ile ilgili)
- ✅ Tek Ayak Duruş testi görünmeli (diz ile ilgili)
- ❌ Duvarda Şınav testi görünmemeli (diz ile ilgili değil)

---

### Senaryo 3: Bel Ağrısı Testi

**Adımlar:**
1. AssessmentWizard'ı tekrar açın
2. Adım 2'de **bel bölgesini seçin** (lower-back)
3. Assessment'ı tamamlayın
4. "Kas Kuvveti Değerlendirmesi" butonuna tıklayın

**Beklenen Sonuç:**
- ✅ Squat testi görünmeli (bel ile ilgili)
- ✅ Köprü testi görünmeli (bel ile ilgili)
- ✅ Plank testi görünmeli (bel ile ilgili)
- ❌ Duvarda Şınav testi görünmemeli (bel ile ilgili değil)

---

### Senaryo 4: Çoklu Bölge Ağrısı

**Adımlar:**
1. AssessmentWizard'ı tekrar açın
2. Adım 2'de **birden fazla bölge seçin** (örn: boyun + omuz + bel)
3. Assessment'ı tamamlayın
4. "Kas Kuvveti Değerlendirmesi" butonuna tıklayın

**Beklenen Sonuç:**
- ✅ Seçilen tüm bölgelerle ilgili testler görünmeli
- ✅ Hem üst vücut hem alt vücut testleri görünebilir

---

### Senaryo 5: Ağrılı Bölge Yok

**Adımlar:**
1. AssessmentWizard'ı tekrar açın
2. Adım 2'de **hiçbir bölge seçmeyin** veya localStorage'ı temizleyin
3. Assessment'ı tamamlayın
4. "Kas Kuvveti Değerlendirmesi" butonuna tıklayın

**Beklenen Sonuç:**
- ✅ Tüm testler görünmeli (filtreleme yapılmamalı)

---

## 🔍 Kontrol Noktaları

### 1. localStorage Kontrolü
Tarayıcı konsolunda (F12) şunu çalıştırın:
```javascript
JSON.parse(localStorage.getItem('userPainAreas'))
```
Seçtiğiniz bölgeleri görmelisiniz.

### 2. Test Filtreleme Kontrolü
- ClinicalTestModal açıldığında console'da filtreleme logları olabilir
- Test sayısı değişmeli (örn: boyun için 5 test yerine 2-3 test)

### 3. Test İçerikleri
- Her testin `relevantBodyAreas` array'i var mı kontrol edin
- Test ID'leri doğru mu kontrol edin

---

## 🐛 Sorun Giderme

### Problem: Testler filtrelenmiyor
**Çözüm:**
1. localStorage'ı kontrol edin: `localStorage.getItem('userPainAreas')`
2. AssessmentWizard'ın tamamlandığından emin olun
3. Sayfayı yenileyin (F5)

### Problem: Tüm testler görünüyor
**Çözüm:**
1. AssessmentWizard'da bölge seçtiğinizden emin olun
2. Assessment'ı tamamlayın
3. localStorage'da veri olduğunu kontrol edin

### Problem: Hiç test görünmüyor
**Çözüm:**
1. `userPainAreas` prop'unun geçirildiğini kontrol edin
2. Test konfigürasyonlarında `relevantBodyAreas` olduğunu kontrol edin
3. Filtreleme mantığını kontrol edin

---

## 📝 Test Verileri

### Bölge ID'leri (AssessmentWizard'dan):
- Boyun: `'neck-front'`, `'neck-back'`
- Omuz: `'shoulder-front-left'`, `'shoulder-front-right'`, `'shoulder-back-left'`, `'shoulder-back-right'`
- Bel: `'lower-back'`
- Diz: `'knee-front-left'`, `'knee-front-right'`, `'knee-back-left'`, `'knee-back-right'`
- Kalça: `'hip-front'`, `'hip-back'`
- Uyluk: `'thigh-front-left'`, `'thigh-front-right'`, `'thigh-back-left'`, `'thigh-back-right'`

### Test-Bölge Eşleştirmeleri:
- **Squat**: diz, kalça, bel, uyluk
- **Tek Ayak Duruş**: ayak bileği, diz, kalça, bel
- **Duvarda Şınav**: omuz, dirsek, el bileği, göğüs, sırt
- **Köprü**: bel, kalça, uyluk
- **Plank**: bel, sırt, omuz, dirsek, karın

---

## ✅ Başarı Kriterleri

1. ✅ Boyun ağrısı seçildiğinde squat görünmemeli
2. ✅ Diz ağrısı seçildiğinde squat görünmeli
3. ✅ Bel ağrısı seçildiğinde köprü ve plank görünmeli
4. ✅ Ağrılı bölge yoksa tüm testler görünmeli
5. ✅ localStorage'da veri kaydediliyor
6. ✅ Dashboard'dan ClinicalTestModal'a veri geçiyor

---

## 🚀 Hızlı Test

1. Tarayıcı konsolunu açın (F12)
2. localStorage'a manuel veri ekleyin:
```javascript
localStorage.setItem('userPainAreas', JSON.stringify(['neck-front', 'neck-back']))
```
3. Sayfayı yenileyin
4. "Kas Kuvveti Değerlendirmesi" butonuna tıklayın
5. Sadece boyun/omuz ile ilgili testler görünmeli

