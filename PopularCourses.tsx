import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Course } from '@/types';

interface PopularCoursesProps {
  courses: Course[]; // unused but kept for prop compatibility
}

const categories = [
  {
    tag: 'Ortopedi',
    title: 'Bel, Boyun ve Eklem Ağrıları',
    desc: 'Kas-iskelet sistemi ve egzersiz yöntemleri hakkında bilgiler',
    gradient: 'from-blue-100 to-blue-200',
    pill: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2v4M16 2v4M8 18v4M16 18v4M2 8h4M18 8h4M2 16h4M18 16h4" />
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    tag: 'Nöroloji',
    title: 'İnme, Sinir Sıkışması ve Rehabilitasyon',
    desc: 'Sinir sistemi ve hareket kontrolü hakkında bilgiler',
    gradient: 'from-purple-100 to-purple-200',
    pill: 'bg-purple-100 text-purple-700',
    iconColor: 'text-purple-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2C12 2 8 6 8 12s4 10 4 10" />
        <path d="M12 2C12 2 16 6 16 12s-4 10-4 10" />
        <path d="M2 12h20" />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    tag: 'Pediatri',
    title: 'Çocuk Sağlığı ve Gelişim Takibi',
    desc: 'Çocuklarda büyüme, gelişim ve sağlık rehberi',
    gradient: 'from-pink-100 to-pink-200',
    pill: 'bg-pink-100 text-pink-700',
    iconColor: 'text-pink-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M8 3h8" />
        <path d="M12 3v4" />
      </svg>
    ),
  },
  {
    tag: 'Yaşam',
    title: 'Koruyucu Sağlık ve Doğru Duruş',
    desc: 'Egzersiz, beslenme ve sağlıklı yaşam önerileri',
    gradient: 'from-green-100 to-green-200',
    pill: 'bg-green-100 text-green-700',
    iconColor: 'text-green-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    tag: 'Kadın Sağlığı',
    title: 'Hamilelik ve Doğum Sonrası',
    desc: 'Pelvik taban sağlığı, menopoz dönemi, güvenli egzersiz',
    gradient: 'from-rose-100 to-rose-200',
    pill: 'bg-rose-100 text-rose-700',
    iconColor: 'text-rose-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 16c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" />
        <path d="M12 16v4" />
        <path d="M8 20h8" />
        <path d="M12 20v2" />
        <circle cx="12" cy="10" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    tag: 'Sporcu Sağlığı',
    title: 'Sakatlıklar ve Performans',
    desc: 'Spora dönüş, ön çapraz bağ, sakatlık yönetimi',
    gradient: 'from-orange-100 to-orange-200',
    pill: 'bg-orange-100 text-orange-700',
    iconColor: 'text-orange-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6.5 6.5l11 11" />
        <path d="M17.5 6.5l-11 11" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
      </svg>
    ),
  },
  {
    tag: 'Kronik Ağrı',
    title: 'Fibromiyalji ve Romatizma',
    desc: 'Kronik ağrı yönetimi, iltihaplı romatizma, sabah tutukluğu',
    gradient: 'from-red-100 to-red-200',
    pill: 'bg-red-100 text-red-700',
    iconColor: 'text-red-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    tag: 'Geriatri',
    title: 'Sağlıklı Yaşlanma',
    desc: 'Düşme riskini azaltma, denge egzersizleri, kireçlenme yönetimi',
    gradient: 'from-indigo-100 to-indigo-200',
    pill: 'bg-indigo-100 text-indigo-700',
    iconColor: 'text-indigo-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full p-12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="5" />
        <path d="M3 21c0-3.5 4-6 9-6s9 2.5 9 6" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    ),
  },
];

const PopularCourses: React.FC<PopularCoursesProps> = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };

    // Run on mount and after layout
    requestAnimationFrame(updateScrollState);

    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollByCard = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.category-card');
    const amount = card ? card.offsetWidth + 32 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section
      id="blog"
      className="py-20 bg-blue-50/50"
      style={{ scrollMarginTop: '120px' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Blog Kategorileri</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Sağlık Bilgilerinizi Geliştirin</h2>
          </div>
          <button className="flex items-center gap-2 text-[#263562] font-semibold hover:text-blue-600 transition">
            Tüm Yazıları İncele <ArrowRight size={18} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollByCard('left')}
            disabled={!canScrollLeft}
            className="nav-button absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="rotate-180" />
          </button>
          <button
            onClick={() => scrollByCard('right')}
            disabled={!canScrollRight}
            className="nav-button absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-2 pt-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.scroll-container::-webkit-scrollbar{display:none;}`}</style>
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="category-card bg-white rounded-2xl overflow-hidden shadow-md flex-shrink-0"
                style={{ width: '320px' }}
              >
                <div className={`category-image h-48 bg-gradient-to-br ${cat.gradient} relative`}>
                  <div className={`${cat.iconColor} opacity-70 w-full h-full`}>
                    {cat.icon}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 ${cat.pill} text-xs font-semibold rounded-full`}>{cat.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{cat.desc}</p>
                  <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                    <button className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:gap-2 transition-all">
                      İncele <ArrowRight size={16} className="arrow-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;
