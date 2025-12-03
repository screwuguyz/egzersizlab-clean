import React from 'react';
import { Check, X } from 'lucide-react';

const packages = [
  {
    id: 'basic',
    badge: 'Basit',
    price: '₺499',
    title: 'Temel Analiz',
    tagline: 'Temel fiziksel değerlendirme ile hızlı başlangıç.',
    features: [
      'Temel fiziksel değerlendirme',
      'Ağrı haritası analizi',
      'Genel egzersiz önerileri',
      'Email desteği',
    ],
    recommended: false,
  },
  {
    id: 'recommended',
    badge: 'Orta',
    price: '₺999',
    title: 'Detaylı Analiz',
    tagline: 'Kişiselleştirilmiş program ve canlı destek.',
    features: [
      'Kapsamlı fiziksel değerlendirme',
      'Detaylı ağrı haritası analizi',
      'Kişiselleştirilmiş egzersiz programı',
      'Video konsültasyon (30 dk)',
      'WhatsApp desteği',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    badge: 'Premium',
    price: '₺1,999',
    title: 'Premium Analiz',
    tagline: 'AI destekli analiz ve öncelikli randevu.',
    features: [
      'AI destekli ağrı analizi',
      'Özel egzersiz programı + video rehber',
      'Video konsültasyon (60 dk)',
      '4 hafta takip ve destek',
      '7/24 WhatsApp desteği',
      'Öncelikli randevu',
    ],
    recommended: false,
  },
];

const Categories = () => {
  return (
    <section
      id="packages"
      className="relative overflow-hidden"
      style={{ scrollMarginTop: '140px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#e3ecff] via-[#e8eaff] to-[#e3f4ff]" />
      <div className="absolute -top-24 -left-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-indigo-300/25 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hizmet Paketleri
          </h2>
          <p className="mt-3 text-base md:text-lg text-slate-600">
            Bilimsel egzersiz reçetenizi alın, iyileşme sürecinizi profesyonel kontrolde yönetin.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 shadow-lg border-2 transition transform hover:-translate-y-1 ${
                pkg.id === 'basic'
                  ? 'bg-gradient-to-br from-gray-50 to-gray-200 border-gray-200'
                  : pkg.id === 'recommended'
                  ? 'bg-gradient-to-br from-sky-50 to-blue-100 border-blue-200'
                  : 'bg-gradient-to-br from-amber-50 to-orange-100 border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    pkg.id === 'basic'
                      ? 'bg-gray-700 text-white'
                      : pkg.id === 'recommended'
                      ? 'bg-blue-600 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {pkg.badge}
                </span>
                <span className="text-xl font-extrabold text-indigo-700">{pkg.price}</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.title}</h3>
              <p className="text-slate-600 text-sm mb-6">{pkg.tagline}</p>

              <ul className="space-y-2 text-sm">
                {pkg.features.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700 leading-relaxed">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                      <Check size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition">
                Sepete Ekle
              </button>
            </div>
          ))}
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <h5 className="text-lg font-bold text-slate-900 mb-1">Bilimsel Not</h5>
                <p className="text-slate-700 leading-relaxed">
                  Egzersiz tedavisi ilaç gibidir; adaptasyon için zamana ihtiyaç vardır. Literatür,
                  anlamlı iyileşme için en az 4-6 hafta düzenli uygulama önerir.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-3xl">✅</div>
              <div>
                <h5 className="text-lg font-bold text-slate-900 mb-1">Memnuniyet Garantisi</h5>
                <p className="text-slate-700 leading-relaxed">
                  Program size uymazsa ilk hafta içinde ücretsiz revizyon hakkınız var.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
