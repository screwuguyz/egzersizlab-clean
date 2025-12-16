import React, { useState } from 'react';

interface AnalysisSummaryProps {
  open: boolean;
  onClose: () => void;
  onAddToCart?: (item: { id: string; name: string; price?: string }) => void;
  cartItems?: { id: string }[];
}

type PackageItem = {
  id: string;
  badge?: string;
  name: string;
  subtitle?: string;
  price?: string;
  features: string[];
  gradient: string;
  accent: string;
};

const packages: PackageItem[] = [
  {
    id: 'basic',
    badge: 'Temel',
    name: 'Temel Analiz & Egzersiz Planı',
    subtitle: 'Vücudunuzun neye ihtiyacı olduğunu öğrenin ve hemen başlayın.',
    price: '599',
    features: [
      'Detaylı anamnez değerlendirmesi',
      'Fizyoterapist tarafından vaka analizi',
      '4-6 haftalık kişiye özel egzersiz programı',
      'Egzersiz videoları ve açıklamaları',
    ],
    gradient: 'from-white to-slate-50',
    accent: 'text-gray-700',
  },
  {
    id: 'medium',
    badge: '⭐ Önerilen',
    name: 'Klinik Takip & İlerleme Paketi',
    subtitle: 'Sadece bir liste değil, dinamik bir iyileşme süreci.',
    price: '1.299',
    features: [
      'Temel paketteki tüm hizmetler',
      'Haftalık kontrol ve değerlendirme',
      'Ağrı ve gelişime göre program revizyonu',
      'Sistem üzerinden soru-cevap hakkı',
      '1 aylık aktif takip',
    ],
    gradient: 'from-emerald-50 to-teal-50',
    accent: 'text-emerald-700',
  },
  {
    id: 'premium',
    badge: '👑 Premium',
    name: 'Premium Danışmanlık & Video Analizi',
    subtitle: 'Fizyoterapistiniz cebinizde; yanlış yapma riskini sıfıra indirin.',
    price: '2.499',
    features: [
      'Tüm paketlerdeki hizmetler',
      'Video analizi: egzersizlerinizi kaydedin, geri bildirim alın',
      'Hızlı destek (chat/WhatsApp)',
      'Öncelikli değerlendirme (aynı gün dönüş)',
      'Sınırsız program güncellemesi',
    ],
    gradient: 'from-amber-50 to-orange-50',
    accent: 'text-orange-700',
  },
];

const lockedTests = [
  { icon: '🛡️', title: 'Detaylı Kas Kuvvet Analizi', subtitle: 'Manuel kas testi simülasyonu', desc: 'Hangi kaslarınız uykuda, hangileri aşırı çalışıyor? (Gluteal amnezi, core stabilizasyonu vb.)' },
  { icon: '📏', title: 'Kas Kısalık ve Esneklik Testleri', subtitle: 'Ağrısının sebebi kas kısalığı mı?', desc: 'Hamstring, pektoral, iliopsoas, piriformis gerginlik testleri.' },
  { icon: '📐', title: 'Eklem Hareket Açıklığı', subtitle: 'Gonyometrik analiz', desc: 'Eklemler tam açıyla hareket ediyor mu, kısıtlılık derecesi nedir?' },
  { icon: '🧠', title: 'Sinir Hassasiyeti Kontrolü', subtitle: 'Sinir germe testleri', desc: 'Kas ve sinir hassasiyetini ayırt etmenize yardımcı olur.' },
  { icon: '⚖️', title: 'Fonksiyonel Denge ve Propriosepsiyon', subtitle: 'Vücudun uzaydaki konum algısı ve denge stratejisi', desc: 'Vücudun uzaydaki konum algısı ve denge stratejisi.' },
  { icon: '🩺', title: 'Hareket Kalitesi Analizi', subtitle: 'Çömelme, eğilme ve uzanma sırasında omurga biyomekaniği kontrolü', desc: 'Çömelme, eğilme ve uzanma sırasında omurga biyomekaniği kontrolü.' },
];

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ open, onClose, onAddToCart, cartItems = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const isInCart = (id: string) => cartItems.some(item => item.id === id);

  const handleAddToCart = (pkg: { id: string; name: string; price?: string }) => {
    if (!isInCart(pkg.id) && onAddToCart) {
      onAddToCart(pkg);
    }
  };

  const nextPage = () => {
    if (currentPage < 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[95vw] h-[95vh] rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 z-30 text-2xl font-bold"
          aria-label="Kapat"
        >
          ×
        </button>

        {/* Carousel Container */}
        <div className="carousel-container">
          <div 
            className="carousel-wrapper"
            style={{ 
              transform: `translateX(calc(-${currentPage} * 50%))`
            }}
          >
            {/* Page 1: Status & Progress */}
            <div className="carousel-page">
              <div className="page-content">
            {/* Success Badge */}
                <div className="success-badge">
              <span className="success-check">✓</span>
              <span>Ön Profiliniz Sisteme İşlendi</span>
            </div>

            {/* Status Card */}
                <div className="status-card">
                  <div className="status-icon">📤</div>
                  <h3 className="status-title">Verileriniz Fizyoterapiste İletildi</h3>
                  <p className="status-sub">✓ Tüm fotoğraflar ve ağrı haritanız başarıyla gönderildi</p>
              
              {/* AI Banner */}
                  <div className="ai-banner">
                    <span className="ai-icon">🤖</span>
                    <div className="ai-text">
                  <strong>Yapay Zeka Ön Analizi Devam Ediyor</strong>
                  <span>Duruş analizi, kas dengesizlik tespiti işleniyor...</span>
                </div>
              </div>
            </div>

            {/* CTA */}
                <div className="cta-card">
                  <span className="cta-badge">🎯 SON ADIM</span>
                  <p className="cta-text">
                    Fizyoterapistinizin egzersiz programınızı hazırlayabilmesi için <strong>size uygun paketi seçin</strong>
                  </p>
            </div>

            {/* Progress */}
                <div className="progress-card">
                  <div className="progress-header">
                <span>Süreç İlerlemesi</span>
                    <span className="progress-pct">75%</span>
              </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
                  <div className="progress-steps">
                    <span className="step done">✓ Bilgiler Gönderildi</span>
                    <span className="step current">⏳ Paket Seçimi</span>
                  </div>
              </div>
            </div>
          </div>

            {/* Page 2: Packages & Tests Side by Side */}
            <div className="carousel-page">
              <div className="page-content-two-columns">
                {/* Left Side: Packages */}
                <div className="packages-column">
                  <h2 className="column-title">🎁 Hizmet Paketleri</h2>
                  <div className="packages-list-vertical">
              {packages.map((pkg) => {
                const inCart = isInCart(pkg.id);
                return (
                        <div key={pkg.id} className={`package-card-vertical ${pkg.id === 'medium' ? 'recommended' : ''} ${inCart ? 'in-cart' : ''}`}>
                          <div className="package-header">
                            <span className={`package-badge ${pkg.id}`}>{pkg.badge}</span>
                            <span className="package-price">{pkg.price}<small>₺</small></span>
                    </div>
                          <h3 className="package-name">{pkg.name}</h3>
                          <ul className="package-features">
                            {pkg.features.map((f, idx) => (
                              <li key={idx}>
                                <span className="feat-check">✓</span>
                                {f}
                              </li>
                      ))}
                    </ul>
                    {inCart ? (
                            <button className="cart-btn added">
                        ✓ Sepete Eklendi
                      </button>
                    ) : (
                      <button 
                              className={`cart-btn ${pkg.id === 'medium' ? 'green' : ''}`}
                        onClick={() => handleAddToCart(pkg)}
                      >
                        🛒 Sepete Ekle
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

                {/* Center Arrow */}
                <div className="center-arrow">
                  <button 
                    onClick={prevPage}
                    className="arrow-button"
                    aria-label="Önceki sayfa"
                  >
                    →
                  </button>
                </div>

                {/* Right Side: Clinical Tests */}
                <div className="tests-column">
                  <div className="tests-header">
                    <h2 className="column-title">🔒 Paket Sonrası Öz-Değerlendirme Testleri</h2>
                    <p className="column-subtitle">Bu testler olmadan program oluşturmayız; paket alımından sonra uygulayacağız.</p>
                  </div>
                  
                  <div className="tests-list-vertical">
              {lockedTests.map((test, idx) => (
                      <div key={idx} className="test-card-vertical">
                        <div className="test-header">
                          <span className="test-icon">{test.icon}</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                  <div className="test-content">
                          <h4 className="test-title">{test.title}</h4>
                          {test.subtitle && <p className="test-subtitle">{test.subtitle}</p>}
                          <p className="test-desc">{test.desc}</p>
                  </div>
                </div>
              ))}
            </div>
                  
                  <div className="info-box">
                    <span className="info-icon">💡</span>
              <div>
                <strong>Neden bu testler?</strong>
                      <p>Egzersiz güçlü bir araçtır; rastgele uygulanamaz. Bu testlerle size özel egzersiz programı oluşturuyoruz.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons - Only on Page 1 */}
        {currentPage === 0 && (
          <button
            onClick={nextPage}
            className="nav-btn nav-btn-right"
            aria-label="Sonraki"
          >
            →
          </button>
        )}

        {/* Page Indicators */}
        <div className="page-indicators">
          {[0, 1].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`indicator ${currentPage === page ? 'active' : ''}`}
              aria-label={`Sayfa ${page + 1}`}
            />
          ))}
      </div>

      <style>{`
          .carousel-container {
            width: 100%;
          height: 100%;
            overflow: hidden;
            position: relative;
          }
          .carousel-wrapper {
          display: flex;
            width: 200%;
            height: 100%;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
        }
          .carousel-page {
            width: 50%;
            min-width: 50%;
            max-width: 50%;
            height: 100%;
            flex-shrink: 0;
          overflow: hidden;
            position: relative;
          }
          .page-content {
            padding: 40px;
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
            height: 100%;
          display: flex;
          flex-direction: column;
            gap: 24px;
            box-sizing: border-box;
            overflow-y: auto;
          }
          .page-content-two-columns {
            padding: 30px;
            width: 100%;
          height: 100%;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            box-sizing: border-box;
            overflow: hidden;
        }
          
          /* Page 1 Styles */
          .success-badge {
          display: inline-flex;
          align-items: center;
            gap: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
            padding: 14px 24px;
          border-radius: 50px;
            font-size: 18px;
          font-weight: 700;
          width: fit-content;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }
        .success-check {
            width: 28px;
            height: 28px;
          background: #fff;
          color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
            font-size: 16px;
          font-weight: 800;
        }
          .status-card {
          background: #fff;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            padding: 32px;
          text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
          .status-icon {
            font-size: 64px;
            margin-bottom: 16px;
        }
          .status-title {
            font-size: 28px;
          font-weight: 800;
          color: #1e293b;
            margin: 0 0 12px 0;
        }
          .status-sub {
            font-size: 18px;
          color: #10b981;
          font-weight: 600;
            margin: 0 0 20px 0;
        }
          .ai-banner {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
            padding: 20px 24px;
            border-radius: 16px;
          display: flex;
          align-items: center;
            gap: 16px;
          text-align: left;
            margin-top: 20px;
        }
          .ai-icon {
            font-size: 40px;
            flex-shrink: 0;
        }
          .ai-text {
          color: #fff;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
          .ai-text strong {
          display: block;
            font-size: 20px;
            font-weight: 700;
        }
          .ai-text span {
            font-size: 16px;
          opacity: 0.9;
        }
          .cta-card {
          background: linear-gradient(135deg, #fbbf24, #f97316);
            padding: 24px 32px;
            border-radius: 20px;
          text-align: center;
            box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
        }
          .cta-badge {
          display: inline-block;
          background: rgba(255,255,255,0.9);
          color: #ea580c;
            padding: 6px 16px;
          border-radius: 20px;
            font-size: 14px;
          font-weight: 800;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
          .cta-text {
            font-size: 20px;
          color: #fff;
          margin: 0;
            line-height: 1.5;
        }
          .cta-text strong {
            display: block;
            font-size: 24px;
            margin-top: 8px;
        }
          .progress-card {
          background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
        }
          .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
            font-size: 18px;
          font-weight: 600;
          color: #64748b;
            margin-bottom: 12px;
        }
          .progress-pct {
          background: #10b981;
          color: #fff;
            padding: 6px 16px;
          border-radius: 20px;
            font-size: 16px;
          font-weight: 700;
        }
          .progress-track {
            height: 12px;
          background: #e2e8f0;
            border-radius: 12px;
          overflow: hidden;
            margin-bottom: 16px;
        }
          .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
            border-radius: 12px;
            transition: width 0.5s ease;
        }
          .progress-steps {
          display: flex;
          justify-content: center;
            gap: 16px;
        }
          .step {
            font-size: 16px;
          font-weight: 600;
            padding: 10px 20px;
            border-radius: 10px;
          background: #fff;
            border: 2px solid #e2e8f0;
          color: #64748b;
        }
          .step.done {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }
          .step.current {
          background: #fef3c7;
          border-color: #fde047;
          color: #a16207;
        }
        
          /* Page 2 Styles - Two Column Layout */
          .packages-column, .tests-column {
          display: flex;
          flex-direction: column;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .packages-column {
            padding-right: 10px;
          }
          .tests-column {
            padding-left: 10px;
            position: relative;
          }
          .tests-header {
            margin-bottom: 16px;
            filter: blur(0.5px);
            opacity: 0.9;
          }
          .tests-list-vertical {
            filter: blur(1.5px);
            opacity: 0.85;
          }
          .tests-column .info-box {
            filter: blur(0.5px);
            opacity: 0.9;
        }
          .column-title {
            font-size: 28px;
            font-weight: 800;
          color: #1e293b;
          text-align: center;
            margin: 0 0 16px 0;
        }
          .column-subtitle {
            font-size: 16px;
          color: #64748b;
          text-align: center;
            margin: 0 0 20px 0;
            line-height: 1.5;
        }
          .packages-list-vertical, .tests-list-vertical {
          display: flex;
          flex-direction: column;
            gap: 16px;
          flex: 1;
            overflow-y: auto;
        }
          .package-card-vertical {
            background: #fff;
          border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
          display: flex;
          flex-direction: column;
            transition: all 0.3s;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .package-card-vertical:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
          .package-card-vertical.recommended {
          border-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);
        }
          .package-card-vertical.in-cart {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          }
          .package-card-vertical .package-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
            margin-bottom: 12px;
        }
          .package-card-vertical .package-badge {
            font-size: 12px;
          font-weight: 700;
            padding: 4px 10px;
          border-radius: 20px;
          background: #e2e8f0;
          color: #64748b;
        }
          .package-card-vertical .package-badge.medium {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
        }
          .package-card-vertical .package-badge.premium {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
        }
          .package-card-vertical .package-price {
            font-size: 24px;
          font-weight: 800;
          color: #1e293b;
        }
          .package-card-vertical .package-price small {
            font-size: 16px;
          color: #64748b;
        }
          .package-card-vertical .package-name {
            font-size: 20px;
          font-weight: 700;
          color: #1e293b;
            margin: 0 0 12px 0;
            line-height: 1.3;
        }
          .package-card-vertical .package-features {
          list-style: none;
          padding: 0;
            margin: 0 0 16px 0;
          flex: 1;
        }
          .package-card-vertical .package-features li {
            font-size: 15px;
          color: #475569;
            padding: 6px 0;
          display: flex;
          align-items: flex-start;
            gap: 8px;
            line-height: 1.4;
        }
          .package-card-vertical .feat-check {
          color: #10b981;
          font-weight: 700;
          flex-shrink: 0;
            font-size: 16px;
        }
          .package-card-vertical .cart-btn {
          width: 100%;
            padding: 14px;
          border: none;
            border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
            font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
            box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
        }
          .package-card-vertical .cart-btn:hover {
          transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        }
          .package-card-vertical .cart-btn.green {
          background: linear-gradient(135deg, #10b981, #059669);
            box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
        }
          .package-card-vertical .cart-btn.added {
          background: linear-gradient(135deg, #6b7280, #4b5563);
        }
          .center-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
        }
          .arrow-button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #10b981;
            color: #fff;
            font-size: 24px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .arrow-button:hover {
            background: #059669;
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }
          .test-card-vertical {
            background: #fff;
            border: 2px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
          display: flex;
            flex-direction: column;
            gap: 12px;
            transition: all 0.2s;
          }
          .test-card-vertical:hover {
            border-color: #10b981;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .test-card-vertical .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
          .test-card-vertical .test-icon {
            font-size: 32px;
        }
          .test-card-vertical .lock-icon {
            font-size: 20px;
            opacity: 0.5;
          }
          .test-card-vertical .test-title {
            font-size: 18px;
          font-weight: 700;
          color: #1e293b;
            margin: 0 0 6px 0;
            line-height: 1.3;
        }
          .test-card-vertical .test-subtitle {
            font-size: 15px;
          color: #6366f1;
          font-weight: 600;
            margin: 0 0 6px 0;
        }
          .test-card-vertical .test-desc {
            font-size: 14px;
          color: #64748b;
            line-height: 1.4;
            margin: 0;
          }
          .tests-column .info-box {
            margin-top: 16px;
            padding: 16px;
          flex-shrink: 0;
        }
          .tests-column .info-box strong {
            font-size: 16px;
          color: #92400e;
            margin-bottom: 6px;
        }
          .tests-column .info-box p {
            font-size: 14px;
          color: #a16207;
            margin: 0;
            line-height: 1.4;
          }
          .package-card {
            background: #fff;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            padding: 32px;
          display: flex;
            flex-direction: column;
            transition: all 0.3s;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .package-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
          .package-card.recommended {
            border-color: #10b981;
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            box-shadow: 0 8px 30px rgba(16, 185, 129, 0.2);
          }
          .package-card.in-cart {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }
          .package-header {
          display: flex;
            justify-content: space-between;
          align-items: center;
            margin-bottom: 16px;
        }
          .package-badge {
          font-size: 14px;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 20px;
            background: #e2e8f0;
            color: #64748b;
        }
          .package-badge.medium {
            background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
        }
          .package-badge.premium {
            background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
        }
          .package-price {
            font-size: 32px;
          font-weight: 800;
            color: #1e293b;
          }
          .package-price small {
            font-size: 20px;
            color: #64748b;
          }
          .package-name {
            font-size: 24px;
            font-weight: 700;
          color: #1e293b;
            margin: 0 0 20px 0;
            line-height: 1.3;
        }
          .package-features {
            list-style: none;
            padding: 0;
            margin: 0 0 24px 0;
            flex: 1;
          }
          .package-features li {
            font-size: 18px;
            color: #475569;
            padding: 8px 0;
          display: flex;
            align-items: flex-start;
          gap: 10px;
            line-height: 1.5;
        }
          .package-features .more-feat {
            color: #94a3b8;
            font-style: italic;
            padding-left: 24px;
        }
          .feat-check {
            color: #10b981;
          font-weight: 700;
            flex-shrink: 0;
            font-size: 20px;
          }
          .cart-btn {
            width: 100%;
            padding: 18px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }
          .cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          }
          .cart-btn.green {
            background: linear-gradient(135deg, #10b981, #059669);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          }
          .cart-btn.green:hover {
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
          .cart-btn.added {
            background: linear-gradient(135deg, #6b7280, #4b5563);
        }
          .cart-btn.added:hover {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }
          
          /* Info Box (used in Page 2) */
          .info-box {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 2px solid #fbbf24;
          border-radius: 12px;
            padding: 16px;
        }
          .info-icon {
            font-size: 24px;
            flex-shrink: 0;
          }
          
          /* Navigation */
          .nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: #fff;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-size: 28px;
            color: #10b981;
            cursor: pointer;
            z-index: 20;
            transition: all 0.2s;
          display: flex;
          align-items: center;
            justify-content: center;
        }
          .nav-btn:hover {
          background: #10b981;
          color: #fff;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
        }
          .nav-btn-left {
            left: 20px;
        }
          .nav-btn-right {
            right: 20px;
          }
          
          /* Page Indicators */
          .page-indicators {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          display: flex;
          gap: 12px;
            z-index: 20;
        }
          .indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #10b981;
            background: transparent;
            cursor: pointer;
          transition: all 0.2s;
            padding: 0;
        }
          .indicator.active {
            background: #10b981;
            width: 32px;
            border-radius: 6px;
        }
          
          @media (max-width: 1400px) {
            .page-content-two-columns {
              grid-template-columns: 1fr auto 1fr;
              gap: 15px;
              padding: 20px;
        }
            .column-title {
              font-size: 24px;
        }
            .package-card-vertical .package-name {
              font-size: 18px;
        }
            .package-card-vertical .package-features li {
              font-size: 14px;
        }
            .test-card-vertical .test-title {
              font-size: 16px;
            }
            .test-card-vertical .test-desc {
              font-size: 13px;
        }
          }
          @media (max-width: 1024px) {
            .page-content-two-columns {
              grid-template-columns: 1fr;
              gap: 20px;
        }
            .center-arrow {
              display: none;
            }
            .page-content {
              padding: 24px;
            }
        }
      `}</style>
      </div>
    </div>
  );
};

export default AnalysisSummary;
