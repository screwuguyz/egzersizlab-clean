import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const exerciseCards = new URL('../exercise-cards.jpg.png', import.meta.url).href;

const sliderItems = [
  `Standart egzersiz listeleri herkese aynı şekilde dağıtılıyor. Peki bu yaklaşım sizin özel ihtiyaçlarınızı karşılıyor mu?

Genç bir sporcunun ihtiyaçları ile yaşlı birinin ihtiyaçları aynı olabilir mi?

Elinize tutuşturulan o kâğıt, sizin ağrı eşiğinizi, kas dengesizliğinizi veya hareket kısıtlılığınızı "okuyabiliyor" mu?`,
  `Anatomimiz parmak izimiz kadar benzersizken, egzersiz programımız nasıl bir fotokopi makinesinden çıkabilir?

Herkesin kemik yapısı, eklem açısı, geçmişteki yaralanmaları ve yaşam tarzı birbirinden tamamen farklıyken; hepsini aynı hareketlerle desteklemeye çalışmak, farklı kilitleri aynı anahtarla açmaya çalışmak değil midir?

Bir başkasına iyi gelen hareket, sizin özel durumunuzda farklı sonuçlar verebilir.`,
  `Doğru egzersiz programı; standart bir liste değil, size özel tasarlanan ve süreç içinde güncellenen dinamik bir plandır.

Egzersiz güçlü bir araçtır; dozajı, sıklığı ve türü kişiye göre ayarlanmalıdır.

Programınız, ihtiyaçlarınıza ve hedeflerinize göre şekillenen kişisel bir yol haritası olmalı.`
];

const microFacts = [
  "60 saniye uzak noktaya bakmak ekran yorgunluğunu ve baş ağrısını azaltır.",
  "Güne 5 dakikalık boyun mobilizasyonu ile başlamak migren ataklarını düşürebilir.",
  "Bel ağrısında her 30 dakikada 2 dakikalık yürüyüş, gerginliği belirgin azaltır.",
  "Denge egzersizleri diz cerrahisi sonrası güvenli hareket kapasitesini artırır."
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderItems.length);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const goPrev = () => setActiveSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  const goNext = () => setActiveSlide((prev) => (prev + 1) % sliderItems.length);
  const goPrevFact = () => setFactIndex((prev) => (prev - 1 + microFacts.length) % microFacts.length);
  const goNextFact = () => setFactIndex((prev) => (prev + 1) % microFacts.length);

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-[#eff6ff] to-[#f0fdfa] py-16 lg:py-24 overflow-hidden"
      style={{ scrollMarginTop: '140px' }}
    >
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Senin Vücudun, Bizim Bilimimiz: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Hareketin Yeni Formülü.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Egzersiz ve rehabilitasyonun birleştiği modern sağlık platformu. Sağlığın için dilediğin yerde, dilediğin zamanda harekete geç.
            </p>
            
            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="#packages"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🚀 Hemen Başla</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="#process"
                className="px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-xl border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Nasıl Çalışır?
              </a>
            </div>

            <div className="mt-6 w-full max-w-lg bg-gradient-to-br from-[#0f1c3a] via-[#0f1c3a] to-[#152c58] text-white rounded-2xl shadow-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold">
                  Bunları <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300">biliyor muydunuz?</span>
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={goPrevFact}
                    aria-label="Önceki bilgi"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={goNextFact}
                    aria-label="Sonraki bilgi"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <p className="text-base text-white/90 leading-relaxed min-h-[72px] transition-all">
                {microFacts[factIndex]}
              </p>
              <div className="mt-4 flex items-center gap-2">
                {microFacts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFactIndex(idx)}
                    aria-label={`Bilgi ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${factIndex === idx ? "w-5 bg-emerald-400" : "w-2 bg-white/30"}`}
                  />
                ))}
              </div>
              <button className="mt-6 w-full bg-white text-[#0f1c3a] font-semibold py-3 rounded-lg hover:bg-blue-50 transition">
                Daha fazla kısa bilgi
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <div className="bg-gradient-to-r from-[#0f1c3a]/85 to-[#1c2f55]/85 text-white px-5 py-3 rounded-2xl shadow-2xl max-w-xl border border-white/10">
                  <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">Standart kâğıtlar işe yaradı mı?</p>
                  <h3 className="text-2xl lg:text-3xl font-extrabold leading-tight">Gerçekten işe yaradı mı?</h3>
                  <p className="mt-2 text-sm text-white/85">Kâğıdın sizin anatomik ihtiyacınızı okuyup okuyamadığını gelin birlikte sorgulayalım.</p>
                </div>
              </div>
              <img 
                src={exerciseCards}
                alt="Standart egzersiz kâğıtları" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#0f1c3a] via-[#0f1c3a] to-[#152c58] text-white shadow-xl p-5 lg:p-6 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg lg:text-xl font-extrabold text-white">
                  Neden kişiye özel egzersiz?
                </h3>
                <div className="flex gap-2">
                  <button
                    aria-label="Önceki"
                    onClick={goPrev}
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    aria-label="Sonraki"
                    onClick={goNext}
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="text-sm lg:text-base text-white/90 leading-relaxed min-h-[120px] transition-all duration-300 space-y-3">
                {sliderItems[activeSlide]
                  .split('\n')
                  .filter(Boolean)
                  .map((line, idx) => (
                    <p
                      key={idx}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 shadow-sm"
                    >
                      {line.trim()}
                    </p>
                  ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                {sliderItems.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Slayt ${idx + 1}`}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeSlide === idx ? "w-6 bg-emerald-400" : "w-2 bg-white/50"}`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
