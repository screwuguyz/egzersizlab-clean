import React from "react";

interface AnalysisSummaryProps {
  open: boolean;
  onClose: () => void;
}

const packages = [
  {
    id: "temel",
    title: "Temel Analiz & Egzersiz Planı",
    subtitle: "Vücudunuzun neye ihtiyacı olduğunu öğrenin ve hemen başlayın.",
    tag: "PAKET 1",
    price: "₺499",
    accent: "text-emerald-600",
    border: "border-emerald-200",
    features: [
      "Detaylı anamnez değerlendirmesi",
      "Fizyoterapist tarafından risk analizi",
      "4 haftalık kişiye özel egzersiz reçetesi",
      "Egzersiz videoları ve açıklamaları",
      "Takip ve revizyon hedefi içermiyor",
    ],
  },
  {
    id: "takip",
    title: "Klinik Takip & İlerleme Paketi",
    subtitle: "Sadece bir liste değil, dinamik bir iyileşme süreci.",
    tag: "FİZYOTERAPİST ÖNERİSİ",
    price: "₺999",
    accent: "text-indigo-600",
    border: "border-indigo-200",
    features: [
      "Temel paketin tüm hizmetleri",
      "2 haftalık kontrol ve değerlendirme",
      "İhtiyaca göre program revizyonu",
      "Sistem üzerinden soru-cevap hakkı",
      "1 aylık aktif takip",
    ],
  },
  {
    id: "premium",
    title: "Premium Danışmanlık & Video Analizi",
    subtitle: "Fizyoterapistinizi cebinize alın, yapay zeka yardımıyla en etkin takibi edinin.",
    tag: "PREMIUM",
    price: "₺1.999",
    accent: "text-amber-600",
    border: "border-amber-200",
    features: [
      "Tüm paketlerdeki hizmetler",
      "Video analiz (hareket ve postür)",
      "Haftalık destek (chat/WhatsApp)",
      "İleri düzey değerlendirme için geri dönüş",
      "Sınırsız program güncellemesi",
    ],
  },
];

const clinicalTests = [
  {
    icon: "💪",
    title: "Detaylı Kas Kuvvet Analizi",
    subtitle: "Manuel kas testi simülasyonu",
    desc: "Hangi kaslarınız zayıf, hangileri aşırı çalışıyor? (Gluteal amnezi, core stabilizasyonu vb.)",
  },
  {
    icon: "🧪",
    title: "Kas Kısalık ve Esneklik Testleri",
    subtitle: "",
    desc: "Ağrınızın sebebi kas kısalığı mı? Hamstring, pektoral, iliopsoas, piriformis gerginlik testleri.",
  },
  {
    icon: "🦴",
    title: "Eklem Hareket Açıklığı",
    subtitle: "Gonyometrik analiz",
    desc: "Eklemler tam açıyla hareket ediyor mu, kısıtlılık derecesi nedir?",
  },
  {
    icon: "🧠",
    title: "Nörodinamik Testler",
    subtitle: "Sinir germe testleri",
    desc: "Ağrı kas kaynaklı mı yoksa sinir sıkışması mı (Fıtık/Siyatik)?",
  },
  {
    icon: "⚖️",
    title: "Fonksiyonel Denge ve Propriosepsiyon",
    subtitle: "",
    desc: "Vücudun uzaydaki konum algısı ve denge stratejisi.",
  },
  {
    icon: "👣",
    title: "Hareket Kalitesi Analizi",
    subtitle: "",
    desc: "Yürüme, eğilme ve uzanma sırasında omurga biyomekaniği kontrolü.",
  },
];

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-0 overflow-hidden">
      <div className="relative w-[94vw] h-[86vh] max-w-none bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 text-2xl font-bold"
          aria-label="Kapat"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 p-3 md:p-4 items-stretch h-full overflow-hidden">
          {/* Sol sütun */}
          <div className="col-span-1 flex flex-col">
            <div className="flex-1 rounded-2xl bg-gradient-to-b from-emerald-600 via-emerald-500 to-amber-400 text-white p-4 shadow-lg relative overflow-hidden flex flex-col justify-center mb-3">
              <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

              <div className="flex items-center gap-2 text-sm font-semibold bg-white/20 rounded-full px-3 py-1 w-fit">
                <span className="text-lg animate-pulse">✅</span>
                Ön profiliniz sisteme işlendi
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl">📤</div>
                <div className="text-base font-bold text-center">Verileriniz Fizyoterapiste iletildi</div>
                <div className="text-xs text-white/90 flex items-center gap-2">
                  <span className="text-emerald-200">✅</span>
                  <span>Tüm fotoğraflar ve ağrı haritanız başarıyla gönderildi</span>
                </div>
              </div>

              <div className="mt-2 w-full">
                <div className="rounded-2xl bg-purple-600 p-2 shadow-md flex items-start gap-3">
                  <div className="text-xl">🤖</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Yapay Zeka Ön Analizi Devam Ediyor...</div>
                    <div className="text-[11px] text-white/90">Duruş analizi, kas dengesizlik tespiti ve ağrı pattern tanıma işleniyor</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 w-full">
                <div className="rounded-2xl bg-amber-400 p-3 text-amber-900 font-semibold text-center shadow-md">
                  <div className="uppercase text-xs">Son bir adım kaldı!</div>
                  <div className="mt-1 text-sm">Fizyoterapistinizin egzersiz reçetesini hazırlayabilmesi için size uygun paketi seçin</div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                    <div className="h-full w-4/5 bg-indigo-600 flex items-center justify-end pr-2 text-xs font-semibold text-white">80%</div>
                  </div>
                </div>
                <button className="mt-3 w-full rounded-xl bg-emerald-600 text-white font-semibold py-2 hover:bg-emerald-700 transition">
                  Paketini Seç
                </button>
              </div>

            </div>
          </div>

          {/* Orta sütun */}
          <div className="col-span-1 flex flex-col space-y-3">
            <h3 className="text-xl font-bold text-slate-900 text-center">Hizmet Paketleri</h3>
            <div className="space-y-2">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border ${pkg.border} bg-white shadow-sm hover:shadow-md transition p-3`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase">{pkg.tag}</div>
                      <div className="text-base font-bold text-slate-900">{pkg.title}</div>
                      <div className="text-xs text-slate-600">{pkg.subtitle}</div>
                    </div>
                    <div className={`text-lg font-extrabold ${pkg.accent}`}>{pkg.price}</div>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 text-lg leading-none motion-safe:animate-pulse">✅</span>
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold py-2 hover:bg-slate-100 transition text-sm">
                    Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ sütun */}
          <div className="col-span-1 flex flex-col items-center justify-center space-y-3">
            <h3 className="text-xl font-bold text-slate-900 text-center">🔒 Paket sonrası klinik testler</h3>
            <p className="text-xs text-center text-slate-500 max-w-[90%]">
              Bu testler olmadan reçete yazmayız; paket alımından sonra dijital araçlarımızla uygulayacağız.
            </p>

            <div className="w-full relative">
              <div className="opacity-95 pointer-events-none rounded-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {clinicalTests.map((test, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm flex flex-col gap-1"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl inline-block motion-safe:animate-bounce transition-transform hover:scale-110 filter-none">{test.icon || '🩺'}</span>
                        <div className="filter-none">
                          <div className="text-base font-semibold text-slate-900 leading-tight blur-[1px] opacity-95">{test.title}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-700 leading-snug opacity-80 blur-[1px]">{test.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm mt-2 blur-[1px] opacity-90">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">❓</div>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Neden bu testler?</div>
                      <div className="text-sm text-slate-700 leading-snug">
                        Egzersiz bir ilaçtır; rastgele verilemez. Bu testlerle nokta atışı tedavi protokolü oluşturuyoruz.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 text-xs text-slate-800 rounded-full px-3 py-1 shadow">Satın alındığında açılır</div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrows between columns (visible on lg and larger) */}
        <div aria-hidden className="hidden lg:block pointer-events-none">
          <div className="absolute top-1/2 left-[33.333%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/90 rounded-full text-indigo-600 ring-1 ring-indigo-200 opacity-95 motion-safe:animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="absolute top-1/2 left-[66.666%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/90 rounded-full text-indigo-600 ring-1 ring-indigo-200 opacity-95 motion-safe:animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;
