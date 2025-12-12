# Squat Animasyonu Dosya Formatları Rehberi

## 📁 Desteklenen Dosya Formatları

### 1. **Lottie Animasyon (.json)** ⭐ ÖNERİLEN
- **Dosya uzantısı:** `.json`
- **Kaynak:** After Effects'ten export edilir
- **Avantajlar:**
  - Vektör tabanlı (kalite kaybı yok)
  - Küçük dosya boyutu
  - React'te `lottie-react` ile kolay kullanım
  - Çok detaylı animasyonlar
- **Nereden bulunur:**
  - [LottieFiles.com](https://lottiefiles.com) - Ücretsiz squat animasyonları
  - [IconScout](https://iconscout.com) - Premium animasyonlar
  - After Effects ile kendi animasyonunuzu oluşturun

### 2. **GIF Animasyon (.gif)**
- **Dosya uzantısı:** `.gif`
- **Avantajlar:**
  - Her yerde çalışır
  - Kolay kullanım
- **Dezavantajlar:**
  - Dosya boyutu büyük olabilir
  - Kalite sınırlı
- **Nereden bulunur:**
  - [Giphy](https://giphy.com) - "squat exercise" araması
  - [Tenor](https://tenor.com)
  - [Pexels](https://www.pexels.com/videos/) - Video'dan GIF'e çevirebilirsiniz

### 3. **SVG Animasyon (.svg)**
- **Dosya uzantısı:** `.svg`
- **Avantajlar:**
  - Vektör tabanlı
  - CSS/JavaScript ile animasyon
  - Mevcut kodunuz SVG kullanıyor
- **Nereden bulunur:**
  - [Flaticon](https://www.flaticon.com) - SVG animasyonları
  - [SVG Repo](https://www.svgrepo.com)
  - Kendi SVG'nizi animasyonlu hale getirin

### 4. **Video Dosyası (.mp4, .webm)**
- **Dosya uzantıları:** `.mp4`, `.webm`
- **Avantajlar:**
  - En gerçekçi görünüm
  - Profesyonel kalite
- **Dezavantajlar:**
  - Büyük dosya boyutu
  - Yükleme süresi
- **Nereden bulunur:**
  - [Pexels Videos](https://www.pexels.com/videos/)
  - [Pixabay](https://pixabay.com/videos/)
  - Kendi videonuzu çekin

### 5. **Canvas Animasyon (JavaScript)**
- **Dosya uzantısı:** `.js` veya `.tsx`
- **Avantajlar:**
  - Tam kontrol
  - Interaktif olabilir
  - Dosya boyutu küçük
- **Kütüphaneler:**
  - `framer-motion` - React animasyon kütüphanesi
  - `react-spring` - Fizik tabanlı animasyonlar
  - Vanilla Canvas API

### 6. **Sprite Sheet (PNG + JSON)**
- **Dosya uzantıları:** `.png` + `.json`
- **Avantajlar:**
  - Frame-by-frame animasyon
  - Yüksek kalite
- **Dezavantajlar:**
  - Çok sayıda frame gerekir
  - Dosya boyutu büyük olabilir

---

## 🎯 Önerilen Çözüm: Lottie Animasyon

### Adım 1: Lottie Animasyonu İndirin
1. [LottieFiles.com](https://lottiefiles.com) adresine gidin
2. "squat" veya "exercise squat" araması yapın
3. Ücretsiz bir animasyon seçin
4. **JSON formatında** indirin

### Adım 2: Projeye Ekleyin
```
egersizlab-latest/
  └── public/
      └── animations/
          └── squat-animation.json
```

### Adım 3: React'te Kullanın
```bash
npm install lottie-react
```

---

## 📦 Hızlı Kurulum Komutları

```bash
# Lottie için
npm install lottie-react

# Framer Motion için (alternatif)
npm install framer-motion

# React Spring için (alternatif)
npm install react-spring
```

---

## 🔗 Yararlı Kaynaklar

### Ücretsiz Animasyon Siteleri:
1. **LottieFiles** - https://lottiefiles.com
   - Arama: "squat", "exercise", "fitness"
   
2. **Giphy** - https://giphy.com
   - Arama: "squat exercise gif"
   
3. **Pexels** - https://www.pexels.com/videos/
   - Arama: "squat exercise video"

4. **Flaticon** - https://www.flaticon.com
   - SVG animasyonları

### Animasyon Oluşturma:
- **After Effects** → Lottie export
- **Blender** → 3D animasyon
- **Figma** → SVG animasyon

---

## 💡 Örnek Kullanım

Detaylı implementasyon için `components/ClinicalTestModal.tsx` dosyasına bakın.
Mevcut kod SVG stick figure kullanıyor, bunu Lottie veya GIF ile değiştirebilirsiniz.

