# MP4 Squat Animasyonu Kullanım Rehberi

## ✅ Kod Hazır!

MP4 video dosyasını kullanmak için kod hazırlandı. Artık MP4 dosyanızı ekleyebilirsiniz.

## 📁 Dosya Konumu

MP4 dosyanızı şu klasöre koyun:

```
egersizlab-latest/
  └── public/
      └── animations/
          └── squat-animation.mp4
```

## 🔧 Adımlar

### 1. Klasörleri Oluşturun

Eğer `public` ve `animations` klasörleri yoksa, oluşturun:

**Windows CMD:**
```cmd
mkdir public
mkdir public\animations
```

**Veya manuel olarak:**
- Ana dizinde `public` klasörü oluşturun
- `public` içinde `animations` klasörü oluşturun

### 2. MP4 Dosyasını Koyun

MP4 dosyanızı şu isimle kaydedin:
- `squat-animation.mp4` (önerilen)
- Veya `squat-animation.webm` (alternatif)

**Dosya yolu:**
```
public/animations/squat-animation.mp4
```

### 3. Dosya Özellikleri

**Önerilen ayarlar:**
- **Format:** MP4 (H.264 codec)
- **Boyut:** 200x300px veya benzer oran
- **Süre:** Kısa döngü (2-5 saniye)
- **Boyut:** Mümkün olduğunca küçük (< 2MB)

### 4. Nasıl Çalışır?

1. **MP4 varsa:** Video otomatik oynatılır (loop, muted)
2. **MP4 yoksa:** SVG stick figure animasyonu gösterilir (fallback)

## 🎬 Video Hazırlama İpuçları

### Online Araçlar:
- [CloudConvert](https://cloudconvert.com) - Video formatı dönüştürme
- [EZGIF](https://ezgif.com) - Video'yu optimize etme
- [HandBrake](https://handbrake.fr) - Video sıkıştırma

### Video Optimizasyonu:
```bash
# FFmpeg ile optimize etme (opsiyonel)
ffmpeg -i input.mp4 -vf scale=200:300 -r 15 -b:v 500k squat-animation.mp4
```

## ✅ Test Etme

1. MP4 dosyasını `public/animations/` klasörüne koyun
2. Frontend'i başlatın: `start-frontend.bat`
3. Clinical Test Modal'ı açın
4. "Çömelme Testi (Squat)" seçin
5. Video görünmeli!

## 🔄 Alternatif Formatlar

Kod şu formatları da destekler:
- `.mp4` (öncelikli)
- `.webm` (alternatif)

Her ikisini de ekleyebilirsiniz, tarayıcı uygun olanı seçer.

## 📝 Notlar

- Video dosyası yoksa veya yüklenemezse, otomatik olarak SVG animasyon gösterilir
- Video `autoPlay`, `loop`, `muted` ve `playsInline` özellikleriyle çalışır
- Video boyutu 200x300px olarak ayarlanmıştır

## 🆘 Sorun Giderme

**Video görünmüyor:**
1. Dosya yolunu kontrol edin: `public/animations/squat-animation.mp4`
2. Dosya adının doğru olduğundan emin olun
3. Tarayıcı konsolunda hata var mı kontrol edin
4. SVG fallback çalışıyorsa, video yüklenemiyor demektir

**Video çok büyük:**
- Video sıkıştırma araçları kullanın
- Dosya boyutunu < 2MB'a düşürün


