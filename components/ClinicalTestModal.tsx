import React, { useState, useRef } from 'react';
import { X, Upload, Video, Play, Pause, RotateCcw, CheckCircle2, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';

interface ClinicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testType: 'muscle-strength' | 'flexibility' | 'rom' | 'neurodynamic' | 'balance' | 'movement';
  userPainAreas?: string[]; // Kullanıcının seçtiği ağrılı bölgeler
}

type TestStep = 'instructions' | 'recording' | 'upload' | 'review' | 'completed';

const testConfigs = {
  'muscle-strength': {
    title: 'Kas Kuvveti Değerlendirmesi',
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
        relevantBodyAreas: ['knee-front-left', 'knee-front-right', 'knee-back-left', 'knee-back-right', 'hip-front', 'hip-back', 'lower-back', 'thigh-front-left', 'thigh-front-right', 'thigh-back-left', 'thigh-back-right'],
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
        id: 'single-leg',
        name: 'Tek Ayak Duruş',
        description: 'Bir ayağınızı kaldırın, 10 saniye dengede durun',
        duration: '10 saniye',
        videoTips: 'Önden çekin, dengeyi görebilmeli',
        relevantBodyAreas: ['ankle-front-left', 'ankle-front-right', 'knee-front-left', 'knee-front-right', 'hip-front', 'hip-back', 'lower-back'],
        instructions: [
          'Kamerayı önden konumlandırın',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Hareketi 10 saniye boyunca yapabildiğiniz kadar yapın',
        ],
        evaluationPoints: [
          '10 saniye durabildi mi?',
          'Vücut sallanıyor mu?',
          'Diğer ayak yere değiyor mu?',
        ],
      },
      {
        id: 'wall-pushup',
        name: 'Duvarda Şınav',
        description: 'Duvara yaslanın, 5 kez şınav yapın',
        duration: '30 saniye',
        videoTips: 'Yandan çekin, omuz ve dirsek hareketini görebilmeli',
        relevantBodyAreas: ['shoulder-front-left', 'shoulder-front-right', 'shoulder-back-left', 'shoulder-back-right', 'elbow-front-left', 'elbow-front-right', 'elbow-back-left', 'elbow-back-right', 'wrist-front-left', 'wrist-front-right', 'chest', 'upper-back', 'neck-front', 'neck-back', 'head-front', 'head-back'],
        instructions: [
          'Kamerayı yandan konumlandırın',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Hareketi 30 saniye boyunca yapabildiğiniz kadar yapın',
        ],
        evaluationPoints: [
          'Tam hareket yapabiliyor mu?',
          'Omuzlar düşüyor mu?',
          'Gövde düz kalıyor mu?',
        ],
      },
      {
        id: 'bridge',
        name: 'Köprü (Bridge)',
        description: 'Sırt üstü yatın, kalçaları kaldırın ve 5 saniye tutun',
        duration: '15 saniye',
        videoTips: 'Yandan çekin, kalça yüksekliğini görebilmeli',
        relevantBodyAreas: ['lower-back', 'mid-back', 'hip-front', 'hip-back', 'thigh-front-left', 'thigh-front-right'],
        instructions: [
          'Kamerayı yandan konumlandırın',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Hareketi 15 saniye boyunca yapabildiğiniz kadar yapın',
        ],
        evaluationPoints: [
          'Kalça yeterince yüksek mi?',
          'Bel ağrısı var mı?',
          '5 saniye tutabildi mi?',
        ],
      },
      {
        id: 'plank',
        name: 'Plank (Düz Duruş)',
        description: 'Dirsekler üzerinde, vücut düz, 20 saniye tutun',
        duration: '20 saniye',
        videoTips: 'Yandan çekin, vücut düz çizgisi görünmeli',
        relevantBodyAreas: ['lower-back', 'mid-back', 'upper-back', 'shoulder-front-left', 'shoulder-front-right', 'elbow-front-left', 'elbow-front-right', 'abdomen'],
        instructions: [
          'Kamerayı yandan konumlandırın',
          'Rahat kıyafetler giyin, hareketi engellemesin',
          'Testi yaparken ağrı olursa durun',
          'Hareketi 20 saniye boyunca yapabildiğiniz kadar yapın',
        ],
        evaluationPoints: [
          'Vücut düz mü?',
          'Kalça yukarı/aşağı mı?',
          '20 saniye tutabildi mi?',
        ],
      },
    ],
  },
  flexibility: {
    title: 'Esneklik Testleri',
    icon: '📏',
    instructions: [
      'Kamerayı yan profilden konumlandırın',
      'Hareketi yavaş yapın, zorlamayın',
      'Ağrı olursa durun',
    ],
    tests: [
      {
        id: 'hamstring',
        name: 'Hamstring Esneklik',
        description: 'Bacak düz, öne eğilin, ne kadar uzanabiliyorsunuz?',
        duration: '15 saniye',
        videoTips: 'Yandan çekin, eğilme açısını görebilmeli',
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
        id: 'shoulder',
        name: 'Omuz EHA',
        description: 'Kolu yukarı kaldırın, ne kadar açılabiliyor?',
        duration: '20 saniye',
        videoTips: 'Önden çekin, omuz açısını görebilmeli',
        evaluationPoints: ['Tam açılabiliyor mu?', 'Ağrı var mı?', 'Kısıtlılık var mı?'],
      },
    ],
  },
  neurodynamic: {
    title: 'Nörodinamik Testler',
    icon: '🧠',
    instructions: [
      'Testi yavaş yapın',
      'Ağrı veya uyuşma olursa durun',
    ],
    tests: [
      {
        id: 'slump',
        name: 'Slump Test',
        description: 'Oturun, baş öne, bacak düz, ayak bileğini çekin',
        duration: '20 saniye',
        videoTips: 'Yandan çekin, tüm vücut görünmeli',
        evaluationPoints: ['Ağrı var mı?', 'Uyuşma var mı?', 'Nerede hissediliyor?'],
      },
    ],
  },
  balance: {
    title: 'Denge Testleri',
    icon: '⚖️',
    instructions: [
      'Güvenli bir alanda yapın',
      'Yanınızda destek olsun',
    ],
    tests: [
      {
        id: 'tandem',
        name: 'Tandem Yürüyüş',
        description: 'Ayaklar bir önde bir arkada, düz çizgide yürüyün',
        duration: '30 saniye',
        videoTips: 'Ardından çekin, yürüyüşü görebilmeli',
        evaluationPoints: ['Dengede kalabiliyor mu?', 'Sallanıyor mu?', 'Kaç adım yürüyebildi?'],
      },
    ],
  },
  movement: {
    title: 'Hareket Analizi',
    icon: '🩺',
    instructions: [
      'Günlük hareketleri yapın',
      'Doğal hareket edin',
    ],
    tests: [
      {
        id: 'squat-daily',
        name: 'Günlük Çömelme',
        description: 'Yerden bir şey alır gibi çömelin',
        duration: '20 saniye',
        videoTips: 'Yandan çekin, tüm hareket görünmeli',
        evaluationPoints: ['Bel eğiliyor mu?', 'Dizler içe mi?', 'Asimetri var mı?'],
      },
    ],
  },
};

const ClinicalTestModal: React.FC<ClinicalTestModalProps> = ({ isOpen, onClose, testType, userPainAreas = [] }) => {
  const [currentStep, setCurrentStep] = useState<TestStep>('instructions');
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [recordedVideos, setRecordedVideos] = useState<Record<string, string>>({});
  const [uploadedVideos, setUploadedVideos] = useState<Record<string, File | null>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [skippedTests, setSkippedTests] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const baseConfig = testConfigs[testType];
  
  // Kullanıcının ağrılı bölgelerine göre testleri filtrele
  const filteredTests = React.useMemo(() => {
    if (!userPainAreas || userPainAreas.length === 0) {
      // Ağrılı bölge yoksa tüm testleri göster
      return baseConfig.tests;
    }
    
    const filtered = baseConfig.tests.filter((test) => {
      // Eğer test'in relevantBodyAreas'ı yoksa, tüm kullanıcılar için göster
      if (!test.relevantBodyAreas || test.relevantBodyAreas.length === 0) {
        return true;
      }
      
      // Test'in ilgili olduğu bölgelerle kullanıcının ağrılı bölgelerini karşılaştır
      const hasRelevantPain = test.relevantBodyAreas.some((area) => 
        userPainAreas.some((userArea) => {
          // Tam eşleşme veya kısmi eşleşme kontrolü
          return userArea.includes(area) || area.includes(userArea);
        })
      );
      
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
  const completedTestsCount = Object.keys(recordedVideos).length;
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

  const submitAll = () => {
    if (completedTestsCount < 1) {
      alert('En az 1 test tamamlamanız gerekiyor. Lütfen bir test yapın.');
      setCurrentTestIndex(0);
      setCurrentStep('instructions');
      return;
    }
    // Tüm videoları backend'e gönder
    console.log('Videolar gönderiliyor:', uploadedVideos);
    console.log('Tamamlanan testler:', completedTestsCount);
    console.log('Atlanan testler:', skippedTests.size);
    // TODO: API call to upload videos
    onClose();
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
          {currentStep === 'instructions' && (
            <div className={`grid gap-6 ${currentTest.id === 'squat' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Sol Sütun - Test Bilgileri ve Genel Talimatlar */}
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
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-sm font-semibold text-purple-700 mb-1">📹 Video İpuçları:</p>
                    <p className="text-sm text-gray-600">{currentTest.videoTips}</p>
                  </div>
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
                  {currentTestIndex < config.tests.length - 1 ? (
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

