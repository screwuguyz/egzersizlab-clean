import React, { useState, useRef } from 'react';
import { X, Upload, Video, Play, Pause, RotateCcw, CheckCircle2, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface ClinicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testType: 'muscle-strength' | 'flexibility' | 'rom' | 'neurodynamic' | 'balance' | 'movement';
  userPainAreas?: string[]; // Kullanıcının seçtiği ağrılı bölgeler
}

type TestStep = 'instructions' | 'recording' | 'upload' | 'review' | 'completed';

const testConfigs = {
  'muscle-strength': {
    title: 'Kas Kuvveti Öz-Değerlendirmesi',
    icon: '💪',
    instructions: [
      'Kamerayı yan profilden konumlandırın (vücudunuzun yarısı görünsün)',
      'Rahat kıyafetler giyin, hareketi engellemesin',
      'Testi yaparken ağrı olursa durun',
      'Her hareketi 3 kez tekrarlayın',
    ],
    tests: [
      {
        id: 'squat',
        name: 'Çömelme Testi (Squat)',
        description: 'Ayaklar omuz genişliğinde, eller önde, yavaşça çömelin ve kalkın',
        duration: '30 saniye',
        videoTips: 'Yan profilden çekin, diz ve kalça hareketini görebilmeli',
        relevantBodyAreas: ['knee-front-left', 'knee-front-right', 'knee-back-left', 'knee-back-right', 'hip-front', 'hip-back', 'lower-back', 'thigh-front-left', 'thigh-front-right', 'thigh-back-left', 'thigh-back-right', 'ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        instructions: [
          'Kamerayı yan profilden konumlandırın',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Hareketi 30 saniye boyunca yapabildiğiniz kadar yapın',
        ],
        detailedInstructions: {
          startPosition: {
            title: '1. Başlangıç Pozisyonu',
            items: [
              {
                label: 'Ayaklar',
                text: 'Ayaklarınızı omuz genişliğinde açın. Ayak parmak uçlarınız hafifçe dışa baksın.',
              },
              {
                label: 'Duruş',
                text: 'Dik durun, göğsünüzü yukarıda tutun ve karşıya bakın.',
              },
              {
                label: 'Kollar',
                text: 'Dengeyi sağlamak için kollarınızı öne doğru uzatabilir veya ellerinizi belinize koyabilirsiniz.',
              },
            ],
          },
          movementDown: {
            title: '2. Hareketin Yapılışı (İniş)',
            items: [
              {
                label: 'Sandalyeye Oturma Hissi',
                text: 'Hareketi dizlerinizi bükerek değil, kalçanızı geriye doğru iterek başlatın. Tıpkı arkanızda görünmez bir sandalye varmış ve ona oturacakmışsınız gibi düşünün.',
              },
              {
                label: 'Dizler',
                text: 'Çömelirken dizlerinizin içeriye doğru çökmesine izin vermeyin; dizlerinizi hafifçe dışa doğru iterek ayak parmaklarınızla aynı hizada tutun.',
              },
              {
                label: 'Derinlik',
                text: 'Uyluklarınız yere paralel olana kadar (veya ağrı hissetmediğiniz, doktorunuzun izin verdiği seviyeye kadar) inin.',
              },
              {
                label: 'Topuklar',
                text: 'Topuklarınızın yerden kalkmasına asla izin vermeyin, ağırlığınızı topuklarınıza verin.',
              },
            ],
          },
          movementUp: {
            title: '3. Hareketin Yapılışı (Kalkış)',
            items: [
              {
                label: 'İtme',
                text: 'Topuklarınızdan kuvvet alarak vücudunuzu yukarı doğru itin.',
              },
              {
                label: 'Bitiş',
                text: 'Tamamen dik konuma geldiğinizde kalçanızı hafifçe sıkın.',
              },
            ],
          },
        },
        evaluationPoints: [
          'Dizler içe dönüyor mu?',
          'Kalça yeterince geri gidiyor mu?',
          'Topuklar yerden kalkıyor mu?',
          'Gövde öne eğiliyor mu?',
        ],
      },
      {
        id: 'calf-raise',
        name: 'Topuk Yükseltme (Calf Raise)',
        description: 'Tek ayak üzerinde durun, bir yerden destek alarak 30 saniye boyunca parmak ucuna yükselip inin',
        duration: '30 saniye',
        videoTips: 'Yandan çekin, topuk yükselme hareketini görebilmeli',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right', 'lower-back', 'mid-back', 'upper-back', 'hip-front', 'hip-back', 'knee-front-left', 'knee-front-right', 'knee-back-left', 'knee-back-right'],
        instructions: [
          'Kamerayı yandan konumlandırın',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Tek ayak üzerinde durun, bir yerden destek alarak 30 saniye boyunca parmak ucuna yükselip inin',
        ],
        evaluationPoints: [
          'Topuk tam kalkıyor mu?',
          'Yorulunca titreme başlıyor mu?',
        ],
      },
      {
        id: 'heel-walk',
        name: 'Topuk Üzerinde Yürüyüş (Heel Walk)',
        description: 'Ayakkabılarını çıkar. Olduğun yerde veya odada ileri geri giderek, parmak uçlarını havaya kaldır ve sadece topukların üzerinde yürü',
        duration: '20 saniye',
        videoTips: 'Önden veya yandan çekin, ayak pozisyonunu ve parmak yüksekliğini görebilmeli',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right', 'lower-back', 'hip-front', 'hip-back', 'knee-front-left', 'knee-front-right', 'knee-back-left', 'knee-back-right'],
        instructions: [
          'Kamerayı önden veya yandan konumlandırın',
          'Ayakkabılarını çıkar',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Olduğun yerde veya odada ileri geri giderek, parmak uçlarını havaya kaldır ve sadece topukların üzerinde yürü (20 saniye)',
        ],
        evaluationPoints: [
          'Parmak yüksekliği: Ayak ucunu yerden ne kadar kesebiliyor? (Düşükse "Düşük Ayak" riski veya ön kas zayıflığı)',
          'Ağrı ifadesi: Bunu yaparken kaval kemiği önünde ağrı oluyor mu? (Shin Splints şüphesi)',
        ],
      },
    ],
  },
  flexibility: {
    title: 'Esneklik Öz-Değerlendirmesi',
    icon: '📏',
    instructions: [
      'Her testi dikkatli bir şekilde uygulayın',
      'Hareketi yavaş yapın, zorlamayın',
      'Ağrı olursa durun',
    ],
    tests: [
      {
        id: 'knee-wall-distance',
        name: 'Diz-Duvar Mesafesi Testi',
        description: 'Baldır ve ayak bileği esnekliği için altın standart test. Sadece cetvel yeterli!',
        duration: '2 dakika',
        testMode: 'measurement',
        measurementUnit: 'cm',
        measurementLabel: 'Ayak Bileği',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        instructions: ['Görsel talimatlara bakarak testi uygulayın.'],
        evaluationCriteria: {
          good: { min: 10, label: 'Normal', color: '#10b981', icon: '✅', description: 'Esneklik normal.' },
          moderate: { min: 5, max: 9, label: 'Hafif Kısıtlı', color: '#f59e0b', icon: '⚠️', description: 'Germe önerilir.' },
          poor: { max: 4, label: 'Kısıtlı', color: '#ef4444', icon: '❌', description: 'Yoğun esneklik çalışması gerekli.' },
        },
        evaluationPoints: [],
      },
      {
        id: 'hamstring',
        name: 'Hamstring Esneklik',
        description: 'Bacak düz, öne eğilin, ne kadar uzanabiliyorsunuz?',
        duration: '15 saniye',
        videoTips: 'Yandan çekin, eğilme açısını görebilmeli',
        relevantBodyAreas: ['lower-back', 'hip-front', 'hip-back', 'thigh-back-left', 'thigh-back-right'],
        evaluationPoints: ['Ne kadar eğilebildi?', 'Diz bükülüyor mu?', 'Ağrı var mı?'],
      },
    ],
  },
  rom: {
    title: 'Eklem Hareket Açıklığı (EHA)',
    icon: '📐',
    instructions: [
      'Kamerayı eklemi net görecek şekilde konumlandırın',
      'Hareketi yavaş ve kontrollü yapın',
    ],
    tests: [
      {
        id: 'ankle-dorsiflexion-rom',
        name: 'Ayak Bileği Dorsifleksiyon EHA',
        description: 'Ayak bileğinizi yukarı çekme hareketinizi kaydedin. Görsel açı rehberi ile karşılaştırın.',
        duration: '15 saniye',
        videoTips: 'Yandan çekin, ayak ve baldır net görünsün',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        instructions: [
          'Yere oturun, bacağınızı düz uzatın',
          'Kamerayı yandan konumlandırın (ayak profili görünsün)',
          'Ayak ucunuzu kendinize doğru çekin (dorsifleksiyon)',
          'Maksimum noktada 3 saniye tutun',
          'Hareketi yavaş ve kontrollü yapın',
        ],
        evaluationPoints: [
          'Ayak ucu baldıra yaklaşabiliyor mu? (Normal: 20°+)',
          'Hareket sırasında ağrı var mı?',
          'Sol-sağ fark var mı?',
          'Topuk yerden kalkıyor mu?',
        ],
        angleGuide: {
          title: 'Dorsifleksiyon Açı Rehberi',
          ranges: [
            { angle: '20°+', status: 'Normal', color: '#10b981', description: 'Ayak ucu rahatça yukarı çıkıyor' },
            { angle: '10-20°', status: 'Hafif Kısıtlı', color: '#f59e0b', description: 'Ayak ucu biraz yukarı çıkıyor' },
            { angle: '<10°', status: 'Kısıtlı', color: '#ef4444', description: 'Ayak ucu çok az hareket ediyor' },
          ],
        },
      },
      {
        id: 'ankle-plantarflexion-rom',
        name: 'Ayak Bileği Plantarfleksiyon EHA',
        description: 'Ayak bileğinizi aşağı indirme (parmak ucuna basma) hareketinizi kaydedin.',
        duration: '15 saniye',
        videoTips: 'Yandan çekin, ayak ve baldır net görünsün',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        instructions: [
          'Yere oturun, bacağınızı düz uzatın',
          'Kamerayı yandan konumlandırın',
          'Ayak ucunuzu ileri doğru uzatın (bale hareketi gibi)',
          'Maksimum noktada 3 saniye tutun',
        ],
        evaluationPoints: [
          'Ayak ucu tam uzanabiliyor mu? (Normal: 40-50°)',
          'Hareket sırasında ağrı var mı?',
          'Sol-sağ fark var mı?',
        ],
        angleGuide: {
          title: 'Plantarfleksiyon Açı Rehberi',
          ranges: [
            { angle: '40°+', status: 'Normal', color: '#10b981', description: 'Ayak ucu tam uzanıyor' },
            { angle: '30-40°', status: 'Hafif Kısıtlı', color: '#f59e0b', description: 'Ayak ucu biraz uzanıyor' },
            { angle: '<30°', status: 'Kısıtlı', color: '#ef4444', description: 'Ayak ucu az uzanıyor' },
          ],
        },
      },
      {
        id: 'shoulder',
        name: 'Omuz EHA',
        description: 'Kolu yukarı kaldırın, ne kadar açılabiliyor?',
        duration: '20 saniye',
        videoTips: 'Önden çekin, omuz açısını görebilmeli',
        relevantBodyAreas: ['shoulder-front-left', 'shoulder-front-right', 'shoulder-back-left', 'shoulder-back-right'],
        evaluationPoints: ['Tam açılabiliyor mu?', 'Ağrı var mı?', 'Kısıtlılık var mı?'],
      },
    ],
  },
  neurodynamic: {
    title: 'Sinir Hassasiyeti Öz-Değerlendirmesi',
    icon: '🧠',
    instructions: [
      'Testi yavaş ve kontrollü yapın',
      'Ağrı veya uyuşma olursa hareketi durdurun',
      'Her testte hissettiğinizi seçin',
    ],
    tests: [
      {
        id: 'tibial-nerve-test',
        name: 'Tibial Sinir Testi',
        description: 'Baldır arkası, topuk ve ayak tabanı bölgesindeki hassasiyeti kontrol etmenizi sağlar.',
        duration: '30 saniye',
        testMode: 'response',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        targetArea: 'Baldırın tam arkası, topuk ve ayak tabanı',
        detailedSteps: [
          { step: 1, title: 'Başlangıç Pozisyonu', instruction: 'Sırtüstü yat, kolların yanlarda rahat olsun.' },
          { step: 2, title: 'Bacak Kaldırma', instruction: 'Test edeceğin bacağı dizini BÜKMEDEN dümdüz yukarı kaldır. Diğer bacak yerde düz kalsın.' },
          { step: 3, title: 'Ayağı Çekme', instruction: 'Ayak ucunu kendine doğru çek (sanki ayak tabanıyla tavana bakmaya çalışıyorsun).' },
          { step: 4, title: 'Ayağı Döndürme', instruction: 'Ayak tabanını DIŞA doğru çevirmeye çalış (ayak tabanı dışarı baksın).' },
          { step: 5, title: 'Bekle ve Hisset', instruction: '5 saniye bu pozisyonda kal. Ne hissediyorsun?' },
        ],
        responseOptions: [
          { id: 'normal', label: 'Sadece gerilme hissettim', icon: '✅', result: 'Normal', description: 'Normal kas esnekliği görünüyor.', color: '#10b981' },
          { id: 'nerve', label: 'Elektrik çarpması / Karıncalanma oldu', icon: '⚡', result: 'Değerlendirme Önerilir', description: 'Sinir hassasiyeti olabilir. Bir sağlık profesyoneline danışmanız önerilir.', color: '#f59e0b' },
          { id: 'back', label: 'Belimde ağrı oldu', icon: '🔴', result: 'Dikkat', description: 'Bu bulgu önemli olabilir. Bir sağlık profesyoneline danışmanız önerilir.', color: '#ef4444' },
        ],
      },
      {
        id: 'peroneal-nerve-test',
        name: 'Peroneal (Fibular) Sinir Testi',
        description: 'Kaval kemiği önü, ayak bileği ve ayak sırtı bölgesindeki hassasiyeti kontrol etmenizi sağlar.',
        duration: '30 saniye',
        testMode: 'response',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        targetArea: 'Kaval kemiği önü, ayak bileği ön-dış kısmı, ayak sırtı',
        detailedSteps: [
          { step: 1, title: 'Başlangıç Pozisyonu', instruction: 'Sırtüstü yat, rahatla.' },
          { step: 2, title: 'Bacak Kaldırma', instruction: 'Test edeceğin bacağı dizini BÜKMEDEN düz kaldır.' },
          { step: 3, title: 'Ayağı Uzatma', instruction: 'Gaz pedalına basar gibi ayağını ileri uzat (bale hareketi gibi).' },
          { step: 4, title: 'Ayağı Döndürme', instruction: 'Ayak tabanını İÇERİ doğru döndür (ayak tabanı diğer ayağa baksın).' },
          { step: 5, title: 'Bekle ve Hisset', instruction: '5 saniye bu pozisyonda kal. Ne hissediyorsun?' },
        ],
        responseOptions: [
          { id: 'normal', label: 'Sadece gerilme hissettim', icon: '✅', result: 'Normal', description: 'Normal kas esnekliği görünüyor.', color: '#10b981' },
          { id: 'nerve', label: 'Elektrik çarpması / Uyuşma oldu', icon: '⚡', result: 'Değerlendirme Önerilir', description: 'Sinir hassasiyeti olabilir. Bir sağlık profesyoneline danışmanız önerilir.', color: '#f59e0b' },
          { id: 'back', label: 'Belimde ağrı oldu', icon: '🔴', result: 'Dikkat', description: 'Bu bulgu önemli olabilir. Bir sağlık profesyoneline danışmanız önerilir.', color: '#ef4444' },
        ],
      },
      {
        id: 'sural-nerve-test',
        name: 'Sural Sinir Testi',
        description: 'Ayak bileği dış topuk kısmı ve baldır dış yan ağrıları için. Kronik burkulma sonrası geçmeyen ağrıların sinir kaynaklı olup olmadığını tespit eder.',
        duration: '30 saniye',
        testMode: 'response',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        targetArea: 'Ayak bileği dış topuk (lateral malleol) çevresi, baldır dış yanı',
        detailedSteps: [
          { step: 1, title: 'Başlangıç Pozisyonu', instruction: 'Sırtüstü yat, rahatla.' },
          { step: 2, title: 'Bacak Kaldırma', instruction: 'Test edeceğin bacağı dizini BÜKMEDEN düz kaldır.' },
          { step: 3, title: 'Ayağı Çekme', instruction: 'Ayak ucunu kendine doğru çek (dorsifleksiyon).' },
          { step: 4, title: 'Ayağı Döndürme', instruction: 'Ayak tabanını İÇERİ doğru döndür (ayak tabanı diğer ayağa baksın).' },
          { step: 5, title: 'Bekle ve Hisset', instruction: '5 saniye bu pozisyonda kal. Ne hissediyorsun?' },
        ],
        responseOptions: [
          { id: 'normal', label: 'Sadece gerilme hissettim', icon: '✅', result: 'Normal', description: 'Normal kas esnekliği görünüyor.', color: '#10b981' },
          { id: 'nerve', label: 'Elektrik çarpması / Yanma oldu', icon: '⚡', result: 'Değerlendirme Önerilir', description: 'Sinir hassasiyeti olabilir. Bir sağlık profesyoneline danışmanız önerilir.', color: '#f59e0b' },
          { id: 'back', label: 'Belimde ağrı oldu', icon: '🔴', result: 'Dikkat', description: 'Bu bulgu önemli olabilir. Bir sağlık profesyoneline danışmanız önerilir.', color: '#ef4444' },
        ],
      },
    ],
  },
  movement: {
    title: 'Hareket Analizi',
    icon: '🩺',
    instructions: [
      'Günlük hareketleri doğal şekilde yapın',
      'Kamerayı yan profilden konumlandırın',
      'Hareketi rahat ve doğal yapın',
      'Ağrı hissederseniz durun',
    ],
    tests: [
      {
        id: 'squat-daily',
        name: 'Günlük Çömelme Analizi',
        description: 'Günlük hayatta yerden bir şey alırken nasıl çömeldiğinizi analiz eder. Bel ve diz biyomekaniğinizi değerlendirir.',
        duration: '20 saniye',
        videoTips: 'Yan profilden çekin, tüm vücut görünmeli',
        instructions: [
          'Kamerayı yan profilden konumlandırın',
          'Rahat kıyafetler giyin',
          'Doğal şekilde çömelin, zorlamayın',
          'Hareketi 3-5 kez tekrarlayın',
        ],
        detailedInstructions: {
          startPosition: {
            title: '1. Başlangıç Pozisyonu',
            items: [
              { label: 'Duruş', text: 'Ayakta dik durun, ayaklar omuz genişliğinde açık olsun.' },
              { label: 'Kollar', text: 'Kollarınız rahat yanlarda dursun.' },
            ],
          },
          movementDown: {
            title: '2. Hareket (Çömelme)',
            items: [
              { label: 'Doğal Hareket', text: 'Sanki yerden bir şey alacakmışsınız gibi doğal şekilde çömelin.' },
              { label: 'Dikkat', text: 'Nasıl çömeldiğinizi düşünmeyin, günlük hayattaki gibi yapın.' },
            ],
          },
          movementUp: {
            title: '3. Kalkış',
            items: [
              { label: 'Doğal Kalkış', text: 'Doğal şekilde ayağa kalkın.' },
              { label: 'Tekrar', text: 'Hareketi 3-5 kez tekrarlayın.' },
            ],
          },
        },
        evaluationPoints: ['Bel aşırı eğiliyor mu?', 'Dizler içe çöküyor mu?', 'Sağ-sol asimetri var mı?', 'Topuklar kalkıyor mu?'],
      },
    ],
  },
  balance: {
    title: 'Denge Öz-Değerlendirmesi',
    icon: '⚖️',
    instructions: [
      'Düşmemek için yanınızda tutunabileceğiniz bir yer olsun',
      'Düz ve kaymayan bir zeminde yapın',
      'Çıplak ayakla test yapın',
      'Telefonu elinize almadan kullanabileceksiniz - sesli sayaç size yardımcı olacak',
    ],
    tests: [
      {
        id: 'single-leg-stance-eyes-open',
        name: 'Tek Ayak Denge Testi (Gözler Açık)',
        description: 'Görsel sistem yardımıyla tek ayak üzerinde ne kadar süre dengede kalabildiğinizi ölçer.',
        duration: 'Maksimum 60 saniye',
        testMode: 'balance-timer',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        targetArea: 'Ayak bileği ve baldır propriosepsiyonu',
        testVariant: 'eyes-open',
        detailedSteps: [
          { step: 1, title: 'Hazırlık', instruction: 'Yanınızda tutunabileceğiniz bir masa veya duvar olsun. Çıplak ayakla, düz zeminde durun.' },
          { step: 2, title: 'Pozisyon', instruction: 'Ellerinizi belinize koyun. Test edeceğiniz (ağrılı) ayağınızın üzerinde durun.' },
          { step: 3, title: 'Başlangıç', instruction: 'Diğer dizinizi bükerek ayağınızı yerden kesin. Gözleriniz AÇIK kalsın, karşıda sabit bir noktaya bakın.' },
          { step: 4, title: 'Test', instruction: '"Başlat" butonuna basın. Telefon sesli olarak saniyeleri sayacak. Dengenizi kaybettiğinizde duyduğunuz son sayıyı hatırlayın.' },
        ],
        evaluationCriteria: {
          good: { min: 30, label: 'İyi Denge', color: 'green', icon: '✅', description: 'Denge performansınız iyi görünüyor.' },
          moderate: { min: 15, max: 29, label: 'Orta Seviye', color: 'yellow', icon: '⚠️', description: 'Denge egzersizleri faydalı olabilir.' },
          poor: { min: 0, max: 14, label: 'Geliştirilebilir', color: 'red', icon: '❌', description: 'Denge egzersizlerine odaklanmanız önerilir. Profesyonel değerlendirme faydalı olabilir.' },
        },
      },
      {
        id: 'single-leg-stance-eyes-closed',
        name: 'Tek Ayak Denge Testi (Gözler Kapalı)',
        description: 'Görsel destek olmadan denge performansınızı ölçer. Bu test, ayak bileği ve baldır kaslarınızın denge katkısını değerlendirmenize yardımcı olur.',
        duration: 'Maksimum 30 saniye',
        testMode: 'balance-timer',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'ankle-back-left', 'ankle-back-right', 'calf-back-left', 'calf-back-right'],
        targetArea: 'Ayak bileği propriosepsiyonu (görsel sistem olmadan)',
        testVariant: 'eyes-closed',
        isCritical: true,
        detailedSteps: [
          { step: 1, title: '⚠️ Güvenlik', instruction: 'Bu test daha zordur! Mutlaka yanınızda tutunabileceğiniz sağlam bir yer olsun.' },
          { step: 2, title: 'Pozisyon', instruction: 'Ellerinizi belinize koyun. Test edeceğiniz (ağrılı) ayağınızın üzerinde durun.' },
          { step: 3, title: 'Başlangıç', instruction: 'Diğer dizinizi bükerek ayağınızı yerden kesin. Hazır olduğunuzda "Başlat" butonuna basın.' },
          { step: 4, title: 'Gözleri Kapatma', instruction: '5 saniyelik geri sayım bitince GÖZLERİNİZİ KAPATIN. Telefon sesli sayacak. Dengenizi kaybedince gözlerinizi açın ve duyduğunuz son sayıyı hatırlayın.' },
        ],
        evaluationCriteria: {
          good: { min: 15, label: 'İyi Denge', color: 'green', icon: '✅', description: 'Görsel destek olmadan da denge performansınız iyi.' },
          moderate: { min: 7, max: 14, label: 'Orta Seviye', color: 'yellow', icon: '⚠️', description: 'Denge egzersizleri faydalı olabilir.' },
          poor: { min: 0, max: 6, label: 'Geliştirilebilir', color: 'red', icon: '❌', description: 'Denge egzersizlerine odaklanmanız önerilir. Profesyonel değerlendirme faydalı olabilir.' },
        },
      },
    ],
  },
};

// Ölçüm sonucu değerlendirmesi
interface MeasurementResult {
  value: number;
  status: 'good' | 'moderate' | 'poor';
  label: string;
  color: string;
  icon: string;
  description: string;
}

const evaluateMeasurement = (value: number, criteria: any): MeasurementResult => {
  if (value >= criteria.good.min) {
    return { value, status: 'good', ...criteria.good };
  } else if (value >= criteria.moderate.min && value <= criteria.moderate.max) {
    return { value, status: 'moderate', ...criteria.moderate };
  } else {
    return { value, status: 'poor', ...criteria.poor };
  }
};

const ClinicalTestModal: React.FC<ClinicalTestModalProps> = ({ isOpen, onClose, testType, userPainAreas = [] }) => {
  const [currentStep, setCurrentStep] = useState<TestStep>('instructions');
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [recordedVideos, setRecordedVideos] = useState<Record<string, string>>({});
  const [uploadedVideos, setUploadedVideos] = useState<Record<string, File | null>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [skippedTests, setSkippedTests] = useState<Set<string>>(new Set());
  
  // Ölçüm bazlı testler için state
  const [measurements, setMeasurements] = useState<Record<string, { left: string; right: string; photo?: string }>>({});
  const [measurementResults, setMeasurementResults] = useState<Record<string, { left?: MeasurementResult; right?: MeasurementResult }>>({});
  const [showMeasurementResults, setShowMeasurementResults] = useState(false);
  
  // Nörodinamik test yanıtları
  const [neurodynamicResponses, setNeurodynamicResponses] = useState<Record<string, { responseId: string; result: string; description: string; color: string }>>({});
  
  // Denge testi state'leri
  const [balanceTestState, setBalanceTestState] = useState<'idle' | 'countdown' | 'running' | 'finished'>('idle');
  const [balanceCountdown, setBalanceCountdown] = useState(5);
  const [balanceTimer, setBalanceTimer] = useState(0);
  const [balanceResults, setBalanceResults] = useState<Record<string, { seconds: number; result: MeasurementResult }>>({});
  const [selectedBalanceTime, setSelectedBalanceTime] = useState<number | null>(null);
  const balanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Test değiştiğinde denge sayacını sıfırla
  React.useEffect(() => {
    // Sayacı durdur
    if (balanceTimerRef.current) {
      clearInterval(balanceTimerRef.current);
      balanceTimerRef.current = null;
    }
    // Sesi durdur
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // State'leri sıfırla
    setBalanceTestState('idle');
    setBalanceCountdown(5);
    setBalanceTimer(0);
    setSelectedBalanceTime(null);
  }, [currentTestIndex]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const baseConfig = testConfigs[testType];
  
  // Kullanıcının ağrılı bölgelerine göre testleri filtrele
  const filteredTests = React.useMemo(() => {
    if (!userPainAreas || userPainAreas.length === 0) {
      // Ağrılı bölge yoksa tüm testleri göster
      return baseConfig.tests;
    }
    
    // Ön/arka ayrımı yapmadan normalize edilmiş bölge isimleri
    const normalizeArea = (area: string): string => {
      // Kalça, bacak (uyluk), diz, ayak bileği için ön/arka ayrımını kaldır
      if (area.includes('hip')) return 'hip';
      if (area.includes('thigh')) return 'thigh';
      if (area.includes('knee')) return 'knee';
      if (area.includes('ankle')) return 'ankle';
      if (area.includes('calf')) return 'calf';
      return area;
    };
    
    const normalizedUserAreas = userPainAreas.map(normalizeArea);
    
    const filtered = baseConfig.tests.filter((test) => {
      // Eğer test'in relevantBodyAreas'ı yoksa, tüm kullanıcılar için göster
      if (!test.relevantBodyAreas || test.relevantBodyAreas.length === 0) {
        return true;
      }
      
      // Test'in ilgili olduğu bölgelerle kullanıcının ağrılı bölgelerini karşılaştır
      const hasRelevantPain = test.relevantBodyAreas.some((area) => {
        const normalizedArea = normalizeArea(area);
        return normalizedUserAreas.some((userArea) => {
          // Normalize edilmiş bölgeleri karşılaştır
          if (normalizedArea === userArea) return true;
          // Tam eşleşme veya kısmi eşleşme kontrolü (diğer bölgeler için)
          return userArea.includes(normalizedArea) || normalizedArea.includes(userArea);
        });
      });
      
      return hasRelevantPain;
    });
    
    // Eğer filtrelenmiş test yoksa, tüm testleri göster (fallback)
    // Çünkü bazı bölgeler için (örn: baş) özel test olmayabilir
    if (filtered.length === 0) {
      console.log('Filtrelenmiş test bulunamadı, tüm testler gösteriliyor');
      return baseConfig.tests;
    }
    
    return filtered;
  }, [baseConfig.tests, userPainAreas]);

  // Config'i güncelle - filtrelenmiş testlerle
  const config = {
    ...baseConfig,
    tests: filteredTests,
  };

  // Test listesi boşsa uyarı göster
  if (config.tests.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Test Bulunamadı</h3>
            <p className="text-gray-600 mb-4">
              Seçtiğiniz şikayet için uygun test bulunamadı. Lütfen farklı bir test kategorisi deneyin.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTest = config.tests[currentTestIndex];
  // Tüm test tiplerini say: video + ölçüm + nörodinamik + denge
  const completedMeasurementTests = Object.keys(measurementResults).filter(id => 
    measurementResults[id]?.left || measurementResults[id]?.right
  ).length;
  const completedNeurodynamicTests = Object.keys(neurodynamicResponses).filter(id => 
    neurodynamicResponses[id]?.responseId
  ).length;
  const completedBalanceTests = Object.keys(balanceResults).filter(id => 
    balanceResults[id] !== undefined && balanceResults[id] !== null
  ).length;
  const completedTestsCount = Object.keys(recordedVideos).length + completedMeasurementTests + completedNeurodynamicTests + completedBalanceTests;
  const allTestsCompleted = currentTestIndex >= config.tests.length - 1;
  const canSubmit = completedTestsCount >= 1; // En az 1 test yeterli
  const showAnimation = testType === 'muscle-strength' && currentStep === 'recording';

  if (!isOpen) return null;

  // Hareket animasyonu komponenti
  const MovementAnimation = ({ testId }: { testId: string }) => {
    const [videoError, setVideoError] = useState(false);
    
    if (!showAnimation) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <style>{`
          @keyframes squatDown {
            0%, 100% { 
              transform: translateY(0) translateX(0);
            }
            50% { 
              transform: translateY(60px) translateX(0);
            }
          }
          @keyframes squatKnees {
            0%, 100% { 
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            50% { 
              transform: translateY(50px) translateX(0) rotate(45deg);
            }
          }
          @keyframes squatHips {
            0%, 100% { 
              transform: translateY(0) translateX(0);
            }
            50% { 
              transform: translateY(50px) translateX(-15px);
            }
          }
          @keyframes squatTorso {
            0%, 100% { 
              transform: translateY(0) rotate(0deg);
            }
            50% { 
              transform: translateY(40px) rotate(15deg);
            }
          }
          @keyframes singleLegBalance {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(2deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(-3px) rotate(-2deg); }
          }
          @keyframes pushupDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(25px); }
          }
          @keyframes bridgeUp {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
          .animation-overlay {
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(2px);
            border-radius: 16px;
            padding: 20px;
          }
          .squat-hip-joint {
            transform-origin: 100px 150px;
          }
          .squat-knee-joint {
            transform-origin: 80px 220px;
          }
          .squat-knee-joint-right {
            transform-origin: 120px 220px;
          }
        `}</style>
        <div className="animation-overlay">
          {testId === 'squat' ? (
            <>
              {/* MP4 Video - Öncelikli, eğer dosya varsa gösterilir */}
              {!videoError && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="squat-video"
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    display: 'block',
                  }}
                  onError={() => {
                    // Video yüklenemezse SVG'ye geç
                    setVideoError(true);
                  }}
                  onLoadStart={() => {
                    // Video yüklenmeye başladıysa hata durumunu sıfırla
                    setVideoError(false);
                  }}
                >
                  <source src="/animations/squat-animation.mp4" type="video/mp4" />
                  <source src="/animations/squat-animation.webm" type="video/webm" />
                </video>
              )}
              {/* Fallback: SVG animasyon - Video yoksa veya yüklenemezse gösterilir */}
              {videoError && (
                <svg 
                  width="200" 
                  height="300" 
                  viewBox="0 0 200 300" 
                  className="opacity-80"
                >
                <g className="squat-animation">
                  {/* Baş */}
                  <circle cx="100" cy="50" r="20" fill="none" stroke="#10b981" strokeWidth="3" />
                  {/* Gövde */}
                  <line x1="100" y1="70" x2="100" y2="150" stroke="#10b981" strokeWidth="4" strokeLinecap="round" style={{ animation: 'squatDown 3s ease-in-out infinite' }} />
                  {/* Kalça */}
                  <circle cx="100" cy="150" r="8" fill="#10b981" style={{ animation: 'squatDown 3s ease-in-out infinite' }} />
                  {/* Sol bacak */}
                  <line x1="100" y1="150" x2="80" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" style={{ animation: 'squatDown 3s ease-in-out infinite' }} />
                  {/* Sağ bacak */}
                  <line x1="100" y1="150" x2="120" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" style={{ animation: 'squatDown 3s ease-in-out infinite' }} />
                  {/* Sol kol */}
                  <line x1="100" y1="100" x2="70" y2="90" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Sağ kol */}
                  <line x1="100" y1="100" x2="130" y2="90" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {/* Yer çizgisi */}
                  <line x1="50" y1="220" x2="150" y2="220" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                </g>
              </svg>
              )}
            </>
          ) : (
            <svg width="200" height="300" viewBox="0 0 200 300" className="opacity-80">
            {testId === 'single-leg' && (
              <g className="balance-animation">
                {/* Baş */}
                <circle cx="100" cy="50" r="20" fill="none" stroke="#10b981" strokeWidth="3" />
                {/* Gövde */}
                <line x1="100" y1="70" x2="100" y2="150" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kalça */}
                <circle cx="100" cy="150" r="8" fill="#10b981" />
                {/* Sol bacak (yere basan) */}
                <line x1="100" y1="150" x2="100" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Sağ bacak (kaldırılmış) */}
                <line x1="100" y1="150" x2="90" y2="100" stroke="#10b981" strokeWidth="4" strokeLinecap="round" style={{ animation: 'singleLegBalance 2s ease-in-out infinite' }} />
                {/* Kollar (denge için açık) */}
                <line x1="100" y1="100" x2="60" y2="80" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="100" x2="140" y2="80" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                {/* Yer çizgisi */}
                <line x1="50" y1="220" x2="150" y2="220" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              </g>
            )}
            {testId === 'wall-pushup' && (
              <g className="pushup-animation">
                {/* Baş */}
                <circle cx="150" cy="60" r="18" fill="none" stroke="#10b981" strokeWidth="3" />
                {/* Gövde (dik) */}
                <line x1="150" y1="78" x2="150" y2="160" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kalça */}
                <circle cx="150" cy="160" r="8" fill="#10b981" />
                {/* Bacaklar */}
                <line x1="150" y1="160" x2="140" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <line x1="150" y1="160" x2="160" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kollar (şınav hareketi) */}
                <line x1="150" y1="100" x2="120" y2="80" stroke="#10b981" strokeWidth="4" strokeLinecap="round" style={{ animation: 'pushupDown 2s ease-in-out infinite' }} />
                <line x1="150" y1="100" x2="180" y2="80" stroke="#10b981" strokeWidth="4" strokeLinecap="round" style={{ animation: 'pushupDown 2s ease-in-out infinite' }} />
                {/* Duvar çizgisi */}
                <line x1="100" y1="40" x2="100" y2="240" stroke="#10b981" strokeWidth="3" strokeDasharray="8,4" opacity="0.6" />
              </g>
            )}
            {testId === 'bridge' && (
              <g className="bridge-animation">
                {/* Baş */}
                <circle cx="100" cy="80" r="18" fill="none" stroke="#10b981" strokeWidth="3" />
                {/* Gövde (yatay) */}
                <line x1="100" y1="98" x2="100" y2="180" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kalça (yukarı kalkmış) */}
                <circle cx="100" cy="140" r="10" fill="#10b981" style={{ animation: 'bridgeUp 3s ease-in-out infinite' }} />
                {/* Üst bacak */}
                <line x1="100" y1="150" x2="80" y2="200" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="150" x2="120" y2="200" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Alt bacak */}
                <line x1="80" y1="200" x2="75" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <line x1="120" y1="200" x2="125" y2="220" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kollar */}
                <line x1="100" y1="120" x2="70" y2="130" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="120" x2="130" y2="130" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                {/* Yer çizgisi */}
                <line x1="50" y1="220" x2="150" y2="220" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              </g>
            )}
            {testId === 'plank' && (
              <g className="plank-animation">
                {/* Baş */}
                <circle cx="100" cy="80" r="18" fill="none" stroke="#10b981" strokeWidth="3" />
                {/* Gövde (düz, yatay) */}
                <line x1="100" y1="98" x2="100" y2="160" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kalça */}
                <circle cx="100" cy="160" r="8" fill="#10b981" />
                {/* Bacaklar */}
                <line x1="100" y1="160" x2="90" y2="200" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="160" x2="110" y2="200" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Kollar (dirsekler üzerinde) */}
                <line x1="100" y1="120" x2="80" y2="140" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="120" x2="120" y2="140" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Dirsekler */}
                <circle cx="80" cy="140" r="6" fill="#10b981" />
                <circle cx="120" cy="140" r="6" fill="#10b981" />
                {/* Yer çizgisi */}
                <line x1="50" y1="200" x2="150" y2="200" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              </g>
            )}
          </svg>
          )}
        </div>
      </div>
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      // Önce kayıt durumunu güncelle
      setIsRecording(true);
      setRecordingTime(0);
      
      // Video elementine stream'i ata
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Video'nun yüklenmesini bekle
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(() => {
                console.log('Video oynatılıyor');
                resolve(true);
              }).catch(err => {
                console.error('Video play hatası:', err);
                resolve(false);
              });
            };
          }
        });
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideos((prev) => ({ ...prev, [currentTest.id]: url }));
        setUploadedVideos((prev) => ({ ...prev, [currentTest.id]: blob as any }));
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);

        // Stream'i durdur
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // Timer başlat
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Kamera erişim hatası:', error);
      alert('Kameraya erişilemedi. Lütfen izin verin.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Video stream'ini durdur
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleSendVideo = async () => {
    const videoBlob = uploadedVideos[currentTest.id];
    if (videoBlob) {
      console.log('Video gönderiliyor:', currentTest.id, videoBlob);
      // TODO: Backend API call
      // await apiService.uploadTestVideo(currentTest.id, videoBlob);
      
      // Test tamamlandı, sonraki teste geç
      nextTest();
    }
  };

  const handleRetryRecording = () => {
    // Önceki kaydı temizle
    setRecordedVideos((prev) => {
      const newVideos = { ...prev };
      delete newVideos[currentTest.id];
      return newVideos;
    });
    setUploadedVideos((prev) => {
      const newVideos = { ...prev };
      delete newVideos[currentTest.id];
      return newVideos;
    });
    // Tekrar kayıt başlat
    setIsRecording(false);
    setRecordingTime(0);
    startRecording();
  };

  const handleDeleteVideo = () => {
    // Kaydedilen videoyu sil
    setRecordedVideos((prev) => {
      const newVideos = { ...prev };
      delete newVideos[currentTest.id];
      return newVideos;
    });
    setUploadedVideos((prev) => {
      const newVideos = { ...prev };
      delete newVideos[currentTest.id];
      return newVideos;
    });
    // Instructions sayfasına dön
    setCurrentStep('instructions');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideos((prev) => ({ ...prev, [currentTest.id]: file }));
      const url = URL.createObjectURL(file);
      setRecordedVideos((prev) => ({ ...prev, [currentTest.id]: url }));
      setCurrentStep('review');
    }
  };

  const skipTest = () => {
    setSkippedTests((prev) => new Set([...prev, currentTest.id]));
    if (currentTestIndex < config.tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setCurrentStep('instructions');
    } else {
      setCurrentStep('completed');
    }
  };

  const nextTest = () => {
    if (currentTestIndex < config.tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setCurrentStep('instructions');
    } else {
      setCurrentStep('completed');
    }
  };

  const goToCompleted = () => {
    setCurrentStep('completed');
  };

  // Denge testi fonksiyonları
  const speakNumber = (num: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(num.toString());
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.8;
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startBalanceTest = () => {
    setBalanceTestState('countdown');
    setBalanceCountdown(5);
    setBalanceTimer(0);
    setSelectedBalanceTime(null);
    
    // 5 saniye geri sayım
    let countdown = 5;
    speakText('Hazırlanın');
    
    const countdownInterval = setInterval(() => {
      countdown--;
      setBalanceCountdown(countdown);
      
      if (countdown > 0) {
        speakNumber(countdown);
      }
      
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        speakText('Başla');
        setBalanceTestState('running');
        
        // Ana sayaç başlat
        let timer = 0;
        const maxTime = currentTest.testVariant === 'eyes-closed' ? 30 : 60;
        
        balanceTimerRef.current = setInterval(() => {
          timer++;
          setBalanceTimer(timer);
          speakNumber(timer);
          
          if (timer >= maxTime) {
            stopBalanceTest(timer);
          }
        }, 1000);
      }
    }, 1000);
    
    balanceTimerRef.current = countdownInterval as unknown as NodeJS.Timeout;
  };

  const stopBalanceTest = (finalTime?: number) => {
    if (balanceTimerRef.current) {
      clearInterval(balanceTimerRef.current);
      balanceTimerRef.current = null;
    }
    window.speechSynthesis.cancel();
    setBalanceTestState('finished');
    if (finalTime !== undefined) {
      setSelectedBalanceTime(finalTime);
    }
  };

  const saveBalanceResult = () => {
    if (selectedBalanceTime === null) return;
    
    const criteria = currentTest.evaluationCriteria;
    const result = evaluateMeasurement(selectedBalanceTime, criteria);
    
    setBalanceResults(prev => ({
      ...prev,
      [currentTest.id]: { seconds: selectedBalanceTime, result }
    }));
    
    // Sonraki teste geç veya tamamla
    if (currentTestIndex < filteredTests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setBalanceTestState('idle');
      setSelectedBalanceTime(null);
    } else {
      goToCompleted();
    }
  };

  const resetBalanceTest = () => {
    if (balanceTimerRef.current) {
      clearInterval(balanceTimerRef.current);
      balanceTimerRef.current = null;
    }
    window.speechSynthesis.cancel();
    setBalanceTestState('idle');
    setBalanceCountdown(5);
    setBalanceTimer(0);
    setSelectedBalanceTime(null);
  };

  const submitAll = async () => {
    if (completedTestsCount < 1) {
      alert('En az 1 test tamamlamanız gerekiyor. Lütfen bir test yapın.');
      setCurrentTestIndex(0);
      setCurrentStep('instructions');
      return;
    }

    try {
      // Tüm test sonuçlarını topla
      const testResults: any[] = [];
      
      // Video tabanlı testler
      for (const [testId, videoUrl] of Object.entries(recordedVideos)) {
        const testInfo = config.tests.find(t => t.id === testId);
        if (testInfo) {
          // Video URL'ini base64'e çevir (blob URL ise)
          let videoData: string | null = null;
          
          if ((videoUrl as string).startsWith('blob:')) {
            try {
              const response = await fetch(videoUrl as string);
              if (!response.ok) {
                throw new Error('Fetch failed: ' + response.status);
              }
              const blob = await response.blob();
              videoData = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (reader.result && typeof reader.result === 'string' && reader.result.startsWith('data:')) {
                    resolve(reader.result);
                  } else {
                    reject(new Error('Invalid base64 result'));
                  }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(blob);
              });
            } catch (e) {
              console.error('Video dönüştürme hatası:', e);
              // Blob URL geçersiz - videoyu null olarak kaydet
              videoData = null;
            }
          } else if ((videoUrl as string).startsWith('data:')) {
            // Zaten base64 formatında
            videoData = videoUrl as string;
          }
          
          testResults.push({
            testId,
            testName: testInfo.name,
            testType: testType,
            video: videoData, // null olabilir - geçersiz blob URL kaydedilmez
            videoError: videoData === null ? 'Video dönüştürülemedi' : undefined,
            date: new Date().toISOString(),
            status: 'completed'
          });
        }
      }

      // Ölçüm tabanlı testler (esneklik, ROM vb.)
      for (const [testId, result] of Object.entries(measurementResults)) {
        if (result) {
          const testInfo = config.tests.find(t => t.id === testId);
          const r = result as any;
          testResults.push({
            testId,
            testName: testInfo?.name || testId,
            testType: testType,
            leftValue: r.left,
            rightValue: r.right,
            leftResult: r.leftResult,
            rightResult: r.rightResult,
            unit: 'cm',
            date: new Date().toISOString(),
            status: 'completed'
          });
        }
      }

      // Nörodinamik test yanıtları
      for (const [testId, resp] of Object.entries(neurodynamicResponses)) {
        const response = resp as { responseId: string; result: string; description: string; color: string };
        if (response && response.responseId) {
          const testInfo = config.tests.find(t => t.id === testId);
          testResults.push({
            testId,
            testName: testInfo?.name || testId,
            testType: testType,
            response: response.description, // Kullanıcının seçtiği yanıtın açıklaması
            result: response.result, // 'normal', 'positive', 'referred' gibi
            date: new Date().toISOString(),
            status: 'completed'
          });
        }
      }

      // Denge testi sonuçları
      for (const [testId, result] of Object.entries(balanceResults)) {
        if (result) {
          const testInfo = config.tests.find(t => t.id === testId);
          const r = result as any;
          testResults.push({
            testId,
            testName: testInfo?.name || testId,
            testType: testType,
            time: r.time,
            result: r.result,
            date: new Date().toISOString(),
            status: 'completed'
          });
        }
      }

      // Dashboard'a kaydet
      const existingData: any = await apiService.getDashboardData();
      const currentClinicalAssessments = existingData?.data?.clinicalAssessments || {};
      
      // Mevcut test tipine göre güncelle
      currentClinicalAssessments[testType] = testResults;
      
      await apiService.saveDashboardData({
        clinicalAssessments: currentClinicalAssessments,
      } as any);

      alert('Testler başarıyla kaydedildi! ✅');
      onClose();
    } catch (error) {
      console.error('Testler kaydedilirken hata:', error);
      alert('Testler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{config.title}</h2>
              <p className="text-blue-100 text-sm">
                Test {currentTestIndex + 1} / {config.tests.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Yasal Uyarı Banner'ı */}
          {currentStep === 'instructions' && currentTestIndex === 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <span className="text-amber-500 text-lg flex-shrink-0">ℹ️</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Bilgilendirme:</strong> Bu testler tıbbi tanı aracı değildir. Sonuçlar yalnızca kişisel farkındalık amaçlıdır. 
                Kesin değerlendirme için bir sağlık profesyoneline danışmanız önerilir.
              </p>
            </div>
          )}
          
          {currentStep === 'instructions' && (
            <div className={`grid gap-6 ${(currentTest as any).testMode === 'measurement' ? 'grid-cols-1' : ((currentTest as any).testMode === 'response' || (currentTest as any).testMode === 'balance-timer' || ['squat', 'calf-raise', 'heel-walk', 'ankle-dorsiflexion-rom', 'ankle-plantarflexion-rom', 'squat-daily'].includes(currentTest.id) ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}`}>
              {/* Sol Sütun - Nörodinamik Testler için (Test Bilgileri + Adım Adım Uygulama) */}
              {(currentTest as any).testMode === 'response' && (
              <div className="space-y-4">
                {/* Test Başlığı */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {currentTestIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{currentTest.name}</h3>
                      <p className="text-gray-600 text-sm">Süre: {currentTest.duration}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{currentTest.description}</p>
                </div>

                {/* Hedef Bölge */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🎯</span>
                    <span className="font-bold text-amber-800">Hedef Bölge</span>
                  </div>
                  <p className="text-sm text-gray-700">{(currentTest as any).targetArea}</p>
                </div>

                {/* Adım Adım Uygulama */}
                <div className="bg-white border-2 border-purple-200 rounded-xl p-4">
                  <h4 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
                    <span className="text-lg">📋</span> Adım Adım Uygulama
                  </h4>
                  <div className="space-y-3">
                    {(currentTest as any).detailedSteps?.map((step: any) => (
                      <div key={step.step} className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
                          <p className="text-sm text-gray-600">{step.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* Sol Sütun - Test Bilgileri ve Genel Talimatlar (Video testleri için) */}
              {(currentTest as any).testMode !== 'measurement' && (currentTest as any).testMode !== 'response' && (currentTest as any).testMode !== 'balance-timer' && (
              <div className="space-y-4">
                {/* Test Başlığı */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {currentTestIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{currentTest.name}</h3>
                      <p className="text-gray-600 text-sm">Süre: {currentTest.duration}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base mb-3">{currentTest.description}</p>
                  {currentTest.videoTips && (
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-sm font-semibold text-purple-700 mb-1">📹 Video İpuçları:</p>
                    <p className="text-sm text-gray-600">{currentTest.videoTips}</p>
                  </div>
                  )}
                </div>

                {/* Genel Talimatlar */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                  <h3 className="font-bold text-base mb-3">📋 Genel Talimatlar</h3>
                  <ul className="space-y-2 text-sm mb-3">
                    {(currentTest.instructions || config.instructions).map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Önemli:</strong> En az <strong>1 test</strong> yeterlidir. Ağrı olursa durun.
                    </p>
                  </div>
                </div>

              </div>
              )}

              {/* Sağ Sütun - Squat Video (Sadece squat testi için) */}
              {currentTest.id === 'squat' && (
                <div className="flex flex-col">
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      🎥 Squat Nasıl Yapılır?
                    </h4>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Video yüklenemezse placeholder göster
                        }}
                      >
                        <source src="/animations/squat-animation.mp4" type="video/mp4" />
                        <source src="/animations/squat-animation.webm" type="video/webm" />
                      </video>
                      {/* Video yoksa placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white">
                        <div className="text-center p-6">
                          <p className="text-4xl mb-3">🏋️</p>
                          <p className="text-sm opacity-90">Squat animasyonu yüklenecek</p>
                          <p className="text-xs opacity-70 mt-2">public/animations/squat-animation.mp4</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Video otomatik olarak tekrar eder
                    </p>
                  </div>
                </div>
              )}

              {/* Sağ Sütun - Calf Raise Video (Sadece calf-raise testi için) */}
              {currentTest.id === 'calf-raise' && (
                <div className="flex flex-col">
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      🎥 Topuk Yükseltme Nasıl Yapılır?
                    </h4>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Video yüklenemezse placeholder göster
                        }}
                      >
                        <source src="/animations/calf-raise-animation.mp4" type="video/mp4" />
                        <source src="/animations/calf-raise-animation.webm" type="video/webm" />
                      </video>
                      {/* Video yoksa placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white">
                        <div className="text-center p-6">
                          <p className="text-4xl mb-3">🦵</p>
                          <p className="text-sm opacity-90">Topuk Yükseltme animasyonu yüklenecek</p>
                          <p className="text-xs opacity-70 mt-2">public/animations/calf-raise-animation.mp4</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Video otomatik olarak tekrar eder
                    </p>
                  </div>
                </div>
              )}

              {/* Sağ Sütun - Heel Walk Video (Sadece heel-walk testi için) */}
              {currentTest.id === 'heel-walk' && (
                <div className="flex flex-col">
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      🎥 Topuk Üzerinde Yürüyüş Nasıl Yapılır?
                    </h4>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Video yüklenemezse placeholder göster
                        }}
                      >
                        <source src="/animations/heel-walk-animation.mp4" type="video/mp4" />
                        <source src="/animations/heel-walk-animation.webm" type="video/webm" />
                      </video>
                      {/* Video yoksa placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white">
                        <div className="text-center p-6">
                          <p className="text-4xl mb-3">🚶</p>
                          <p className="text-sm opacity-90">Topuk Üzerinde Yürüyüş animasyonu yüklenecek</p>
                          <p className="text-xs opacity-70 mt-2">public/animations/heel-walk-animation.mp4</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Video otomatik olarak tekrar eder
                    </p>
                  </div>
                </div>
              )}

              {/* Sağ Sütun - Günlük Çömelme Video (squat-daily testi için) */}
              {currentTest.id === 'squat-daily' && (
                <div className="flex flex-col">
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      🩺 Günlük Çömelme Nasıl Analiz Edilir?
                    </h4>
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Video yüklenemezse placeholder göster
                        }}
                      >
                        <source src="/animations/daily-squat-analysis.mp4" type="video/mp4" />
                        <source src="/animations/daily-squat-analysis.webm" type="video/webm" />
                      </video>
                      {/* Video yoksa placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
                        <div className="text-center p-6">
                          <p className="text-4xl mb-3">🏋️‍♂️</p>
                          <p className="text-sm opacity-90">Günlük Çömelme Analizi</p>
                          <p className="text-xs opacity-70 mt-2">Video buraya eklenecek</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-purple-50 rounded-lg p-3">
                      <h5 className="font-semibold text-purple-800 text-sm mb-2">📋 Neye Bakılır?</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Bel aşırı öne eğiliyor mu?</li>
                        <li>• Dizler içe çöküyor mu?</li>
                        <li>• Sağ-sol asimetri var mı?</li>
                        <li>• Topuklar yerden kalkıyor mu?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Sağ Sütun - Dorsifleksiyon EHA Video + Açı Rehberi */}
              {currentTest.id === 'ankle-dorsiflexion-rom' && (
                <div className="flex flex-col gap-4">
                  {/* Video Alanı */}
                  <div className="bg-white border-2 border-cyan-200 rounded-xl p-4 shadow-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      🦶 Dorsifleksiyon Nasıl Yapılır?
                    </h4>
                    <div className="relative bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        <source src="/animations/dorsiflexion.mp4" type="video/mp4" />
                      </video>
                      {/* Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center p-6">
                          <p className="text-5xl mb-3">🦶⬆️</p>
                          <p className="text-lg font-semibold">Ayak Ucunu Yukarı Çek</p>
                          <p className="text-sm opacity-70 mt-2">Video buraya eklenecek</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Video otomatik olarak tekrar eder
                    </p>
                  </div>
                  
                  {/* Açı Rehberi */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-4">
                    <h4 className="font-bold text-cyan-700 mb-3 flex items-center gap-2">
                      <span className="text-xl">📐</span> Açı Rehberi
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-14 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">20°+</div>
                        <div className="flex-1">
                          <span className="font-semibold text-green-600">Normal</span>
                          <span className="text-sm text-gray-600 ml-2">Ayak ucu rahatça yukarı çıkıyor</span>
                        </div>
                        <span className="text-xl">✅</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-14 h-10 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-sm">10-20°</div>
                        <div className="flex-1">
                          <span className="font-semibold text-yellow-600">Hafif Kısıtlı</span>
                          <span className="text-sm text-gray-600 ml-2">Biraz yukarı çıkıyor</span>
                        </div>
                        <span className="text-xl">⚠️</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-14 h-10 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">&lt;10°</div>
                        <div className="flex-1">
                          <span className="font-semibold text-red-600">Kısıtlı</span>
                          <span className="text-sm text-gray-600 ml-2">Çok az hareket</span>
                        </div>
                        <span className="text-xl">❌</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sağ Sütun - Plantarfleksiyon EHA Video + Açı Rehberi */}
              {currentTest.id === 'ankle-plantarflexion-rom' && (
                <div className="flex flex-col gap-4">
                  {/* Video Alanı */}
                  <div className="bg-white border-2 border-cyan-200 rounded-xl p-4 shadow-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      🦶 Plantarfleksiyon Nasıl Yapılır?
                    </h4>
                    <div className="relative bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        <source src="/animations/plantarflexion.mp4" type="video/mp4" />
                      </video>
                      {/* Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center p-6">
                          <p className="text-5xl mb-3">🦶⬇️</p>
                          <p className="text-lg font-semibold">Ayak Ucunu Aşağı Uzat</p>
                          <p className="text-sm opacity-70 mt-2">Video buraya eklenecek</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Video otomatik olarak tekrar eder
                    </p>
                  </div>
                  
                  {/* Açı Rehberi */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-4">
                    <h4 className="font-bold text-cyan-700 mb-3 flex items-center gap-2">
                      <span className="text-xl">📐</span> Açı Rehberi
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-14 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">40°+</div>
                        <div className="flex-1">
                          <span className="font-semibold text-green-600">Normal</span>
                          <span className="text-sm text-gray-600 ml-2">Ayak ucu tam uzanıyor</span>
                        </div>
                        <span className="text-xl">✅</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-14 h-10 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-sm">30-40°</div>
                        <div className="flex-1">
                          <span className="font-semibold text-yellow-600">Hafif Kısıtlı</span>
                          <span className="text-sm text-gray-600 ml-2">Biraz uzanıyor</span>
                        </div>
                        <span className="text-xl">⚠️</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-14 h-10 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">&lt;30°</div>
                        <div className="flex-1">
                          <span className="font-semibold text-red-600">Kısıtlı</span>
                          <span className="text-sm text-gray-600 ml-2">Az uzanıyor</span>
                        </div>
                        <span className="text-xl">❌</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sağ Sütun - Nörodinamik Testler için Video + Yanıt Seçenekleri */}
              {(currentTest as any).testMode === 'response' && (
                <div className="flex flex-col gap-4">
                  {/* Video Alanı */}
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">
                      🎥 Nasıl Yapılır?
                    </h4>
                    <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        <source src={`/animations/${currentTest.id}.mp4`} type="video/mp4" />
                      </video>
                      {/* Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center p-6">
                          <p className="text-5xl mb-3">🦵⬆️</p>
                          <p className="text-lg font-semibold">Bacak Kaldırma + Ayak Hareketi</p>
                          <p className="text-sm opacity-70 mt-2">Video buraya eklenecek</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Yanıt Seçenekleri */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-4">
                    <h4 className="font-bold text-purple-700 mb-3 text-center">
                      🤔 Testi yaptıktan sonra ne hissettiniz?
                    </h4>
                    <div className="space-y-2">
                      {(currentTest as any).responseOptions?.map((option: any) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setNeurodynamicResponses(prev => ({
                              ...prev,
                              [currentTest.id]: {
                                responseId: option.id,
                                result: option.result,
                                description: option.description,
                                color: option.color,
                              }
                            }));
                          }}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            neurodynamicResponses[currentTest.id]?.responseId === option.id
                              ? 'border-purple-500 bg-white shadow-md'
                              : 'border-gray-200 bg-white hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-medium text-gray-800">{option.label}</span>
                            {neurodynamicResponses[currentTest.id]?.responseId === option.id && (
                              <CheckCircle2 size={20} className="text-purple-600 ml-auto" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Sonuç Açıklaması */}
                    {neurodynamicResponses[currentTest.id] && (
                      <div 
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{ 
                          backgroundColor: neurodynamicResponses[currentTest.id].color + '20',
                          borderLeft: `4px solid ${neurodynamicResponses[currentTest.id].color}`
                        }}
                      >
                        <p className="text-gray-700">{neurodynamicResponses[currentTest.id].description}</p>
                      </div>
                    )}

                    {/* Butonlar */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          if (neurodynamicResponses[currentTest.id]) {
                            if (currentTestIndex < filteredTests.length - 1) {
                              setCurrentTestIndex(currentTestIndex + 1);
                            } else {
                              goToCompleted();
                            }
                          }
                        }}
                        disabled={!neurodynamicResponses[currentTest.id]}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        {currentTestIndex < filteredTests.length - 1 ? 'Kaydet ve İlerle' : 'Tamamla'}
                      </button>
                      <button
                        onClick={skipTest}
                        className="px-5 bg-white border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                      >
                        Atla
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Denge Testleri için Sol Sütun - Test Bilgileri + Adımlar */}
              {(currentTest as any).testMode === 'balance-timer' && (
                <div className="space-y-5">
                  {/* Test Başlığı */}
                  <div className={`bg-gradient-to-br ${(currentTest as any).isCritical ? 'from-orange-50 to-red-50 border-orange-200' : 'from-teal-50 to-cyan-50 border-teal-200'} rounded-xl p-6 border`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 ${(currentTest as any).isCritical ? 'bg-orange-600' : 'bg-teal-600'} rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
                        ⚖️
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{currentTest.name}</h3>
                        <span className={`text-sm font-medium ${(currentTest as any).isCritical ? 'text-orange-600' : 'text-teal-600'}`}>{(currentTest as any).targetArea}</span>
                      </div>
                    </div>
                    {(currentTest as any).isCritical && (
                      <div className="flex items-center gap-2 bg-orange-100 text-orange-800 p-3 rounded-lg text-sm font-semibold mb-3">
                        <AlertCircle size={18} />
                        KRİTİK TEST - Propriosepsiyon değerlendirmesi
                      </div>
                    )}
                    <p className="text-gray-600 text-base leading-relaxed">{currentTest.description}</p>
                  </div>

                  {/* Adım Adım Uygulama */}
                  <div className={`${(currentTest as any).isCritical ? 'bg-orange-50 border-orange-600' : 'bg-teal-50 border-teal-600'} border-l-4 p-6 rounded-lg`}>
                    <h3 className={`font-bold text-lg mb-5 ${(currentTest as any).isCritical ? 'text-orange-800' : 'text-teal-800'}`}>📋 Adım Adım Uygulama</h3>
                    <div className="space-y-5">
                      {(currentTest as any).detailedSteps?.map((step: any, index: number) => (
                        <div key={index} className="flex items-start gap-4">
                          <span className={`w-8 h-8 ${(currentTest as any).isCritical ? 'bg-orange-600' : 'bg-teal-600'} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}>
                            {step.step}
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-base mb-1">{step.title}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{step.instruction}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Denge Testleri için Sağ Sütun - Sesli Sayaç + Sonuç Girişi */}
              {(currentTest as any).testMode === 'balance-timer' && (
                <div className="flex flex-col gap-4">
                  {/* Sayaç Alanı */}
                  <div className={`bg-gradient-to-br ${(currentTest as any).isCritical ? 'from-orange-900 to-red-900' : 'from-teal-900 to-cyan-900'} rounded-xl p-5 shadow-lg text-white`}>
                    <h4 className="text-base font-bold mb-3 text-center flex items-center justify-center gap-2">
                      🔊 Sesli Sayaç
                    </h4>
                    
                    {/* Sayaç Durumuna Göre Görünüm */}
                    <div className="text-center">
                      {balanceTestState === 'idle' && (
                        <div className="space-y-3">
                          <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-4xl">⏱️</span>
                          </div>
                          <p className="text-white/80 text-xs">
                            {(currentTest as any).testVariant === 'eyes-closed' 
                              ? '5 saniye geri sayım sonrası GÖZLERİNİZİ KAPATIN.'
                              : '5 saniye geri sayım sonrası sayaç sesli saymaya başlar.'}
                          </p>
                          <button
                            onClick={startBalanceTest}
                            className={`w-full py-3 ${(currentTest as any).isCritical ? 'bg-orange-500 hover:bg-orange-400' : 'bg-teal-500 hover:bg-teal-400'} text-white text-lg font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2`}
                          >
                            <Play size={22} fill="white" />
                            Başlat
                          </button>
                        </div>
                      )}
                      
                      {balanceTestState === 'countdown' && (
                        <div className="space-y-4">
                          <div className={`w-40 h-40 mx-auto ${(currentTest as any).isCritical ? 'bg-orange-500' : 'bg-teal-500'} rounded-full flex items-center justify-center animate-pulse`}>
                            <span className="text-7xl font-bold">{balanceCountdown}</span>
                          </div>
                          <p className="text-2xl font-bold animate-pulse">Hazırlanın!</p>
                          {(currentTest as any).testVariant === 'eyes-closed' && balanceCountdown <= 2 && (
                            <p className="text-xl text-yellow-300 font-bold">👀 GÖZLERİNİZİ KAPATIN!</p>
                          )}
                        </div>
                      )}
                      
                      {balanceTestState === 'running' && (
                        <div className="space-y-4">
                          <div className={`w-44 h-44 mx-auto ${(currentTest as any).isCritical ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-teal-400 to-cyan-500'} rounded-full flex items-center justify-center shadow-2xl`}>
                            <span className="text-8xl font-bold">{balanceTimer}</span>
                          </div>
                          <p className="text-xl">saniye</p>
                          {(currentTest as any).testVariant === 'eyes-closed' && (
                            <p className="text-yellow-300 font-medium">👀 Gözleriniz kapalı olmalı!</p>
                          )}
                          <button
                            onClick={() => stopBalanceTest(balanceTimer)}
                            className="w-full py-4 bg-red-500 hover:bg-red-400 text-white text-xl font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-3"
                          >
                            <Pause size={28} />
                            Düştüm / Durdur
                          </button>
                        </div>
                      )}
                      
                      {balanceTestState === 'finished' && (
                        <div className="space-y-4">
                          <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-5xl">✅</span>
                          </div>
                          <p className="text-lg">Test tamamlandı!</p>
                          <button
                            onClick={resetBalanceTest}
                            className="flex items-center justify-center gap-2 mx-auto text-white/80 hover:text-white transition"
                          >
                            <RotateCcw size={18} />
                            Tekrar Dene
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Değerlendirme Kriterleri - Sayacın Altında */}
                  {balanceTestState !== 'finished' && (currentTest as any).evaluationCriteria && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2">
                        📐 Değerlendirme
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                          <span className="text-lg">{(currentTest as any).evaluationCriteria.good.icon}</span>
                          <span className="font-bold text-green-700">{(currentTest as any).evaluationCriteria.good.min}+s</span>
                          <span className="text-green-600 text-center">{(currentTest as any).evaluationCriteria.good.label}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg">
                          <span className="text-lg">{(currentTest as any).evaluationCriteria.moderate.icon}</span>
                          <span className="font-bold text-yellow-700">{(currentTest as any).evaluationCriteria.moderate.min}-{(currentTest as any).evaluationCriteria.moderate.max}s</span>
                          <span className="text-yellow-600 text-center">{(currentTest as any).evaluationCriteria.moderate.label}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
                          <span className="text-lg">{(currentTest as any).evaluationCriteria.poor.icon}</span>
                          <span className="font-bold text-red-700">&lt;{(currentTest as any).evaluationCriteria.poor.max + 1}s</span>
                          <span className="text-red-600 text-center">{(currentTest as any).evaluationCriteria.poor.label}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Sonuç Girişi */}
                  {balanceTestState === 'finished' && (
                    <div className={`bg-gradient-to-br ${(currentTest as any).isCritical ? 'from-orange-50 to-red-50 border-orange-200' : 'from-teal-50 to-cyan-50 border-teal-200'} border-2 rounded-xl p-4`}>
                      <h4 className={`font-bold ${(currentTest as any).isCritical ? 'text-orange-700' : 'text-teal-700'} mb-3 text-center text-sm`}>
                        ⏱️ Kaç saniye dengede kaldınız?
                      </h4>
                      
                      {/* Hızlı Seçenekler */}
                      <div className="grid grid-cols-6 gap-1.5 mb-3">
                        {[5, 10, 15, 20, 25, 30].map(sec => (
                          <button
                            key={sec}
                            onClick={() => setSelectedBalanceTime(sec)}
                            className={`py-2 rounded-lg font-bold text-sm transition ${
                              selectedBalanceTime === sec 
                                ? ((currentTest as any).isCritical ? 'bg-orange-600 text-white' : 'bg-teal-600 text-white')
                                : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                      
                      {/* Manuel Giriş */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-500 text-sm">veya:</span>
                        <input
                          type="number"
                          min="0"
                          max={((currentTest as any).testVariant === 'eyes-closed' ? 30 : 60)}
                          value={selectedBalanceTime || ''}
                          onChange={(e) => setSelectedBalanceTime(parseInt(e.target.value) || null)}
                          placeholder="Saniye"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold focus:outline-none focus:border-teal-500"
                        />
                        <span className="text-gray-500 text-sm">sn</span>
                      </div>
                      
                      {/* Sonuç Gösterimi */}
                      {selectedBalanceTime !== null && (currentTest as any).evaluationCriteria && (
                        <div className={`p-3 rounded-lg mb-3 ${
                          selectedBalanceTime >= (currentTest as any).evaluationCriteria.good.min
                            ? 'bg-green-100 border-l-4 border-green-500'
                            : selectedBalanceTime >= (currentTest as any).evaluationCriteria.moderate.min
                            ? 'bg-yellow-100 border-l-4 border-yellow-500'
                            : 'bg-red-100 border-l-4 border-red-500'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {selectedBalanceTime >= (currentTest as any).evaluationCriteria.good.min
                                ? (currentTest as any).evaluationCriteria.good.icon
                                : selectedBalanceTime >= (currentTest as any).evaluationCriteria.moderate.min
                                ? (currentTest as any).evaluationCriteria.moderate.icon
                                : (currentTest as any).evaluationCriteria.poor.icon}
                            </span>
                            <div>
                              <span className={`font-bold text-sm ${
                                selectedBalanceTime >= (currentTest as any).evaluationCriteria.good.min
                                  ? 'text-green-700'
                                  : selectedBalanceTime >= (currentTest as any).evaluationCriteria.moderate.min
                                  ? 'text-yellow-700'
                                  : 'text-red-700'
                              }`}>
                                {selectedBalanceTime >= (currentTest as any).evaluationCriteria.good.min
                                  ? (currentTest as any).evaluationCriteria.good.label
                                  : selectedBalanceTime >= (currentTest as any).evaluationCriteria.moderate.min
                                  ? (currentTest as any).evaluationCriteria.moderate.label
                                  : (currentTest as any).evaluationCriteria.poor.label}
                              </span>
                              <p className="text-xs text-gray-600">
                                {selectedBalanceTime >= (currentTest as any).evaluationCriteria.good.min
                                  ? (currentTest as any).evaluationCriteria.good.description
                                  : selectedBalanceTime >= (currentTest as any).evaluationCriteria.moderate.min
                                  ? (currentTest as any).evaluationCriteria.moderate.description
                                  : (currentTest as any).evaluationCriteria.poor.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Butonlar */}
                      <div className="flex gap-2">
                        <button
                          onClick={saveBalanceResult}
                          disabled={selectedBalanceTime === null}
                          className={`flex-1 ${(currentTest as any).isCritical ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-teal-600 to-cyan-600'} text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5`}
                        >
                          <CheckCircle2 size={16} />
                          {currentTestIndex < filteredTests.length - 1 ? 'Kaydet' : 'Tamamla'}
                        </button>
                        <button
                          onClick={skipTest}
                          className="px-4 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                        >
                          Atla
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Test henüz bitmemişken göster */}
                  {balanceTestState !== 'finished' && (
                    <div className="text-center mt-2">
                      <button
                        onClick={skipTest}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        Bu testi atla →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Ölçüm bazlı testler için özel UI */}
              {(currentTest as any).testMode === 'measurement' ? (
                <div className="lg:col-span-2">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Sol: Video/Görsel Alanı + Talimatlar */}
                    <div className="space-y-4">
                      {/* Video/Görsel Alanı */}
                      <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                          🎥 Diz-Duvar Mesafesi Testi
                        </h4>
                        <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain absolute inset-0"
                            style={{ display: 'none' }} // Video eklenene kadar gizli
                          >
                            <source src="/animations/knee-wall-test.mp4" type="video/mp4" />
                          </video>
                          {/* Video yoksa placeholder */}
                          <div className="text-center text-white p-6">
                            <p className="text-5xl mb-3">📏</p>
                            <p className="text-lg font-semibold">Diz-Duvar Mesafesi Testi</p>
                            <p className="text-sm opacity-70 mt-2">Video veya görsel buraya eklenecek</p>
                          </div>
                        </div>
                      </div>

                      {/* Detaylı Talimatlar */}
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                        <h3 className="font-bold text-base mb-4 text-blue-800">📋 Adım Adım Uygulama</h3>
                        
                        <div className="space-y-4">
                          {/* Adım 1 */}
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                            <div>
                              <p className="font-semibold text-gray-800">Hazırlık</p>
                              <p className="text-sm text-gray-600">Yüzünü duvara dön. Ayakkabı ve çoraplarını çıkar. Yanına cetvel veya mezura al.</p>
                            </div>
                          </div>
                          
                          {/* Adım 2 */}
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                            <div>
                              <p className="font-semibold text-gray-800">Pozisyon Al</p>
                              <p className="text-sm text-gray-600">Test edeceğin ayağının <strong>başparmağını duvara değdir</strong>. Diğer ayağını denge için geriye al.</p>
                            </div>
                          </div>
                          
                          {/* Adım 3 */}
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                            <div>
                              <p className="font-semibold text-gray-800">Hareketi Yap</p>
                              <p className="text-sm text-gray-600"><strong>Topuğunu yerden kaldırmadan</strong> dizini bükerek duvara değdirmeye çalış. Kolay gelirse ayağı geriye kaydır.</p>
                            </div>
                          </div>
                          
                          {/* Adım 4 */}
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                            <div>
                              <p className="font-semibold text-gray-800">Ölç ve Kaydet</p>
                              <p className="text-sm text-gray-600">Topuğun kalkmadan dizin değebildiği son noktada dur. <strong>Parmak ucu - duvar mesafesini</strong> cetvel ile ölç.</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>⚠️ Dikkat:</strong> Topuğun yerden kalkarsa, ayağını biraz duvara yaklaştır ve tekrar dene.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sağ: Ölçüm Girişi */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg h-fit">
                      <h4 className="text-lg font-bold text-gray-800 mb-5">📏 Ölçüm Sonuçlarını Gir</h4>
                      
                      <div className="space-y-4">
                        {/* Sol Ayak */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">
                            🦶 Sol {(currentTest as any).measurementLabel || 'Ayak Bileği'}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="0"
                              max={(currentTest as any).measurementUnit === '°' ? 60 : 25}
                              step={(currentTest as any).measurementUnit === '°' ? 1 : 0.5}
                              placeholder="0"
                              value={measurements[currentTest.id]?.left || ''}
                              onChange={(e) => setMeasurements(prev => ({
                                ...prev,
                                [currentTest.id]: { ...prev[currentTest.id], left: e.target.value }
                              }))}
                              className="w-24 px-4 py-3 border-2 border-gray-300 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-purple-500"
                            />
                            <span className="text-xl text-gray-500 font-semibold">{(currentTest as any).measurementUnit || 'cm'}</span>
                            {measurementResults[currentTest.id]?.left && (
                              <span className="text-2xl">{measurementResults[currentTest.id].left!.icon}</span>
                            )}
                          </div>
                        </div>

                        {/* Sağ Ayak */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <label className="block text-sm font-semibold text-gray-600 mb-2">
                            🦶 Sağ {(currentTest as any).measurementLabel || 'Ayak Bileği'}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="0"
                              max={(currentTest as any).measurementUnit === '°' ? 60 : 25}
                              step={(currentTest as any).measurementUnit === '°' ? 1 : 0.5}
                              placeholder="0"
                              value={measurements[currentTest.id]?.right || ''}
                              onChange={(e) => setMeasurements(prev => ({
                                ...prev,
                                [currentTest.id]: { ...prev[currentTest.id], right: e.target.value }
                              }))}
                              className="w-24 px-4 py-3 border-2 border-gray-300 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-purple-500"
                            />
                            <span className="text-xl text-gray-500 font-semibold">{(currentTest as any).measurementUnit || 'cm'}</span>
                            {measurementResults[currentTest.id]?.right && (
                              <span className="text-2xl">{measurementResults[currentTest.id].right!.icon}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sonuç Gösterimi */}
                      {(measurementResults[currentTest.id]?.left || measurementResults[currentTest.id]?.right) && (
                        <div className="mt-4 space-y-2">
                          {measurementResults[currentTest.id]?.left && (
                            <div className="p-3 rounded-lg" style={{ backgroundColor: measurementResults[currentTest.id].left!.color + '15' }}>
                              <span className="font-semibold" style={{ color: measurementResults[currentTest.id].left!.color }}>
                                Sol: {measurementResults[currentTest.id].left!.label} - {measurementResults[currentTest.id].left!.description}
                              </span>
                            </div>
                          )}
                          {measurementResults[currentTest.id]?.right && (
                            <div className="p-3 rounded-lg" style={{ backgroundColor: measurementResults[currentTest.id].right!.color + '15' }}>
                              <span className="font-semibold" style={{ color: measurementResults[currentTest.id].right!.color }}>
                                Sağ: {measurementResults[currentTest.id].right!.label} - {measurementResults[currentTest.id].right!.description}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Değerlendirme Skalası */}
                      <div className="mt-5 bg-gray-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">📊 Değerlendirme:</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> &lt;5cm Kısıtlı</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> 5-9cm Hafif</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> 10+cm Normal</span>
                        </div>
                      </div>

                      {/* Butonlar */}
                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => {
                            const leftValue = parseFloat(measurements[currentTest.id]?.left || '0');
                            const rightValue = parseFloat(measurements[currentTest.id]?.right || '0');
                            const criteria = (currentTest as any).evaluationCriteria;
                            
                            if (criteria && (leftValue > 0 || rightValue > 0)) {
                              const results: { left?: MeasurementResult; right?: MeasurementResult } = {};
                              if (leftValue > 0) results.left = evaluateMeasurement(leftValue, criteria);
                              if (rightValue > 0) results.right = evaluateMeasurement(rightValue, criteria);
                              setMeasurementResults(prev => ({ ...prev, [currentTest.id]: results }));
                            }
                          }}
                          disabled={!measurements[currentTest.id]?.left && !measurements[currentTest.id]?.right}
                          className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                        >
                          ✓ Değerlendir
                        </button>
                        <button
                          onClick={currentTestIndex < filteredTests.length - 1 ? () => { setCurrentTestIndex(currentTestIndex + 1); setCurrentStep('instructions'); } : goToCompleted}
                          className="px-5 bg-purple-100 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-200 transition"
                        >
                          {currentTestIndex < filteredTests.length - 1 ? 'İleri →' : 'Bitir'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (currentTest as any).testMode !== 'response' && (currentTest as any).testMode !== 'balance-timer' ? (
                /* Video bazlı testler için normal butonlar */
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep('recording')}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Video size={20} />
                      Kamera ile Kaydet
                    </button>
                    <button
                      onClick={() => setCurrentStep('upload')}
                      className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    >
                      <Upload size={20} />
                      Video Yükle
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {currentTestIndex < filteredTests.length - 1 ? (
                      <button
                        onClick={skipTest}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                      >
                        Bu Testi Atla
                      </button>
                    ) : (
                      <button
                        onClick={goToCompleted}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                      >
                        {completedTestsCount > 0 ? 'Testleri Tamamla' : 'Bu Testi Atla'}
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {currentStep === 'recording' && (
            <div className="space-y-4">
              {/* Video container - her zaman render edilir */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden relative" style={{ minHeight: '500px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    minHeight: '500px',
                    maxHeight: '600px',
                    backgroundColor: '#000',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    console.log('Video metadata yüklendi:', video.videoWidth, video.videoHeight);
                    video.play().catch(err => console.error('Play hatası:', err));
                  }}
                  onError={(e) => {
                    console.error('Video hatası:', e);
                  }}
                  onCanPlay={() => {
                    console.log('Video oynatılabilir');
                  }}
                />
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 z-20">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="font-semibold">
                      Kayıt: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>

              {/* Kayıt yapılırken butonlar */}
              {isRecording && (
                <div className="flex gap-3">
                  <button
                    onClick={stopRecording}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <Pause size={20} />
                    Kaydı Durdur
                  </button>
                  <button
                    onClick={() => {
                      stopRecording();
                      setCurrentStep('instructions');
                    }}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    İptal
                  </button>
                </div>
              )}

              {/* Kayıt başlatma butonu */}
              {!isRecording && !recordedVideos[currentTest.id] && (
                <div className="flex gap-3">
                  <button
                    onClick={startRecording}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <Video size={20} />
                    Kaydı Başlat
                  </button>
                  <button
                    onClick={() => setCurrentStep('instructions')}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    İptal
                  </button>
                </div>
              )}

              {/* Kayıt durduktan sonra butonlar */}
              {!isRecording && recordedVideos[currentTest.id] && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-green-700 mb-4">
                    <CheckCircle2 size={24} />
                    <span className="font-semibold text-lg">Video kaydedildi!</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep('review')}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Play size={20} />
                      İncele
                    </button>
                    <button
                      onClick={handleRetryRecording}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={20} />
                      Tekrar Kaydet
                    </button>
                    <button
                      onClick={handleSendVideo}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={20} />
                      Gönder
                    </button>
                  </div>
                  <button
                    onClick={handleDeleteVideo}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 mt-3"
                  >
                    <Trash2 size={20} />
                    Kaydedilen Videoyu Sil
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center bg-blue-50">
                <Upload size={48} className="mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Video Dosyası Yükle</h3>
                <p className="text-gray-600 mb-6">MP4, MOV veya WebM formatında video yükleyin</p>
                <label className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer">
                  Dosya Seç
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                onClick={() => setCurrentStep('instructions')}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Geri
              </button>
            </div>
          )}

          {currentStep === 'review' && recordedVideos[currentTest.id] && (
            <div className="space-y-4">
              <button
                onClick={() => setCurrentStep('instructions')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-2"
              >
                <ArrowLeft size={20} />
                <span className="font-semibold">Geri</span>
              </button>
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <video
                  src={recordedVideos[currentTest.id]}
                  controls
                  className="w-full h-auto max-h-[400px]"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-700 mb-3">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Değerlendirme Kriterleri</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {currentTest.evaluationPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EHA Testleri için Açı Rehberi */}
              {(currentTest as any).angleGuide && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-3">
                    <span className="text-xl">📐</span>
                    <span className="font-semibold">{(currentTest as any).angleGuide.title}</span>
                  </div>
                  <div className="space-y-2">
                    {(currentTest as any).angleGuide.ranges.map((range: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: range.color + '15' }}
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                          style={{ backgroundColor: range.color }}
                        >
                          {range.angle}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold" style={{ color: range.color }}>{range.status}</div>
                          <div className="text-sm text-gray-600">{range.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleSendVideo}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    Gönder
                  </button>
                  <button
                    onClick={handleRetryRecording}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Tekrar Kaydet
                  </button>
                </div>
                <button
                  onClick={handleDeleteVideo}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Kaydedilen Videoyu Sil
                </button>
              </div>
            </div>
          )}

          {currentStep === 'completed' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {completedTestsCount > 0 ? 'Testler Tamamlandı!' : 'Test Atlandı'}
              </h3>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Tamamlanan Testler:</strong> {completedTestsCount} / {config.tests.length}
                </p>
                {skippedTests.size > 0 && (
                  <p className="text-sm text-gray-600">
                    <strong>Atlanan Testler:</strong> {skippedTests.size}
                  </p>
                )}
              </div>
              {completedTestsCount > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Videolarınız fizyoterapistiniz tarafından değerlendirilecek.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>Sonraki Adım:</strong> Fizyoterapistiniz videoları inceleyip 24-48 saat içinde
                      size özel egzersiz programınızı hazırlayacak.
                    </p>
                  </div>
                  <button
                    onClick={submitAll}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Testleri Gönder
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Henüz hiçbir test tamamlanmadı. En az 1 test yapmanız önerilir.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setCurrentTestIndex(0);
                        setCurrentStep('instructions');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Test Yapmaya Başla
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                      İptal Et
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalTestModal;

