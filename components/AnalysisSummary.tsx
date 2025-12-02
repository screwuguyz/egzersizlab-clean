import React from 'react';

interface AnalysisSummaryProps {
  open: boolean;
  onClose: () => void;
}

const packages = [
  {
    id: 'basic',
    badge: 'Basit',
    name: 'Temel Analiz',
    price: '₺499',
    features: [
      'Temel fiziksel değerlendirme',
      'Ağrı haritası analizi',
      'Genel egzersiz önerileri',
      'Email desteği',
    ],
    gradient: 'from-gray-100 to-gray-200',
    accent: 'text-gray-700',
  },
  {
    id: 'medium',
    badge: 'Orta',
    name: 'Detaylı Analiz',
    price: '₺999',
    features: [
      'Kapsamlı fiziksel değerlendirme',
      'Detaylı ağrı haritası analizi',
      'Kişiselleştirilmiş egzersiz programı',
      'Video konsültasyon (30 dk)',
      'WhatsApp desteği',
    ],
    gradient: 'from-sky-50 to-blue-100',
    accent: 'text-blue-700',
  },
  {
    id: 'premium',
    badge: 'Premium',
    name: 'Premium Analiz',
    price: '₺1,999',
    features: [
      'AI destekli ağrı analizi',
      'Özel egzersiz programı + video rehber',
      'Video konsültasyon (60 dk)',
      '4 hafta takip ve destek',
      '7/24 WhatsApp desteği',
      'Öncelikli randevu',
    ],
    gradient: 'from-amber-50 to-orange-100',
    accent: 'text-orange-700',
  },
];

const lockedTests = [
  {
    icon: '💪',
    title: 'Detaylı Kas Kuvvet Analizi',
    subtitle: 'Manuel kas testi simülasyonu',
    desc: 'Hangi kaslarınız uykuda, hangileri aşırı çalışıyor? (Gluteal amnezi, core stabilizasyonu vb.)',
  },
  {
    icon: '📏',
    title: 'Kas Kısalık ve Esneklik Testleri',
    subtitle: '',
    desc: 'Ağrının sebebi kas kısalığı mı? Hamstring, pektoral, iliopsoas, piriformis gerginlik testleri.',
  },
  {
    icon: '📐',
    title: 'Eklem Hareket Açıklığı',
    subtitle: 'Gonyometrik analiz',
    desc: 'Eklemler tam açıyla hareket ediyor mu, kısıtlılık derecesi nedir?',
  },
  {
    icon: '⚡',
    title: 'Nörodinamik Testler',
    subtitle: 'Sinir germe testleri',
    desc: 'Ağrı kas kaynaklı mı yoksa sinir sıkışması mı (Fıtık/Siyatik)?',
  },
  {
    icon: '⚖️',
    title: 'Fonksiyonel Denge ve Propriosepsiyon',
    subtitle: '',
    desc: 'Vücudun uzaydaki konum algısı ve denge stratejisi.',
  },
  {
    icon: '🏃',
    title: 'Hareket Kalitesi Analizi',
    subtitle: '',
    desc: 'Çömelme, eğilme ve uzanma sırasında omurga biyomekaniği kontrolü.',
  },
];

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-auto">
      <div className="bg-white w-full max-w-4xl md:max-w-5xl lg:max-w-5xl xl:max-w-6xl md:w-11/12 rounded-3xl shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Kapat"
        >
          ×
        </button>
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vücut Analizi</h2>
              <p className="text-sm text-gray-600">
                Fotoğraflar ve ağrı haritanız gönderildi. Paket seçiminizle devam edelim.
              </p>
            </div>
            <div className="text-sm text-indigo-600 font-semibold">Ön profiliniz oluşturuldu</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 lg:gap-4 p-4 md:p-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm min-w-0">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-4">Hizmet Paketleri</h3>
            <div className="flex flex-col gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`package-card border rounded-xl p-4 bg-gradient-to-br ${pkg.gradient} shadow hover:shadow-lg transition`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/70 text-gray-800 uppercase">
                      {pkg.badge}
                    </span>
                    <span className="text-xl font-bold text-indigo-600">{pkg.price}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-3 w-full rounded-lg bg-indigo-600 text-white font-semibold py-2 hover:bg-indigo-700 transition">
                    Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm min-w-0">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">🔒 Paket sonrası klinik testler</h3>
            <p className="text-xs text-center text-gray-500 mb-4">
              Bu testler olmadan reçete yazmayız; paket alımından sonra dijital araçlarımızla uygulayacağız.
            </p>
            <div className="flex flex-col gap-3">
              {lockedTests.map((test, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 relative"
                >
                  <div className="text-2xl">{test.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{test.title}</div>
                    {test.subtitle && <div className="text-xs text-indigo-600 font-semibold">{test.subtitle}</div>}
                    <div className="text-sm text-gray-700 leading-relaxed">{test.desc}</div>
                  </div>
                  <div className="text-xl opacity-60">🔒</div>
                </div>
              ))}
            </div>
            <div className="info-box mt-4">
              <div className="text-3xl">💡</div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Neden bu testler?</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  Egzersiz bir ilaçtır; rastgele verilemez. Bu testlerle nokta atışı tedavi protokolü oluşturuyoruz.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
      `}</style>
    </div>
  );
};

export default AnalysisSummary;
