import React, { useEffect, useMemo, useState } from 'react';
import AssessmentWizard from './AssessmentWizard';
import AnalysisSummary from './AnalysisSummary';

type DashboardConfig = {
  user_name: string;
  welcome_subtitle: string;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_duration: string;
  video_title: string;
  tip_title: string;
  tip_text: string;
  background_color: string;
  card_background: string;
  text_color: string;
  button_color: string;
  accent_color: string;
};

const defaultConfig: DashboardConfig = {
  user_name: 'Ahmet',
  welcome_subtitle: 'Bugün, ağrısız bir yaşam için harika bir başlangıç.',
  cta_title: 'Henüz Vücut Analizinizi Yapmadık',
  cta_description:
    'Size en uygun tedavi paketini belirleyebilmemiz ve ağrı haritanızı çıkarabilmemiz için 3 dakikalık ücretsiz ön değerlendirmeyi tamamlayın.',
  cta_button_text: 'Analizi Başlat',
  cta_duration: 'Yaklaşık 3 dakika sürer',
  video_title: 'Süreci İzleyin',
  tip_title: 'Biliyor muydunuz?',
  tip_text: "Kronik ağrıların %80'i doğru duruş ve egzersizle ameliyatsız iyileşebilir.",
  background_color: '#667eea',
  card_background: '#ffffff',
  text_color: '#1f2937',
  button_color: '#f59e0b',
  accent_color: '#764ba2',
};

const Dashboard: React.FC = () => {
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Hook up to an optional external SDK if it exists (keeps provided markup behavior).
  useEffect(() => {
    const sdk = (window as unknown as { elementSdk?: any }).elementSdk;
    if (!sdk) return;

    sdk.init({
      defaultConfig,
      onConfigChange: (incoming: Partial<DashboardConfig>) => {
        setConfig((prev) => ({ ...prev, ...incoming }));
      },
      mapToCapabilities: (incoming: Partial<DashboardConfig>) => ({
        recolorables: [
          {
            get: () => incoming.background_color || defaultConfig.background_color,
            set: (value: string) => setConfig((prev) => ({ ...prev, background_color: value })),
          },
          {
            get: () => incoming.card_background || defaultConfig.card_background,
            set: (value: string) => setConfig((prev) => ({ ...prev, card_background: value })),
          },
          {
            get: () => incoming.text_color || defaultConfig.text_color,
            set: (value: string) => setConfig((prev) => ({ ...prev, text_color: value })),
          },
          {
            get: () => incoming.button_color || defaultConfig.button_color,
            set: (value: string) => setConfig((prev) => ({ ...prev, button_color: value })),
          },
          {
            get: () => incoming.accent_color || defaultConfig.accent_color,
            set: (value: string) => setConfig((prev) => ({ ...prev, accent_color: value })),
          },
        ],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined,
      }),
      mapToEditPanelValues: (incoming: Partial<DashboardConfig>) =>
        new Map<string, string>([
          ['user_name', incoming.user_name || defaultConfig.user_name],
          ['welcome_subtitle', incoming.welcome_subtitle || defaultConfig.welcome_subtitle],
          ['cta_title', incoming.cta_title || defaultConfig.cta_title],
          ['cta_description', incoming.cta_description || defaultConfig.cta_description],
          ['cta_button_text', incoming.cta_button_text || defaultConfig.cta_button_text],
          ['cta_duration', incoming.cta_duration || defaultConfig.cta_duration],
          ['video_title', incoming.video_title || defaultConfig.video_title],
          ['tip_title', incoming.tip_title || defaultConfig.tip_title],
          ['tip_text', incoming.tip_text || defaultConfig.tip_text],
        ]),
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const gradientBackground = useMemo(
    () => `linear-gradient(135deg, ${config.background_color} 0%, ${config.accent_color} 100%)`,
    [config.background_color, config.accent_color]
  );

  const buttonGradient = useMemo(
    () => `linear-gradient(135deg, ${config.button_color} 0%, #f97316 100%)`,
    [config.button_color]
  );

  const handleAnalysisStart = () => {
    setAnalysisLoading(true);
    setTimeout(() => {
      setAnalysisLoading(false);
      setShowWizard(true);
    }, 600);
  };

  const handleLockedClick = (isPremium: boolean) => {
    setToast(
      isPremium
        ? 'Premium özellik: Fizyoterapistinizle mesajlaşmak için premium paket gerekir.'
        : 'Bu özelliği kullanmak için önce paket satın almalısınız.'
    );
  };

  return (
    <div className="dashboard-wrapper" style={{ minHeight: '100vh', background: gradientBackground }}>
      <style>{`
        body, html, #root {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        .dashboard-wrapper {
          display: flex;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .sidebar {
          width: 260px;
          background: white;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        .menu-items {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }
        .menu-section-title {
          padding: 20px 24px 8px 24px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #9ca3af;
          text-transform: uppercase;
        }
        .menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 12px 16px;
        }
        .menu-item {
          display: flex;
          align-items: center;
          padding: 14px 24px;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
          gap: 12px;
        }
        .menu-item:hover {
          background: #f3f4f6;
          color: #667eea;
        }
        .menu-item.active {
          background: #eef2ff;
          color: #667eea;
          border-right: 3px solid #667eea;
        }
        .menu-item.locked {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .menu-item.premium-feature {
          position: relative;
        }
        .menu-item.premium-feature::after {
          content: 'PREMIUM';
          position: absolute;
          right: 50px;
          font-size: 9px;
          font-weight: 700;
          color: #f59e0b;
          background: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .main-content {
          flex: 1;
          overflow-y: auto;
          height: 100%;
        }
        .top-bar {
          background: white;
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .welcome-text h1 {
          font-size: 28px;
          font-weight: 600;
          color: ${config.text_color};
          margin: 0 0 4px 0;
        }
        .welcome-text p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .notification-bell {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 18px;
        }
        .notification-bell:hover {
          background: #e5e7eb;
        }
        .profile-pic {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
        }
        .content-area {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .main-cta-card {
          background: ${config.card_background};
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 32px;
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .cta-illustration {
          width: 180px;
          height: 180px;
          flex-shrink: 0;
        }
        .cta-content h2 {
          font-size: 26px;
          font-weight: 600;
          color: ${config.text_color};
          margin: 0 0 12px 0;
        }
        .cta-content p {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }
        .cta-button {
          background: ${buttonGradient};
          color: white;
          border: none;
          padding: 16px 32px;
          font-size: 17px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        .duration-hint {
          display: inline-block;
          margin-left: 12px;
          font-size: 14px;
          color: #9ca3af;
          font-weight: normal;
        }
        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .info-card {
          background: ${config.card_background};
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s;
          cursor: pointer;
        }
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
        .info-card-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 16px;
          color: white;
        }
        .video-card .info-card-icon {
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
        }
        .tip-card .info-card-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -260px;
            z-index: 100;
            transition: left 0.3s;
          }
          .sidebar.open { left: 0; }
          .main-cta-card {
            flex-direction: column;
            text-align: center;
          }
          .cta-illustration {
            width: 140px;
            height: 140px;
          }
        }
      `}</style>
      <div className="sidebar">
        <div className="sidebar-header">
          <img
            src="/logo.png"
            alt="EgzersizLab Logo"
            style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }}
          />
        </div>
        <div className="menu-items">
          <div className="menu-section-title">PANEL</div>
          <div className="menu-item active">
            <span role="img" aria-label="home">
              🏠
            </span>
            <span>Ana Sayfa</span>
          </div>
          <div className="menu-item locked" onClick={() => handleLockedClick(false)}>
            <span role="img" aria-label="exercise">
              🧘
            </span>
            <span>Egzersiz Programım</span>
            <span>🔒</span>
          </div>
          <div className="menu-item locked" onClick={() => handleLockedClick(false)}>
            <span role="img" aria-label="calendar">
              📅
            </span>
            <span>Takvim / İlerleme</span>
            <span>🔒</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-section-title">DESTEK &amp; İLETİŞİM</div>
          <div className="menu-item locked premium-feature" onClick={() => handleLockedClick(true)}>
            <span role="img" aria-label="chat">
              💬
            </span>
            <span>Fizyoterapiste Sor</span>
            <span>🔒</span>
          </div>
          <div className="menu-item">
            <span role="img" aria-label="ticket">
              🎫
            </span>
            <span>Destek Talebi</span>
          </div>
          <div className="menu-item">
            <span role="img" aria-label="help">
              ❓
            </span>
            <span>Yardım / SSS</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-section-title">HESAP &amp; AYARLAR</div>
          <div className="menu-item">
            <span role="img" aria-label="package">
              📦
            </span>
            <span>Paketlerim &amp; Ödemeler</span>
          </div>
          <div className="menu-item">
            <span role="img" aria-label="settings">
              ⚙️
            </span>
            <span>Ayarlar</span>
          </div>
          <div className="menu-item">
            <span role="img" aria-label="logout">
              🚪
            </span>
            <span>Çıkış Yap</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="welcome-text">
            <h1 id="welcome-title">Merhaba, {config.user_name} 👋</h1>
            <p id="welcome-subtitle">{config.welcome_subtitle}</p>
          </div>
          <div className="top-bar-right">
            <div className="notification-bell" title="Bildirimler">
              🔔
            </div>
            <div className="profile-pic" title="Profil">
              {config.user_name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="main-cta-card">
            <div className="cta-illustration">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="60" r="30" fill="#667eea" opacity="0.2" />
                <circle cx="100" cy="60" r="20" fill="#667eea" />
                <rect x="75" y="90" width="50" height="70" rx="5" fill="#667eea" />
                <rect x="70" y="100" width="15" height="40" rx="7" fill="#f59e0b" />
                <rect x="115" y="100" width="15" height="40" rx="7" fill="#f59e0b" />
                <rect x="85" y="155" width="12" height="35" rx="6" fill="#667eea" />
                <rect x="103" y="155" width="12" height="35" rx="6" fill="#667eea" />
                <rect x="130" y="80" width="50" height="70" rx="4" fill="white" stroke="#667eea" strokeWidth="2" />
                <line x1="140" y1="100" x2="170" y2="100" stroke="#667eea" strokeWidth="2" />
                <line x1="140" y1="115" x2="170" y2="115" stroke="#667eea" strokeWidth="2" />
                <line x1="140" y1="130" x2="165" y2="130" stroke="#667eea" strokeWidth="2" />
              </svg>
            </div>
            <div className="cta-content">
              <h2 id="cta-title">{config.cta_title}</h2>
              <p id="cta-description">{config.cta_description}</p>
              <button className="cta-button" onClick={handleAnalysisStart} disabled={analysisLoading}>
                <span>▶</span>
                <span id="cta-button-text">
                  {analysisLoading ? 'Yönlendiriliyorsunuz...' : config.cta_button_text}
                </span>
              </button>
              <span className="duration-hint" id="cta-duration">
                {config.cta_duration}
              </span>
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card video-card">
              <div className="info-card-icon">🎬</div>
              <h3 id="video-title">{config.video_title}</h3>
              <p>1 dakikalık "Sistem Nasıl İşliyor?" videosunu izleyerek süreci daha iyi anlayabilirsiniz.</p>
            </div>
            <div className="info-card tip-card">
              <div className="info-card-icon">💡</div>
              <h3 id="tip-title">{config.tip_title}</h3>
              <p id="tip-text">{config.tip_text}</p>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: '#fef3c7',
            color: '#92400e',
            padding: '16px 20px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: 14,
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          {toast}
        </div>
      )}
      <AssessmentWizard
        open={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={() => {
          setShowSummary(true);
        }}
      />
      <AnalysisSummary open={showSummary} onClose={() => setShowSummary(false)} />
    </div>
  );
};

export default Dashboard;
