# 🎯 Değerlendirme Kısmındaki Tüm Ağrı Bölgeleri Listesi

Bu dokümantasyon, kullanıcıların seçebileceği tüm ağrı bölgelerini içerir.

## 📋 Bölge ID'leri ve Türkçe İsimleri

### 🧠 **BAŞ VE BOYUN**

| Bölge ID | Türkçe İsim | Görünüm |
|----------|-------------|---------|
| `head-front` | Baş | Ön |
| `head-back` | Baş (Arka) | Arka |
| `neck-front` | Boyun | Ön |
| `neck-back` | Boyun (Arka) | Arka |

---

### 💪 **ÜST VÜCUT - ÖN**

| Bölge ID | Türkçe İsim | Görünüm |
|----------|-------------|---------|
| `shoulder-front-left` | Sol Omuz | Ön |
| `shoulder-front-right` | Sağ Omuz | Ön |
| `chest` | Göğüs | Ön |
| `abdomen` | Karın | Ön |
| `elbow-front-left` | Sol Dirsek | Ön |
| `elbow-front-right` | Sağ Dirsek | Ön |
| `wrist-front-left` | Sol El Bileği | Ön |
| `wrist-front-right` | Sağ El Bileği | Ön |

---

### 💪 **ÜST VÜCUT - ARKA**

| Bölge ID | Türkçe İsim | Görünüm |
|----------|-------------|---------|
| `shoulder-back-left` | Sol Omuz | Arka |
| `shoulder-back-right` | Sağ Omuz | Arka |
| `upper-back` | Üst Sırt | Arka |
| `mid-back` | Orta Sırt | Arka |
| `lower-back` | Bel | Arka |
| `elbow-back-left` | Sol Dirsek | Arka |
| `elbow-back-right` | Sağ Dirsek | Arka |
| `wrist-back-left` | Sol El Bileği | Arka |
| `wrist-back-right` | Sağ El Bileği | Arka |

---

### 🦵 **ALT VÜCUT - ÖN**

| Bölge ID | Türkçe İsim | Görünüm |
|----------|-------------|---------|
| `hip-front` | Kalça | Ön |
| `thigh-front-left` | Sol Uyluk | Ön |
| `thigh-front-right` | Sağ Uyluk | Ön |
| `knee-front-left` | Sol Diz | Ön |
| `knee-front-right` | Sağ Diz | Ön |
| `ankle-front-left` | Sol Ayak Bileği | Ön |
| `ankle-front-right` | Sağ Ayak Bileği | Ön |

---

### 🦵 **ALT VÜCUT - ARKA**

| Bölge ID | Türkçe İsim | Görünüm |
|----------|-------------|---------|
| `hip-back` | Kalça | Arka |
| `thigh-back-left` | Sol Uyluk | Arka |
| `thigh-back-right` | Sağ Uyluk | Arka |
| `knee-back-left` | Sol Diz | Arka |
| `knee-back-right` | Sağ Diz | Arka |
| `calf-back-left` | Sol Baldır | Arka |
| `calf-back-right` | Sağ Baldır | Arka |

---

## 📊 Özet İstatistikler

- **Toplam Bölge Sayısı:** 32
- **Ön Görünüm Bölgeleri:** 17
- **Arka Görünüm Bölgeleri:** 15

---

## 🔍 Bölge Kategorileri

### **Baş ve Boyun (4 bölge)**
- Baş (Ön)
- Baş (Arka)
- Boyun (Ön)
- Boyun (Arka)

### **Omuzlar (4 bölge)**
- Sol Omuz (Ön)
- Sağ Omuz (Ön)
- Sol Omuz (Arka)
- Sağ Omuz (Arka)

### **Göğüs ve Karın (2 bölge)**
- Göğüs
- Karın

### **Sırt (3 bölge)**
- Üst Sırt
- Orta Sırt
- Bel

### **Dirsekler (4 bölge)**
- Sol Dirsek (Ön)
- Sağ Dirsek (Ön)
- Sol Dirsek (Arka)
- Sağ Dirsek (Arka)

### **El Bilekleri (4 bölge)**
- Sol El Bileği (Ön)
- Sağ El Bileği (Ön)
- Sol El Bileği (Arka)
- Sağ El Bileği (Arka)

### **Kalça (2 bölge)**
- Kalça (Ön)
- Kalça (Arka)

### **Uyluklar (4 bölge)**
- Sol Uyluk (Ön)
- Sağ Uyluk (Ön)
- Sol Uyluk (Arka)
- Sağ Uyluk (Arka)

### **Dizler (4 bölge)**
- Sol Diz (Ön)
- Sağ Diz (Ön)
- Sol Diz (Arka)
- Sağ Diz (Arka)

### **Baldırlar (2 bölge)**
- Sol Baldır (Arka)
- Sağ Baldır (Arka)

### **Ayak Bilekleri (2 bölge)**
- Sol Ayak Bileği (Ön)
- Sağ Ayak Bileği (Ön)

---

## 💻 Kod Kullanımı

### JavaScript/TypeScript'te Bölge ID'lerini Kullanma

```typescript
// Tüm bölge ID'leri
const allBodyAreas = [
  // Baş ve Boyun
  'head-front', 'head-back',
  'neck-front', 'neck-back',
  
  // Üst Vücut - Ön
  'shoulder-front-left', 'shoulder-front-right',
  'chest', 'abdomen',
  'elbow-front-left', 'elbow-front-right',
  'wrist-front-left', 'wrist-front-right',
  
  // Üst Vücut - Arka
  'shoulder-back-left', 'shoulder-back-right',
  'upper-back', 'mid-back', 'lower-back',
  'elbow-back-left', 'elbow-back-right',
  'wrist-back-left', 'wrist-back-right',
  
  // Alt Vücut - Ön
  'hip-front',
  'thigh-front-left', 'thigh-front-right',
  'knee-front-left', 'knee-front-right',
  'ankle-front-left', 'ankle-front-right',
  
  // Alt Vücut - Arka
  'hip-back',
  'thigh-back-left', 'thigh-back-right',
  'knee-back-left', 'knee-back-right',
  'calf-back-left', 'calf-back-right',
];

// Bölge isimlerini almak için
const partLabels: Record<string, string> = {
  'head-front': 'Baş',
  'head-back': 'Baş (Arka)',
  'neck-front': 'Boyun',
  'neck-back': 'Boyun (Arka)',
  'shoulder-front-left': 'Sol Omuz',
  'shoulder-front-right': 'Sağ Omuz',
  'shoulder-back-left': 'Sol Omuz',
  'shoulder-back-right': 'Sağ Omuz',
  'chest': 'Göğüs',
  'abdomen': 'Karın',
  'hip-front': 'Kalça',
  'hip-back': 'Kalça',
  'upper-back': 'Üst Sırt',
  'mid-back': 'Orta Sırt',
  'lower-back': 'Bel',
  'thigh-front-left': 'Sol Uyluk',
  'thigh-front-right': 'Sağ Uyluk',
  'thigh-back-left': 'Sol Uyluk',
  'thigh-back-right': 'Sağ Uyluk',
  'knee-front-left': 'Sol Diz',
  'knee-front-right': 'Sağ Diz',
  'knee-back-left': 'Sol Diz',
  'knee-back-right': 'Sağ Diz',
  'calf-back-left': 'Sol Baldır',
  'calf-back-right': 'Sağ Baldır',
  'ankle-front-left': 'Sol Ayak Bileği',
  'ankle-front-right': 'Sağ Ayak Bileği',
  'elbow-front-left': 'Sol Dirsek',
  'elbow-front-right': 'Sağ Dirsek',
  'elbow-back-left': 'Sol Dirsek',
  'elbow-back-right': 'Sağ Dirsek',
  'wrist-front-left': 'Sol El Bileği',
  'wrist-front-right': 'Sağ El Bileği',
  'wrist-back-left': 'Sol El Bileği',
  'wrist-back-right': 'Sağ El Bileği',
};
```

---

## 📝 Notlar

- Bölge ID'leri kebab-case formatında (küçük harf, tire ile ayrılmış)
- Sol/sağ ayrımı `-left` ve `-right` suffix'leri ile yapılıyor
- Ön/arka ayrımı `-front` ve `-back` suffix'leri ile yapılıyor
- Bazı bölgeler sadece önde veya sadece arkada bulunur (örn: Göğüs sadece önde, Baldır sadece arkada)
- Kullanıcılar birden fazla bölge seçebilir
- Seçilen bölgeler `localStorage`'da `userPainAreas` anahtarı altında saklanır

---

## 🔄 Güncelleme Tarihi
- **Oluşturulma:** 2024
- **Son Güncelleme:** 2024


