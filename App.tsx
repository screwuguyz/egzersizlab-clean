import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CourseCard from './components/CourseCard';
import GeminiAssistant from './components/GeminiAssistant';
import PopularCourses from './PopularCourses'; // Düzeltilmiş yol
import Hero from './components/Hero';
import FeaturesBar from './components/FeaturesBar';
import KnowledgeHub from './components/KnowledgeHub';
import Categories from './components/Categories';
import WebinarPromo from './components/WebinarPromo';
import Testimonials from './components/Testimonials';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import { Course } from './types';

// Mock Data
const courses: Course[] = [
  {
    id: 1,
    title: "Vakalarla Omurgada Radyolojik Değerlendirme: MR-XRay-BT",
    instructor: "Dr. Ahmet Yılmaz",
    price: 1100,
    rating: 5.0,
    reviewCount: 2,
    image: "https://picsum.photos/400/250?random=1",
    category: "Workshop",
    duration: "3 Saat",
    students: 46
  },
  {
    id: 2,
    title: "Diz Cerrahileri Sonrası Rehabilitasyon Sertifika Programı",
    instructor: "Prof. Dr. Ayşe Demir",
    price: 3000,
    rating: 4.8,
    reviewCount: 4,
    image: "https://picsum.photos/400/250?random=2",
    category: "Ortopedi",
    duration: "38 Ders",
    students: 54
  },
  {
    id: 3,
    title: "Fonksiyonel Bantlama Teknikleri",
    instructor: "Uzm. Fzt. Mehmet Kaya",
    price: 3000,
    rating: 4.9,
    reviewCount: 14,
    image: "https://picsum.photos/400/250?random=3",
    category: "Manuel Terapi",
    duration: "15 Ders",
    students: 65
  },
  {
    id: 4,
    title: "İnmede Fizyoterapi ve Rehabilitasyon",
    instructor: "Dr. Zeynep Çelik",
    price: 1499,
    rating: 5.0,
    reviewCount: 7,
    image: "https://picsum.photos/400/250?random=4",
    category: "Nöroloji",
    duration: "2 Saat",
    students: 26
  }
];

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Sticky buton görünürlüğü
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hero bölümünden sonra görünür olsun
      setShowStickyButton(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
      <Header 
        onOpenRegister={() => setShowRegister(true)} 
        isAuthenticated={isAuthenticated}
      />
      <Hero />

      {/* Güven & İkna Şeridi */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-2xl bg-white shadow-xl border border-slate-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white font-bold flex items-center justify-center">
                ⚡
              </div>
              <div>
                <p className="text-sm text-slate-500">Hızlı Başlangıç</p>
                <p className="text-lg font-extrabold text-slate-900">3 dakikada plan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center">
                ⭐
              </div>
              <div>
                <p className="text-sm text-slate-500">Kullanıcı memnuniyeti</p>
                <p className="text-lg font-extrabold text-slate-900">%92 mutlu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white font-bold flex items-center justify-center">
                🛡️
              </div>
              <div>
                <p className="text-sm text-slate-500">Risk tersine çevirme</p>
                <p className="text-lg font-extrabold text-slate-900">7 gün revizyon</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm text-slate-500">Şimdi başla</p>
                <p className="text-lg font-extrabold text-slate-900">Bugün ilk adım</p>
              </div>
              <a
                href="#packages"
                onClick={(e) => {
                  e.preventDefault();
                  setShowRegister(true);
                }}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/40 transition-transform hover:-translate-y-0.5"
              >
                Başla
              </a>
            </div>
          </div>
        </div>
      </section>

      <KnowledgeHub />
      <FeaturesBar />
      <Categories onSelectPackage={() => setShowRegister(true)} />

      {/* Popular Courses / Blog */}
      <PopularCourses courses={courses} />

      {/* Mini FAQ - İkna ve kaygı giderme */}
      <section
        id="faq"
        className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50"
        style={{ scrollMarginTop: '140px' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Sık Sorulanlar</h2>
            <p className="text-slate-600 mt-3">Karar vermeden önce en merak edilenler</p>
          </div>
          <div className="grid gap-4 max-w-5xl mx-auto">
            {[
              {
                q: 'Ne kadar sürede sonuç alırım?',
                a: 'Düzenli uygulamada 3-6 haftada belirgin iyileşme; ilk hafta içinde ağrı ve hareket açıklığında hafifleme beklenir.',
              },
              {
                q: 'Ağrım artarsa ne olacak?',
                a: 'İlk 7 gün içinde ücretsiz revizyon yapıyoruz; fizyoterapistiniz planı yeniden düzenler.',
              },
              {
                q: 'İptal/iade süreci nasıl?',
                a: 'Memnun kalmazsanız ilk hafta içinde koşulsuz revizyon; yasal iade haklarınız saklı.',
              },
              {
                q: 'Paketler arasındaki fark ne?',
                a: 'Temel hızlı başlangıç içindir; Detaylı paket kişiselleştirilmiş program ve video görüşme ekler; Premium 7/24 destek ve öncelikli randevu sunar.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition"
              >
                <p className="font-bold text-slate-900 text-lg">{item.q}</p>
                <p className="text-slate-600 mt-2">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="#packages"
              onClick={(e) => {
                e.preventDefault();
                setShowRegister(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/40 transition-transform hover:-translate-y-0.5"
            >
              Hemen Başla
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <Testimonials />

      <WebinarPromo />

      {/* Stats Counter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">1:1</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Kişiye Özel Program</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">7/24</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Dijital Erişim ve Destek</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">Kanıta Dayalı</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Bilimsel Egzersiz Programı</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">Birebir</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Fizyoterapist Takibi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-20 pb-10 w-full relative overflow-hidden"
        style={{ scrollMarginTop: '140px' }}
      >
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Marka ve vizyon */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <span className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">EgzersizLab</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 text-gray-400">
                EgzersizLab, bilimin ışığında kişiye özel rehabilitasyon ve egzersiz çözümleri sunan yeni nesil dijital
                sağlık platformudur. <span className="text-teal-400 font-semibold">Hareket, en güçlü ilaçtır.</span>
              </p>
              
              {/* Newsletter */}
              <div className="mb-6">
                <h5 className="text-white font-semibold mb-3 text-sm">📧 Bültenimize Abone Olun</h5>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition text-sm">
                    Abone Ol
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Sağlık ipuçları ve özel kampanyalardan haberdar olun</p>
              </div>

              {/* Sosyal Medya */}
              <div>
                <h5 className="text-white font-semibold mb-3 text-sm">Bizi Takip Edin</h5>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/egzersizlab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    title="Instagram"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/egzersizlab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    title="LinkedIn"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com/@egzersizlab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon w-11 h-11 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    title="YouTube"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/905551234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon w-11 h-11 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    title="WhatsApp"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Keşfet */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full"></span>
                Keşfet
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#process" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Sistem Nasıl İşliyor?</span>
                  </a>
                </li>
                <li>
                  <a href="#packages" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Hizmet Paketleri</span>
                  </a>
                </li>
                <li>
                  <a href="#blog" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Blog (Sağlık Rehberi)</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Sıkça Sorulan Sorular</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Müşteri Yorumları</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full"></span>
                Kurumsal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#about" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Hakkımızda</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">KVKK Aydınlatma Metni</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Mesafeli Satış Sözleşmesi</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">İptal ve İade Koşulları</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                    <span className="footer-link-arrow text-gray-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300 text-xs">→</span>
                    <span className="footer-link-text text-gray-400 group-hover:text-white transition-colors duration-300 text-sm">Kariyer</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* İletişim */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Bize Ulaşın</h4>
              <div className="space-y-4">
                <div className="contact-item flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Adres</p>
                    <p className="text-xs text-gray-400">Teknopark İzmir / Türkiye</p>
                  </div>
                </div>
                <div className="contact-item flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">E-posta</p>
                    <a href="mailto:iletisim@egzersizlab.com" className="text-xs text-teal-400 hover:text-teal-300 transition">
                      iletisim@egzersizlab.com
                    </a>
                  </div>
                </div>
                <div className="contact-item flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp</p>
                    <a href="https://wa.me/905551234567" target="_blank" rel="noopener noreferrer" className="text-xs text-teal-400 hover:text-teal-300 transition">
                      +90 555 123 45 67
                    </a>
                  </div>
                </div>
                <div className="contact-item flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Çalışma Saatleri</p>
                    <p className="text-xs text-gray-400">Pzt - Cuma: 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Güven Rozetleri */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-green-400">🔒</span>
                <span className="text-xs text-gray-300">KVKK Uyumlu</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-blue-400">🛡️</span>
                <span className="text-xs text-gray-300">SSL Güvenli</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-yellow-400">⭐</span>
                <span className="text-xs text-gray-300">4.9/5 Müşteri Puanı</span>
              </div>
            </div>
          </div>

          {/* Yasal Uyarı */}
          <div className="border-t border-gray-800 pt-6 pb-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed max-w-3xl mx-auto">
              ⚠️ <strong>Yasal Uyarı:</strong> Bu site tıbbi tanı veya tedavi hizmeti sunmamaktadır. 
              Sunulan öz-değerlendirme testleri ve içerikler yalnızca kişisel farkındalık ve bilgilendirme amaçlıdır. 
              Kesin değerlendirme için bir sağlık profesyoneline danışmanız önerilir.
            </p>
          </div>

          {/* Alt Kısım */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <p className="text-gray-400">© 2024 <span className="text-white font-semibold">EgzersizLab</span>. Tüm hakları saklıdır.</p>
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">Gizlilik Politikası</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">Kullanım Şartları</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Button */}
      {showStickyButton && (
        <div className="fixed bottom-6 left-6 z-[60] animate-fade-in">
          <a
            href="#packages"
            onClick={(e) => {
              e.preventDefault();
              setShowRegister(true);
            }}
            className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300"
          >
            <span className="text-2xl">🚀</span>
            <span>Hemen Başla</span>
            <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </a>
        </div>
      )}

      {/* AI Assistant */}
      <GeminiAssistant />

      {/* Registration Modal */}
      {showRegister && (
        <RegistrationModal
          onClose={() => setShowRegister(false)}
          onOpenLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => setShowLogin(false)}
          onOpenRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
