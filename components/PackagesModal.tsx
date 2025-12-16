import React, { useState } from 'react';

interface PackagesModalProps {
  open: boolean;
  onClose: () => void;
  onPurchase?: () => void;
  onCancelPackage?: () => void;
  hasPackage?: boolean;
  onAddToCart?: (item: { id: string; name: string; price?: string }) => void;
  cartItems?: { id: string }[];
}

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
}

interface Payment {
  id: string;
  date: Date;
  amount: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
}

const packages: Package[] = [
  {
    id: 'basic',
    name: 'Temel Analiz & Egzersiz Planı',
    price: 599,
    duration: 'Tek Seferlik',
    description: 'Vücudunuzun neye ihtiyacı olduğunu öğrenin ve hemen başlayın.',
    features: [
      'Detaylı anamnez değerlendirmesi',
      'Fizyoterapist tarafından vaka analizi',
      '4-6 haftalık kişiye özel egzersiz programı',
      'Egzersiz videoları ve açıklamaları',
    ],
    notIncluded: ['Takip ve revizyon hizmeti içermez'],
  },
  {
    id: 'pro',
    name: 'Klinik Takip & İlerleme Paketi',
    price: 1299,
    duration: '1 Aylık',
    description: 'Sadece bir liste değil, dinamik bir iyileşme süreci.',
    features: [
      'Temel paketteki tüm hizmetler',
      'Haftalık kontrol ve değerlendirme',
      'Ağrı ve gelişime göre program revizyonu',
      'Sistem üzerinden soru-cevap hakkı',
      '1 aylık aktif takip',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Danışmanlık & Video Analizi',
    price: 2499,
    duration: 'Aylık',
    description: 'Fizyoterapistiniz cebinizde - yanlış yapma riskini sıfıra indirin.',
    features: [
      'Tüm paketlerdeki hizmetler',
      'Video analizi: Egzersizlerinizi kaydedin, geri bildirim alın',
      'Hızlı destek (chat/WhatsApp)',
      'Öncelikli değerlendirme (aynı gün dönüş)',
      'Sınırsız program güncellemesi',
    ],
  },
];

const paymentHistory: Payment[] = [
  { id: '1', date: new Date('2024-12-01'), amount: 699, description: 'Profesyonel Paket - 3 Ay', status: 'success' },
  { id: '2', date: new Date('2024-09-01'), amount: 299, description: 'Başlangıç Paket - 1 Ay', status: 'success' },
];

const PackagesModal: React.FC<PackagesModalProps> = ({ open, onClose, onPurchase, onCancelPackage, hasPackage, onAddToCart, cartItems = [] }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'packages' | 'history'>(hasPackage ? 'current' : 'packages');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const isInCart = (id: string) => cartItems.some(item => item.id === id);

  const handleAddToCart = (pkg: Package) => {
    if (!isInCart(pkg.id) && onAddToCart) {
      onAddToCart({ id: pkg.id, name: pkg.name, price: pkg.price.toLocaleString() });
    }
  };

  if (!open) return null;

  const currentPackage = packages[1]; // Pro package as current
  const daysLeft = 45;

  return (
    <div className="pkg-overlay">
      <style>{`
        .pkg-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .pkg-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }
        
        .pkg-header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 20px 24px;
          color: white;
          position: relative;
          border-radius: 20px 20px 0 0;
        }
        .pkg-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .close-btn:hover { background: rgba(255, 255, 255, 0.3); transform: rotate(90deg); }
        
        .tab-bar {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .tab-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .tab-btn:hover { color: #f59e0b; }
        .tab-btn.active { color: #f59e0b; background: white; }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #f59e0b;
        }
        
        .pkg-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        
        /* Current Package */
        .current-pkg {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #f59e0b;
        }
        .current-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f59e0b;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .current-name {
          font-size: 24px;
          font-weight: 700;
          color: #92400e;
          margin: 0 0 8px 0;
        }
        .current-info {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #92400e;
        }
        .days-bar {
          background: rgba(255,255,255,0.6);
          border-radius: 8px;
          height: 8px;
          overflow: hidden;
        }
        .days-fill {
          height: 100%;
          background: #f59e0b;
          border-radius: 8px;
          transition: width 0.3s;
        }
        .days-text {
          font-size: 12px;
          color: #92400e;
          margin-top: 6px;
        }
        
        /* Package Cards */
        .packages-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pkg-card {
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
        }
        .pkg-card:hover { border-color: #f59e0b; background: #fffbeb; }
        .pkg-card.popular { border-color: #f59e0b; }
        .popular-tag {
          position: absolute;
          top: -10px;
          right: 16px;
          background: #f59e0b;
          color: white;
          padding: 3px 10px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
        }
        .pkg-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .pkg-card:nth-child(1) .pkg-icon { background: #dbeafe; }
        .pkg-card:nth-child(2) .pkg-icon { background: #fef3c7; }
        .pkg-card:nth-child(3) .pkg-icon { background: #f3e8ff; }
        .pkg-info { flex: 1; }
        .pkg-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }
        .pkg-features {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }
        .pkg-price {
          text-align: right;
        }
        .price-amount {
          font-size: 22px;
          font-weight: 700;
          color: #f59e0b;
        }
        .price-duration {
          font-size: 11px;
          color: #94a3b8;
        }
        
        /* Payment History */
        .payment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 10px;
        }
        .payment-item:hover { background: #f8fafc; }
        .payment-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .payment-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #d1fae5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .payment-info h4 {
          margin: 0 0 2px 0;
          font-size: 14px;
          color: #1e293b;
        }
        .payment-info p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }
        .payment-right {
          text-align: right;
        }
        .payment-amount {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
        }
        .payment-status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
        }
        .payment-status.success { background: #d1fae5; color: #047857; }
        .payment-status.pending { background: #fef3c7; color: #b45309; }
        .payment-status.failed { background: #fee2e2; color: #dc2626; }
        
        .empty-history {
          text-align: center;
          padding: 32px;
          color: #94a3b8;
        }
        .empty-history span { font-size: 40px; display: block; margin-bottom: 8px; }
        
        .buy-btn {
          margin-top: 12px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .buy-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }
        .buy-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }
        .pkg-card {
          flex-direction: column;
          align-items: stretch;
        }
        
        .cancel-btn {
          margin-top: 20px;
          padding: 12px 16px;
          border: 2px solid #fca5a5;
          border-radius: 10px;
          background: #fef2f2;
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .cancel-btn:hover {
          background: #fee2e2;
          border-color: #f87171;
        }
        
        /* New Package Cards */
        .packages-new-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        
        .package-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s;
          position: relative;
        }
        .package-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }
        .package-card.recommended {
          border-color: #10b981;
          border-width: 2px;
        }
        
        .recommended-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .package-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        
        .package-desc {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        
        .package-features {
          flex: 1;
        }
        
        .features-label {
          font-size: 10px;
          font-weight: 700;
          color: #10b981;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .feature-item.included {
          color: #334155;
        }
        .feature-item.not-included {
          color: #ef4444;
        }
        
        .feature-icon {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }
        .feature-item.included .feature-icon {
          background: #d1fae5;
          color: #10b981;
        }
        .feature-item.not-included .feature-icon {
          background: #fee2e2;
          color: #ef4444;
        }
        
        .package-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .package-price {
          display: flex;
          flex-direction: column;
        }
        .price-value {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .price-period {
          font-size: 11px;
          color: #94a3b8;
        }
        
        .select-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background: #10b981;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .select-btn:hover:not(:disabled):not(.added) {
          background: #059669;
        }
        .select-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }
        .select-btn.added {
          background: #6b7280;
          cursor: default;
        }
        
        @media (max-width: 768px) {
          .packages-new-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="pkg-modal">
        <div className="pkg-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>📦 Paketlerim & Ödemeler</h2>
        </div>

        <div className="tab-bar">
          <button className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`} onClick={() => setActiveTab('current')}>
            ✨ Aktif Paket
          </button>
          <button className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
            🎁 Paketler
          </button>
          <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            📋 Geçmiş
          </button>
        </div>

        <div className="pkg-content">
          {activeTab === 'current' && (
            hasPackage ? (
              <div className="current-pkg">
                <div className="current-badge">⭐ AKTİF PAKET</div>
                <h3 className="current-name">{currentPackage.name} Paket</h3>
                <div className="current-info">
                  <div className="info-item">💰 {currentPackage.price}₺</div>
                  <div className="info-item">📅 {currentPackage.duration}</div>
                  <div className="info-item">🔥 {daysLeft} gün kaldı</div>
                </div>
                <div className="days-bar">
                  <div className="days-fill" style={{ width: `${(daysLeft / 90) * 100}%` }} />
                </div>
                <div className="days-text">Bitiş: 15 Şubat 2025</div>
                
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed #d97706' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 10 }}>Paket Özellikleri:</div>
                  {currentPackage.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#92400e', marginBottom: 6 }}>
                      <span>✓</span> {f}
                    </div>
                  ))}
                </div>

                <button 
                  className="cancel-btn"
                  onClick={() => {
                    if (onCancelPackage) {
                      onCancelPackage();
                      onClose();
                    }
                  }}
                >
                  🗑️ Paketi İptal Et (Demo)
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#64748b' }}>Aktif paketiniz yok</h3>
                <p style={{ color: '#94a3b8', marginBottom: 20 }}>Paketler sekmesinden bir paket satın alabilirsiniz.</p>
                <button 
                  style={{ padding: '12px 24px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setActiveTab('packages')}
                >
                  🎁 Paketlere Git
                </button>
              </div>
            )
          )}

          {activeTab === 'packages' && (
            <div className="packages-new-grid">
              {purchaseSuccess ? (
                <div style={{ textAlign: 'center', padding: 40, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#10b981' }}>Satın Alma Başarılı!</h3>
                  <p style={{ color: '#64748b', marginBottom: 20 }}>Egzersiz programınız hazırlanıyor...</p>
                </div>
              ) : (
                packages.map((pkg) => (
                  <div key={pkg.id} className={`package-card ${pkg.popular ? 'recommended' : ''}`}>
                    {pkg.popular && <div className="recommended-badge">Fizyoterapist önerisi</div>}
                    <h3 className="package-title">{pkg.name}</h3>
                    <p className="package-desc">{pkg.description}</p>
                    
                    <div className="package-features">
                      <div className="features-label">PAKET İÇERİĞİ</div>
                      {pkg.features.map((f, i) => (
                        <div key={i} className="feature-item included">
                          <span className="feature-icon">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                      {pkg.notIncluded?.map((f, i) => (
                        <div key={i} className="feature-item not-included">
                          <span className="feature-icon">✕</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="package-footer">
                      <div className="package-price">
                        <span className="price-value">{pkg.price}₺</span>
                        <span className="price-period">{pkg.duration}</span>
                      </div>
                      {isInCart(pkg.id) ? (
                        <button className="select-btn added">
                          ✓ Sepette
                        </button>
                      ) : (
                        <button 
                          className="select-btn"
                          onClick={() => handleAddToCart(pkg)}
                        >
                          🛒 Sepete Ekle
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {paymentHistory.length === 0 ? (
                <div className="empty-history">
                  <span>📭</span>
                  <p>Henüz ödeme geçmişiniz yok</p>
                </div>
              ) : (
                paymentHistory.map((payment) => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-left">
                      <div className="payment-icon">✓</div>
                      <div className="payment-info">
                        <h4>{payment.description}</h4>
                        <p>{payment.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="payment-right">
                      <div className="payment-amount">{payment.amount}₺</div>
                      <span className={`payment-status ${payment.status}`}>
                        {payment.status === 'success' ? 'Başarılı' : payment.status === 'pending' ? 'Bekliyor' : 'Başarısız'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagesModal;

