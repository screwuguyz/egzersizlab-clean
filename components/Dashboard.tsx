import React, { useEffect, useMemo, useRef, useState } from 'react';
import AssessmentWizard from './AssessmentWizard';
import AnalysisSummary from './AnalysisSummary';
import { CartItem } from '@/types';

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
  const [hasPackage, setHasPackage] = useState(true); // TODO: gerçeğe göre ayarla
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const cartDropdownRef = useRef<HTMLDivElement | null>(null);
  const notifButtonRef = useRef<HTMLButtonElement | null>(null);
  const notifDropdownRef = useRef<HTMLDivElement | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; type: 'clinical' | 'admin' | 'motivation'; read: boolean }[]
  >([
    {
      id: 'n1',
      title: 'Fizyoterapistiniz programınızı güncelledi.',
      message: 'Yeni hareket planınız hazır, detayları görmek için tıklayın.',
      type: 'clinical',
      read: false,
    },
    {
      id: 'n2',
      title: 'Ödemeniz başarıyla alındı.',
      message: 'Klinik Takip Paketi hesabınıza tanımlandı, faturanızı görüntüleyebilirsiniz.',
      type: 'admin',
      read: false,
    },
    {
      id: 'n3',
      title: 'Egzersiz Vakti! 🏃‍♂️',
      message: 'Bugünkü programını henüz yapmadın. 15 dakikanı ayırmayı unutma.',
      type: 'motivation',
      read: true,
    },
  ]);
  const parsePriceToNumber = (price: string) => {
    const normalized = price.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.');
    const value = parseFloat(normalized);
    return Number.isNaN(value) ? 0 : value;
  };
  const formatPrice = (value: number) => `₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`;

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

  const handleLogout = () => {
    window.location.href = '/';
  };

  const openFaq = () => setShowFaq(true);
  const closeFaq = () => setShowFaq(false);
  const openSupport = () => setShowSupport(true);
  const closeSupport = () => setShowSupport(false);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target) || profileRef.current?.contains(target)) return;
      setShowProfile(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (cartButtonRef.current?.contains(target) || cartDropdownRef.current?.contains(target)) return;
      setIsCartOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifButtonRef.current?.contains(target) || notifDropdownRef.current?.contains(target)) return;
      setIsNotifOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const scrolled = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
    setShowCheckout(false);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + parsePriceToNumber(item.price), 0);
  const vat = totalPrice * 0.18;
  const grandTotal = totalPrice + vat;

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="dashboard-wrapper" style={{ minHeight: '100vh', background: gradientBackground }}>
      <style>{`
        body { margin: 0; padding: 0; box-sizing: border-box; overflow-x: hidden; }
        * { box-sizing: inherit; }
        .dashboard-wrapper { display: flex; height: 100%; width: 100%; position: relative; }
        .sidebar { width: 230px; background: #fff; box-shadow: 2px 0 10px rgba(0,0,0,0.1); display: flex; flex-direction: column; height: 100vh; position: sticky; top: 0; }
        .sidebar-header { padding: 14px 16px; border-bottom: 1px solid #e5e7eb; }
        .logo { display: flex; align-items: center; justify-content: center; }
        .logo-progress { width: 100%; height: 4px; background: linear-gradient(90deg, #ffffff 0%, #c7d2fe 50%, #667eea 100%); border-radius: 999px; margin-top: 14px; overflow: hidden; }
        .logo-progress-inner { height: 100%; background: linear-gradient(90deg, #667eea, #22c55e); transition: width 0.15s ease-out; }
        .menu-items { flex: 1; padding: 10px 0; overflow-y: visible; }
        .menu-section-title { padding: 12px 16px 6px 16px; font-size: 13px; font-weight: 800; letter-spacing: 1px; color: #6b7280; text-transform: uppercase; }
        .menu-divider { height: 1px; background: #e5e7eb; margin: 8px 14px; }
        .menu-item { display: flex; align-items: center; padding: 10px 16px; color: #111827; cursor: pointer; transition: all 0.2s; font-size: 16px; gap: 12px; }
        .menu-item:hover { background: #f3f4f6; color: #667eea; }
        .menu-item.active { background: #eef2ff; color: #667eea; border-right: 3px solid #667eea; }
        .menu-item.locked { opacity: 0.55; cursor: not-allowed; }
        .menu-item.premium-feature { position: relative; }
        .menu-item.premium-feature::after { content: 'PREMIUM'; position: absolute; right: 50px; font-size: 9px; font-weight: 700; color: #f59e0b; background: #fef3c7; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; }
        .main-content { flex: 1; min-height: 100vh; overflow-y: auto; }
        .top-bar { background: #fff; padding: 16px 24px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: relative; gap: 12px; }
        .welcome-text h1 { font-size: 28px; font-weight: 700; color: ${config.text_color}; margin: 0 0 6px 0; }
        .welcome-text p { font-size: 16px; color: #4a4a4a; margin: 0; font-weight: 500; }
        .top-bar-right { display: flex; align-items: center; gap: 20px; position: relative; }
        .cart-wrapper { position: relative; }
        .cart-button { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 18px; border: none; }
        .cart-button:hover { background: #e5e7eb; }
        .cart-badge { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; background: #ef4444; color: #fff; border-radius: 999px; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 5px; }
        .cart-dropdown { position: absolute; right: 0; top: 48px; width: 360px; background: #fff; border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,0.12); border: 1px solid #e5e7eb; padding: 14px; z-index: 20; }
        .cart-item { display: grid; grid-template-columns: 1fr auto auto; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .cart-item:last-child { border-bottom: none; }
        .cart-item-title { font-weight: 600; color: #111827; font-size: 13px; line-height: 1.3; }
        .cart-item-tag { font-size: 11px; color: #6b7280; }
        .cart-checkout { margin-top: 12px; width: 100%; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; border: none; padding: 10px 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .cart-checkout:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(79,70,229,0.3); }
        .checkout-panel { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; }
        .checkout-title { font-weight: 700; color: #111827; font-size: 15px; text-align: center; }
        .checkout-badge { display: inline-flex; margin: 6px auto 10px auto; padding: 6px 10px; border-radius: 999px; background: #fef3c7; color: #b45309; font-weight: 700; font-size: 11px; }
        .checkout-field { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
        .checkout-field label { font-size: 12px; color: #4b5563; font-weight: 600; }
        .checkout-input { padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #111827; }
        .checkout-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .installments { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .inst-btn { flex: 1 1 30%; min-width: 90px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; cursor: pointer; font-size: 12px; font-weight: 700; color: #111827; text-align: center; }
        .inst-btn.active { border-color: #4f46e5; background: #eef2ff; color: #3730a3; }
        .summary-box { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px; margin-top: 10px; font-size: 13px; color: #111827; }
        .summary-line { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .summary-total { font-weight: 800; font-size: 14px; }
        .checkout-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .checkout-pay { width: 100%; background: #22c55e; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: 800; cursor: pointer; }
        .checkout-back { width: 100%; background: #e5e7eb; color: #111827; border: none; padding: 10px; border-radius: 10px; font-weight: 700; cursor: pointer; }
        .notif-wrapper { position: relative; }
        .notif-button { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 18px; border: none; position: relative; }
        .notif-button:hover { background: #e5e7eb; }
        .notif-badge { position: absolute; top: 6px; right: 6px; width: 9px; height: 9px; background: #ef4444; border-radius: 50%; border: 2px solid #fff; }
        .notif-dropdown { position: absolute; right: 0; top: 48px; width: 340px; background: #fff; border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,0.12); border: 1px solid #e5e7eb; padding: 14px; z-index: 20; }
        .notif-item { padding: 10px; border-radius: 12px; border: 1px solid #f3f4f6; background: #f8fafc; display: grid; grid-template-columns: 1fr auto; gap: 8px; cursor: pointer; transition: all 0.15s ease; }
        .notif-item + .notif-item { margin-top: 8px; }
        .notif-item.read { background: #fff; }
        .notif-item:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
        .notif-title { font-weight: 700; color: #111827; font-size: 13px; line-height: 1.3; }
        .notif-msg { font-size: 12px; color: #4b5563; }
        .notif-chip { font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
        .notif-clinical { background: #dbeafe; color: #1d4ed8; }
        .notif-admin { background: #fee2e2; color: #b91c1c; }
        .notif-motivation { background: #dcfce7; color: #15803d; }
        .notification-bell { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 18px; }
        .notification-bell:hover { background: #e5e7eb; }
        .profile-pic { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 16px; cursor: pointer; position: relative; }
        .content-area { padding: 24px; max-width: 1100px; margin: 0 auto; }
        .main-cta-card { background: ${config.card_background}; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 32px; display: flex; gap: 32px; align-items: center; }
        .cta-illustration { width: 180px; height: 180px; flex-shrink: 0; }
        .cta-content h2 { font-size: 26px; font-weight: 600; color: ${config.text_color}; margin: 0 0 12px 0; }
        .cta-content p { font-size: 16px; color: #6b7280; line-height: 1.6; margin: 0 0 24px 0; }
        .cta-button { background: ${buttonGradient}; color: #fff; border: none; padding: 16px 32px; font-size: 17px; font-weight: 600; border-radius: 12px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); display: inline-flex; align-items: center; gap: 8px; }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); }
        .duration-hint { display: inline-block; margin-left: 12px; font-size: 14px; color: #9ca3af; font-weight: normal; }
        .info-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .info-card { background: ${config.card_background}; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.3s; cursor: pointer; }
        .info-card:hover { transform: translateY(-4px); box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
        .info-card-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px; }
        .video-card .info-card-icon { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); }
        .tip-card .info-card-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .info-card h3 { font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0; }
        .info-card p { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0; }
        .profile-dropdown { position: absolute; top: 70px; right: 0; width: 320px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.25s ease; z-index: 1000; border: 1px solid #e5e7eb; max-height: 80vh; overflow-y: auto; }
        .profile-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .profile-card-header { padding: 20px; border-bottom: 1px solid #e5e7eb; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; color: #fff; }
        .profile-avatar-large { width: 70px; height: 70px; border-radius: 50%; background: #fff; color: #667eea; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700; margin: 0 auto 10px auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .profile-name { font-size: 18px; font-weight: 700; margin: 0 0 4px 0; }
        .premium-badge-inline { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); color: #fff; padding: 8px 14px; border-radius: 18px; font-size: 13px; font-weight: 800; border: 2px solid #fb923c; min-width: 140px; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35); }
        .premium-badge-blur { filter: blur(1px); opacity: 0.6; position: relative; }
        .premium-badge-blur::after { content: '🔒'; position: absolute; right: -18px; top: 50%; transform: translateY(-50%); font-size: 16px; }
        .profile-menu-section { padding: 14px 0; }
        .profile-menu-section:not(:last-child) { border-bottom: 1px solid #f3f4f6; }
        .profile-section-title { padding: 8px 16px; font-size: 11px; font-weight: 700; color: #9ca3af; letter-spacing: 1px; text-transform: uppercase; }
        .profile-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #374151; cursor: pointer; transition: all 0.2s; font-size: 14px; }
        .profile-menu-item:hover { background: #f9fafb; color: #4f46e5; }
        .profile-menu-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .profile-menu-icon { font-size: 18px; width: 22px; text-align: center; }
        .profile-menu-text { flex: 1; }
        .profile-menu-text .subtitle { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .faq-modal { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .faq-content { background: #f8fafc; width: min(1200px, 96vw); height: min(90vh, 800px); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); display: flex; flex-direction: column; }
        .faq-header { padding: 14px 18px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; display: flex; align-items: center; justify-content: space-between; }
        .faq-title { font-weight: 800; font-size: 18px; }
        .faq-close { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); border-radius: 999px; padding: 6px 12px; cursor: pointer; font-weight: 700; }
        .faq-body { flex: 1; overflow: hidden; }
        .faq-iframe { width: 100%; height: 100%; border: none; }
        .support-modal { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .support-content { background: #f8fafc; width: min(1180px, 98vw); height: min(98vh, 1000px); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); display: flex; flex-direction: column; }
        .support-header { padding: 14px 18px; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #fff; display: flex; align-items: center; justify-content: space-between; }
        .support-title { font-weight: 800; font-size: 18px; }
        .support-close { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); border-radius: 999px; padding: 6px 12px; cursor: pointer; font-weight: 700; }
        .support-body { flex: 1; overflow: hidden; }
        .support-iframe { width: 100%; height: 100%; border: none; }
        @media (max-width: 768px) {
          .sidebar { position: fixed; left: -230px; z-index: 100; transition: left 0.3s; height: 100vh; }
          .sidebar.open { left: 0; }
          .main-cta-card { flex-direction: column; text-align: center; }
          .cta-illustration { width: 140px; height: 140px; }
          .profile-dropdown { right: 16px; width: calc(100% - 32px); }
        }
      `}</style>

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo" style={{ justifyContent: 'center' }}>
            <img
              src="/logo.png"
              alt="EgzersizLab Logo"
              style={{
                width: 150,
                height: 150,
                objectFit: 'contain',
                borderRadius: '50%',
                border: '3px solid #e0e7ff',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              }}
            />
          </div>
          <div className="logo-progress">
            <div className="logo-progress-inner" style={{ width: `${scrollProgress}%` }} />
          </div>
        </div>
        <div className="menu-items">
          <div className="menu-section-title">PANEL</div>
          <div className="menu-item active">
            <span role="img" aria-label="home">🏠</span>
            <span>Ana Sayfa</span>
          </div>
          <div className="menu-item locked" onClick={() => handleLockedClick(false)}>
            <span role="img" aria-label="exercise">🤸‍♀️</span>
            <span>Egzersiz Programım</span>
            <span>🔒</span>
          </div>
          <div className="menu-item locked" onClick={() => handleLockedClick(false)}>
            <span role="img" aria-label="calendar">🗓️</span>
            <span>Takvim / İlerleme</span>
            <span>🔒</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-section-title">DESTEK & İLETİŞİM</div>
          <div className="menu-item locked premium-feature" onClick={() => handleLockedClick(true)}>
            <span role="img" aria-label="chat">💬</span>
            <span>Fizyoterapiste Sor</span>
            <span>🔒</span>
          </div>
          <div className="menu-item" onClick={openSupport}>
            <span role="img" aria-label="ticket">🎟️</span>
            <span>Destek Talebi</span>
          </div>
          <div className="menu-item">
            <span role="img" aria-label="help">❓</span>
            <span onClick={openFaq} style={{ cursor: 'pointer' }}>Yardım / SSS</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-section-title">HESAP & AYARLAR</div>
          <div className="menu-item">
            <span role="img" aria-label="package">📦</span>
            <span>Paketlerim & Ödemeler</span>
          </div>
          <div className="menu-item">
            <span role="img" aria-label="settings">⚙️</span>
            <span>Ayarlar</span>
          </div>
          <div className="menu-item" onClick={handleLogout}>
            <span role="img" aria-label="logout">🚪</span>
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
            <div className="cart-wrapper">
              <button
                className="cart-button"
                ref={cartButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCartOpen((prev) => !prev);
                }}
                aria-label="Sepet"
              >
                🛒
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </button>
              {isCartOpen && (
                <div className="cart-dropdown" ref={cartDropdownRef}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>Sepetiniz</span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{cartItems.length} ürün</span>
                  </div>
                  {cartItems.length === 0 ? (
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Henüz paket eklemediniz.</div>
                  ) : (
                    <>
                      <div style={{ maxHeight: showCheckout ? 'none' : 220, overflowY: showCheckout ? 'visible' : 'auto' }}>
                        {!showCheckout &&
                          cartItems.map((item, idx) => (
                            <div className="cart-item" key={`${item.id}-${idx}`}>
                              <div>
                                <div className="cart-item-title">{item.title}</div>
                                <div className="cart-item-tag">Paket</div>
                              </div>
                              <div style={{ fontWeight: 700, color: '#4f46e5', whiteSpace: 'nowrap' }}>{item.price}</div>
                              <button
                                aria-label="Kaldır"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromCart(idx);
                                  setIsCartOpen(true);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14 }}
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                      </div>
                      {!showCheckout && (
                        <button
                          className="cart-checkout"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCheckout(true);
                          }}
                        >
                          Ödemeye Geç · {formatPrice(totalPrice)}
                        </button>
                      )}
                    </>
                  )}
                  {showCheckout && cartItems.length > 0 && (
                    <div className="checkout-panel" onClick={(e) => e.stopPropagation()}>
                      <div className="checkout-title">Ödeme Bilgileri</div>
                      <div className="checkout-badge">DEMO - Gerçek ödeme yapılmaz</div>

                      <div className="checkout-field">
                        <label>E-posta Adresi</label>
                        <input className="checkout-input" placeholder="ornek@email.com" />
                      </div>
                      <div className="checkout-field">
                        <label>Telefon</label>
                        <input className="checkout-input" placeholder="05XX XXX XX XX" />
                      </div>
                      <div className="checkout-field">
                        <label>Kart Üzerindeki İsim</label>
                        <input className="checkout-input" placeholder="AD SOYAD" />
                      </div>
                      <div className="checkout-field">
                        <label>Kart Numarası</label>
                        <input className="checkout-input" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="checkout-row">
                        <div className="checkout-field">
                          <label>SKT</label>
                          <input className="checkout-input" placeholder="AA/YY" />
                        </div>
                        <div className="checkout-field">
                          <label>CVV</label>
                          <input className="checkout-input" placeholder="XXX" />
                        </div>
                      </div>

                      <div className="checkout-field" style={{ marginTop: 10 }}>
                        <label>Taksit Seçenekleri</label>
                        <div className="installments">
                          {[1, 3, 6, 9, 12].map((i) => (
                            <button key={i} className={`inst-btn ${i === 1 ? 'active' : ''}`}>
                              {i} Taksit
                              <div style={{ fontWeight: 800 }}>
                                {formatPrice(grandTotal / i)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="summary-box">
                        <div className="summary-line">
                          <span>Ara Toplam</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="summary-line">
                          <span>KDV (18%)</span>
                          <span>{formatPrice(vat)}</span>
                        </div>
                        <div className="summary-line summary-total">
                          <span>Toplam</span>
                          <span>{formatPrice(grandTotal)}</span>
                        </div>
                      </div>

                      <div className="checkout-actions">
                        <button
                          className="checkout-pay"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Demo: Gerçek ödeme yapılmaz.');
                          }}
                        >
                          Siparişi Tamamla
                        </button>
                        <button
                          className="checkout-back"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCheckout(false);
                          }}
                        >
                          Sepete Dön
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="notif-wrapper">
              <button
                className="notif-button"
                ref={notifButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen((prev) => !prev);
                }}
                aria-label="Bildirimler"
              >
                🔔
                {unreadNotifications > 0 && <span className="notif-badge" />}
              </button>
              {isNotifOpen && (
                <div className="notif-dropdown" ref={notifDropdownRef}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>Bildirimler</span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      {unreadNotifications} okunmamış
                    </span>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Yeni bildiriminiz yok.</div>
                  ) : (
                    <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`notif-item ${notif.read ? 'read' : ''}`}
                          onClick={() => handleNotificationClick(notif.id)}
                        >
                          <div>
                            <div className="notif-title">{notif.title}</div>
                            <div className="notif-msg">{notif.message}</div>
                          </div>
                          <div>
                            <span
                              className={`notif-chip ${
                                notif.type === 'clinical'
                                  ? 'notif-clinical'
                                  : notif.type === 'admin'
                                  ? 'notif-admin'
                                  : 'notif-motivation'
                              }`}
                            >
                              {notif.type === 'clinical'
                                ? 'Klinik'
                                : notif.type === 'admin'
                                ? 'İdari'
                                : 'Motivasyon'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className="profile-pic"
              title="Profil"
              onClick={(e) => {
                e.stopPropagation();
                toggleProfile();
              }}
              ref={profileRef}
              aria-label="Profil menüsü"
            >
              {config.user_name?.charAt(0).toUpperCase()}
            </div>
            <div className={`profile-dropdown ${showProfile ? 'active' : ''}`} ref={dropdownRef}>
              <div className="profile-card-header">
                <div className="profile-avatar-large">{config.user_name?.charAt(0).toUpperCase()}</div>
                <div className="profile-name">{config.user_name}</div>
                <span className={`premium-badge-inline ${hasPackage ? '' : 'premium-badge-blur'}`}>
                  ⭐ {hasPackage ? 'Premium üye' : 'Premium kilitli'}
                </span>
              </div>
              <div className="profile-menu-section">
                <div className="profile-section-title">Kişisel Sağlık Verileri</div>
                <div className="profile-menu-item">
                  <span className="profile-menu-icon">🖼️</span>
                  <div className="profile-menu-text">
                    <div>Vücut Fotoğraflarım</div>
                    <div className="subtitle">Postür fotoğraflarını görüntüle</div>
                  </div>
                </div>
                <div className="profile-menu-item">
                  <span className="profile-menu-icon">📋</span>
                  <div className="profile-menu-text">
                    <div>Anamnez Bilgilerim</div>
                    <div className="subtitle">Ağrı haritası ve sağlık geçmişi</div>
                  </div>
                </div>
                <div className="profile-menu-item">
                  <span className="profile-menu-icon">📏</span>
                  <div className="profile-menu-text">
                    <div>Fiziksel Ölçümlerim</div>
                    <div className="subtitle">Boy, kilo, BMI ve ölçüler</div>
                  </div>
                </div>
              </div>
              <div className="profile-menu-section">
                <div className="profile-section-title">Hesap Yönetimi</div>
                <div className="profile-menu-item">
                  <span className="profile-menu-icon">🔑</span>
                  <div className="profile-menu-text">
                    <div>Şifre Değiştir</div>
                  </div>
                </div>
                <div className="profile-menu-item danger" onClick={handleLogout}>
                  <span className="profile-menu-icon">🚪</span>
                  <div className="profile-menu-text">
                    <div>Güvenli Çıkış</div>
                  </div>
                </div>
              </div>
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
                <span>🚀</span>
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
              <div className="info-card-icon">🎥</div>
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
      <AnalysisSummary
        open={showSummary}
        onClose={() => setShowSummary(false)}
        onAddToCart={(item) => handleAddToCart(item)}
      />
      {showFaq && (
        <div className="faq-modal" onClick={closeFaq}>
          <div className="faq-content" onClick={(e) => e.stopPropagation()}>
            <div className="faq-header">
              <div className="faq-title">Yardım / Sıkça Sorulan Sorular</div>
              <button className="faq-close" onClick={closeFaq}>Kapat</button>
            </div>
            <div className="faq-body">
              <iframe
                className="faq-iframe"
                title="FAQ"
                srcDoc={`<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background:#f8fafc; overflow-x:hidden; }
    * { box-sizing: border-box; }
    .container { width:100%; max-width:1200px; margin:0 auto; padding:32px 18px 24px; }
    .header { text-align:center; margin-bottom:28px; color:#1f2937; }
    .header h1 { font-size:32px; font-weight:800; margin:0 0 8px; }
    .header p { font-size:15px; margin:0; color:#4b5563; }
    .search-container { max-width:640px; margin:0 auto 24px; position:relative; }
    .search-box { width:100%; padding:14px 48px; font-size:14px; border:1px solid #e5e7eb; border-radius:999px; background:#fff; box-shadow:0 8px 22px rgba(0,0,0,0.06); }
    .search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:#667eea; font-size:18px; }
    .clear-search { position:absolute; right:16px; top:50%; transform:translateY(-50%); background:none; border:none; color:#9ca3af; font-size:18px; cursor:pointer; display:none; }
    .clear-search.visible { display:block; }
    .categories { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:12px; margin-bottom:16px; }
    .category-filter { background:#fff; padding:12px 14px; border-radius:12px; border:2px solid transparent; cursor:pointer; transition:all 0.2s ease; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.08); font-size:13px; font-weight:700; color:#111827; }
    .category-filter.active { border-color:#667eea; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; box-shadow:0 8px 28px rgba(102,126,234,0.25); }
    .category-icon { font-size:20px; margin-bottom:4px; }
    .faq-list { display:flex; flex-direction:column; gap:10px; }
    .faq-item { background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
    .faq-question { padding:16px 44px 16px 16px; cursor:pointer; font-weight:700; font-size:14px; color:#1f2937; position:relative; }
    .faq-question::after { content:'+'; position:absolute; right:16px; top:50%; transform:translateY(-50%); font-size:22px; color:#667eea; }
    .faq-item.active .faq-question::after { content:'−'; }
    .faq-category-tag { display:inline-block; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-right:8px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; }
    .faq-answer { max-height:0; overflow:hidden; transition:max-height 0.25s ease, padding 0.25s ease; padding:0 16px; color:#4b5563; line-height:1.5; font-size:13px; }
    .faq-item.active .faq-answer { max-height:300px; padding:0 16px 16px; }
    .no-results { text-align:center; padding:32px; color:#4b5563; display:none; }
    .no-results.visible { display:block; }
    .stats { text-align:center; color:#374151; margin-top:20px; padding:18px; background:#fff; border:1px solid #e5e7eb; border-radius:12px; }
    .stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px,1fr)); gap:14px; margin-top:12px; }
    .stat-number { font-size:22px; font-weight:800; }
    .stat-label { font-size:12px; color:#6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 id="page-title">Sıkça Sorulan Sorular</h1>
      <p id="page-subtitle">Size yardımcı olmak için buradayız! Aradığınız yanıtı bulmak için aşağıdaki kategorilere göz atın.</p>
    </div>
    <div class="search-container">
      <span class="search-icon">🔍</span>
      <input type="text" class="search-box" id="search-input" placeholder="Sorunuzu yazın..." aria-label="SSS arama" />
      <button class="clear-search" id="clear-search" aria-label="Aramayı temizle">✕</button>
    </div>
    <div class="categories" id="categories"></div>
    <div class="faq-list" id="faq-list"></div>
    <div class="no-results" id="no-results">
      <div style="font-size:36px;margin-bottom:8px;">🤔</div>
      <div style="font-weight:700;">Sonuç bulunamadı</div>
      <div style="font-size:12px;color:#6b7280;">Farklı bir arama terimi deneyin veya kategori seçin</div>
    </div>
    <div class="stats">
      <div style="font-weight:800;">İstatistikler</div>
      <div class="stats-grid">
        <div>
          <div class="stat-number" id="total-questions">0</div>
          <div class="stat-label">Toplam Soru</div>
        </div>
        <div>
          <div class="stat-number" id="total-categories">0</div>
          <div class="stat-label">Kategori</div>
        </div>
        <div>
          <div class="stat-number" id="opened-count">0</div>
          <div class="stat-label">Açılan Yanıt</div>
        </div>
      </div>
    </div>
  </div>
  <script>
    const faqData = ${JSON.stringify([
      {
        category: 'membership',
        categoryName: 'Üyelik',
        icon: '👤',
        question: 'Nasıl üye olabilirim?',
        answer: 'Ana sayfadaki "Üye Ol" butonuna tıklayarak veya herhangi bir egzersiz planına kaydolarak ücretsiz üyelik oluşturabilirsiniz. E-posta adresiniz ve bir şifre belirlemeniz yeterlidir.'
      },
      {
        category: 'membership',
        categoryName: 'Üyelik',
        icon: '👤',
        question: 'Üyelik ücretli mi?',
        answer: 'EgzersizLab temel üyelik tamamen ücretsizdir! Premium özellikler için aylık veya yıllık paketlerimiz mevcuttur. Premium üyelik ile kişiselleştirilmiş antrenman planları, beslenme programları ve 1-1 danışmanlık hizmetlerine erişebilirsiniz.'
      },
      {
        category: 'membership',
        categoryName: 'Üyelik',
        icon: '👤',
        question: 'Üyeliğimi nasıl iptal edebilirim?',
        answer: 'Hesap ayarlarınızdan "Üyelik" bölümüne giderek istediğiniz zaman üyeliğinizi iptal edebilirsiniz. İptal işlemi hemen gerçekleşir ve mevcut dönem sonunda otomatik yenileme durdurulur.'
      },
      {
        category: 'training',
        categoryName: 'Antrenman',
        icon: '💪',
        question: 'Egzersiz programları kime göre hazırlanmış?',
        answer: 'Programlarımız başlangıç, orta ve ileri seviye olmak üzere her fitness düzeyine uygun hazırlanmıştır. Kişiselleştirilmiş plan oluşturarak hedeflerinize ve seviyenize özel bir program alabilirsiniz.'
      },
      {
        category: 'training',
        categoryName: 'Antrenman',
        icon: '💪',
        question: 'Haftada kaç gün antrenman yapmalıyım?',
        answer: 'Başlangıç seviyesi için haftada 3-4 gün, orta seviye için 4-5 gün, ileri seviye için 5-6 gün antrenman önerilir. Ancak dinlenme günleri de kas gelişimi için çok önemlidir.'
      },
      {
        category: 'training',
        categoryName: 'Antrenman',
        icon: '💪',
        question: 'Evde ekipmansız antrenman yapabilir miyim?',
        answer: 'Kesinlikle! "Evde Antrenman" kategorimizde ekipmansız, sadece vücut ağırlığınızı kullanarak yapabileceğiniz yüzlerce egzersiz bulabilirsiniz. Ayrıca minimal ekipman (direnç bandı, dambıl) gerektiren programlar da mevcuttur.'
      },
      {
        category: 'training',
        categoryName: 'Antrenman',
        icon: '💪',
        question: 'Antrenman sırasında video gösterimi var mı?',
        answer: 'Evet! Her egzersiz için profesyonel çekim kalitesinde video gösterimleri, adım adım açıklamalar ve doğru form ipuçları bulunmaktadır. Ayrıca yaygın hataları da göstererek size rehberlik ediyoruz.'
      },
      {
        category: 'nutrition',
        categoryName: 'Beslenme',
        icon: '🥗',
        question: 'Beslenme programı alabilir miyim?',
        answer: 'Premium üyelerimiz kişiselleştirilmiş beslenme programı alabilirler. Program hazırlanırken hedefleriniz (kilo verme, kas yapma, sağlıklı yaşam), alerjileriniz ve besin tercihleri dikkate alınır.'
      },
      {
        category: 'nutrition',
        categoryName: 'Beslenme',
        icon: '🥗',
        question: 'Yemek tarifleri var mı?',
        answer: 'Evet! Fitness hedeflerinize uygun, pratik ve lezzetli yüzlerce tarif bulunmaktadır. Her tarif kalori ve makro besin değerleri ile birlikte sunulur. Ayrıca haftalık meal-prep önerileri de mevcuttur.'
      },
      {
        category: 'nutrition',
        categoryName: 'Beslenme',
        icon: '🥗',
        question: 'Vejeteryan/Vegan besleniyor olsam da program alabilir miyim?',
        answer: 'Elbette! Beslenme programlarımız tüm diyet tercihlerine uygun olarak hazırlanabilir. Vejeteryan, vegan, glutensiz veya diğer özel beslenme ihtiyaçlarınızı belirtmeniz yeterlidir.'
      },
      {
        category: 'progress',
        categoryName: 'İlerleme',
        icon: '📊',
        question: 'İlerlememi nasıl takip edebilirim?',
        answer: 'Kişisel panonuzda ağırlık, vücut ölçümleri, antrenman performansı ve beslenme alışkanlıklarınızı grafikler ve istatistiklerle takip edebilirsiniz. Düzenli fotoğraf yükleyerek görsel ilerlemenizi de kaydedebilirsiniz.'
      },
      {
        category: 'progress',
        categoryName: 'İlerleme',
        icon: '📊',
        question: 'Hedeflerimi değiştirebilir miyim?',
        answer: 'Evet, istediğiniz zaman hedeflerinizi güncelleyebilirsiniz. Sistem yeni hedeflerinize göre antrenman ve beslenme programınızı otomatik olarak yeniden düzenler.'
      },
      {
        category: 'progress',
        categoryName: 'İlerleme',
        icon: '📊',
        question: 'Sonuç görmem ne kadar sürer?',
        answer: 'İlk belirgin değişiklikler genellikle 4-6 hafta içinde görülür. Ancak bu süre kişiden kişiye, hedeflere ve programa uyuma göre değişiklik gösterebilir. Düzenli antrenman ve dengeli beslenme ile 12 haftada önemli sonuçlar elde edebilirsiniz.'
      },
      {
        category: 'support',
        categoryName: 'Destek',
        icon: '💬',
        question: 'Teknik sorun yaşarsam ne yapmalıyım?',
        answer: 'Destek ekibimize destek@egzersizlab.com adresinden veya canlı destek hattımızdan 7/24 ulaşabilirsiniz. Genellikle 2 saat içinde yanıt veriyoruz.'
      },
      {
        category: 'support',
        categoryName: 'Destek',
        icon: '💬',
        question: 'Antrenör desteği alabilir miyim?',
        answer: 'Premium ve Premium Plus üyelerimiz aylık 2 veya sınırsız 1-1 online danışmanlık seansı alabilirler. Bu seanslarda kişisel antrenörlerimizden form kontrolü, program önerileri ve motivasyon desteği alırsınız.'
      },
      {
        category: 'support',
        categoryName: 'Destek',
        icon: '💬',
        question: 'Mobil uygulamanız var mı?',
        answer: 'Evet! iOS ve Android için mobil uygulamamız mevcuttur. Uygulama ile antrenman takibi, egzersiz videoları, beslenme günlüğü ve tüm özelliklerimize mobil cihazınızdan erişebilirsiniz.'
      },
      {
        category: 'payment',
        categoryName: 'Ödeme',
        icon: '💳',
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer: 'Kredi kartı, banka kartı ve dijital cüzdanlar (Apple Pay, Google Pay) ile ödeme yapabilirsiniz. Tüm ödemeler SSL şifrelemesi ile güvenli bir şekilde işlenir.'
      },
      {
        category: 'payment',
        categoryName: 'Ödeme',
        icon: '💳',
        question: 'İade politikanız nedir?',
        answer: 'Premium üyelik alımından sonraki ilk 14 gün içinde memnun kalmazsanız tam iade yapıyoruz. İade talebi için destek ekibimizle iletişime geçmeniz yeterlidir.'
      },
      {
        category: 'payment',
        categoryName: 'Ödeme',
        icon: '💳',
        question: 'Otomatik yenileme nasıl çalışır?',
        answer: 'Premium üyeliğiniz otomatik olarak yenilenir. İptal etmek isterseniz mevcut dönem bitiminden önce hesap ayarlarınızdan iptal edebilirsiniz. İptal sonrası dönem sonuna kadar tüm özelliklere erişiminiz devam eder.'
      },
      {
        category: 'privacy',
        categoryName: 'Gizlilik ve Güvenlik',
        icon: '🔒',
        question: 'Yüklediğim fotoğrafları kimler görüyor? İnternete düşer mi?',
        answer: 'Hayır. Fotoğraflarınız uçtan uca şifreli sunucularda tutulur. Bu görsellere yalnızca size atanan uzman fizyoterapist erişebilir; sistem yöneticileri veya diğer üyeler asla göremez. Tedaviniz bittiğinde fotoğrafları kalıcı olarak silebilirsiniz.'
      },
      {
        category: 'privacy',
        categoryName: 'Gizlilik ve Güvenlik',
        icon: '🔒',
        question: 'Kredi kartı bilgilerimi saklıyor musunuz?',
        answer: 'Hayır. Ödeme altyapımız BDDK lisanslı Iyzico tarafından sağlanmaktadır. Kart bilgileriniz bizim sistemimizde değil, bankanın güvenli altyapısında işlenir.'
      }
    ])};

    let currentCategory = 'all';
    let openedCount = 0;

    function renderCategories() {
      const categoriesMap = {};
      faqData.forEach(item => {
        if (!categoriesMap[item.category]) {
          categoriesMap[item.category] = { id: item.category, name: item.categoryName, icon: item.icon };
        }
      });
      const categories = Object.values(categoriesMap);
      const allCategory = { id: 'all', name: 'Tümü', icon: '📋' };
      const html = [allCategory, ...categories].map(cat => \`
        <div class="category-filter \${currentCategory === cat.id ? 'active' : ''}" data-category="\${cat.id}">
          <div class="category-icon">\${cat.icon}</div>
          <div class="category-name">\${cat.name}</div>
        </div>
      \`).join('');
      document.getElementById('categories').innerHTML = html;
    }

    function renderFAQ(searchTerm = '') {
      const list = document.getElementById('faq-list');
      const noRes = document.getElementById('no-results');
      let filtered = faqData;
      if (currentCategory !== 'all') filtered = filtered.filter(i => i.category === currentCategory);
      if (searchTerm) filtered = filtered.filter(i => i.question.toLowerCase().includes(searchTerm.toLowerCase()) || i.answer.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filtered.length === 0) {
        list.style.display = 'none';
        noRes.classList.add('visible');
      } else {
        list.style.display = 'flex';
        noRes.classList.remove('visible');
        list.innerHTML = filtered.map((item, idx) => \`
          <div class="faq-item" data-index="\${idx}">
            <div class="faq-question">
              <span class="faq-category-tag">\${item.categoryName}</span>
              \${item.question}
            </div>
            <div class="faq-answer">\${item.answer}</div>
          </div>
        \`).join('');
      }
      updateStats();
    }

    function updateStats() {
      const cats = [...new Set(faqData.map(i => i.category))];
      document.getElementById('total-questions').textContent = faqData.length;
      document.getElementById('total-categories').textContent = cats.length;
      document.getElementById('opened-count').textContent = openedCount;
    }

    document.getElementById('categories').addEventListener('click', (e) => {
      const btn = e.target.closest('.category-filter');
      if (!btn) return;
      currentCategory = btn.dataset.category;
      renderCategories();
      renderFAQ(document.getElementById('search-input').value);
    });

    document.getElementById('faq-list').addEventListener('click', (e) => {
      const item = e.target.closest('.faq-item');
      if (!item) return;
      const was = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      if (!was) { item.classList.add('active'); openedCount++; } else { openedCount = Math.max(0, openedCount - 1); }
      updateStats();
    });

    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      renderFAQ(val);
      if (val) clearBtn.classList.add('visible'); else clearBtn.classList.remove('visible');
    });
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.remove('visible');
      renderFAQ();
      searchInput.focus();
    });

    renderCategories();
    renderFAQ();
  </script>
</body>
</html>`}
              />
            </div>
          </div>
        </div>
      )}
      {showSupport && (
        <div className="support-modal" onClick={closeSupport}>
          <div className="support-content" onClick={(e) => e.stopPropagation()}>
            <div className="support-header">
              <div className="support-title">Destek Talebi</div>
              <button className="support-close" onClick={closeSupport}>Kapat</button>
            </div>
            <div className="support-body">
              <iframe
                className="support-iframe"
                title="Destek Talebi"
                srcDoc={`<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background:#f8fafc; overflow:hidden; }
    * { box-sizing:border-box; }
    .wrap { max-width:1120px; margin:0 auto; padding:12px 16px 10px; }
    .top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .title { font-size:23px; font-weight:800; color:#111827; }
    .badge { background:#fef3c7; color:#b45309; padding:6px 10px; border-radius:999px; font-size:11px; font-weight:700; }
    .form-grid { display:grid; grid-template-columns:1fr; gap:10px; background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:12px 14px; box-shadow:0 10px 28px rgba(0,0,0,0.06); }
    label { font-size:13px; font-weight:700; color:#374151; display:block; margin-bottom:6px; }
    input, select, textarea { width:100%; padding:12px; border:1px solid #e5e7eb; border-radius:10px; font-size:13px; color:#111827; background:#fff; }
    textarea { resize:none; height:110px; }
    .row-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .upload { border:2px dashed #cbd5e0; border-radius:10px; padding:12px; text-align:center; background:#fff; }
    .upload p { margin:4px 0; font-size:12px; color:#4b5563; }
    .note { display:flex; gap:8px; padding:10px; border-radius:10px; background:#fef3c7; color:#92400e; font-size:12px; }
    .actions { display:flex; justify-content:flex-end; gap:10px; margin-top:8px; }
    .btn { padding:12px 16px; border-radius:10px; border:none; font-weight:800; cursor:pointer; font-size:13px; }
    .btn-cancel { background:#e5e7eb; color:#111827; }
    .btn-send { background:linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%); color:#fff; }
    .tickets { margin-top:8px; display:grid; grid-template-columns:1fr; gap:6px; }
    .ticket { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px; box-shadow:0 8px 18px rgba(0,0,0,0.05); }
    .ticket-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
    .chip { padding:6px 10px; border-radius:999px; font-size:11px; font-weight:700; color:#1f2937; background:#eef2ff; }
    .status { padding:6px 12px; border-radius:999px; font-size:11px; font-weight:700; }
    .status.pending { background:#fff7ed; color:#9a3412; }
    .status.done { background:#ecfdf3; color:#15803d; }
    .msg { font-size:13px; color:#374151; line-height:1.5; margin:8px 0; }
    .file { font-size:12px; color:#6b7280; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="title">Destek Talebi Oluştur</div>
      <div class="badge">Demo - kaydetme yok</div>
    </div>
    <form class="form-grid">
      <div>
        <label>Konu</label>
        <select>
          <option value="">Bir konu seçin</option>
          <option>🔧 Teknik Sorun</option>
          <option>💳 Ödeme ve Paket</option>
          <option>🏃 Egzersiz / İçerik</option>
          <option>📢 Öneri / Geri Bildirim</option>
        </select>
      </div>
      <div class="row-2">
        <div>
          <label>Ad Soyad</label>
          <input placeholder="Adınız Soyadınız" />
        </div>
        <div>
          <label>E-posta</label>
          <input placeholder="ornek@email.com" />
        </div>
      </div>
      <div>
        <label>Mesaj</label>
        <textarea placeholder="Sorununuzu kısaca anlatın"></textarea>
      </div>
      <div>
        <label>Ekran görüntüsü (isteğe bağlı)</label>
        <div class="upload">
          <div style="font-size:24px; color:#7c3aed;">📎</div>
          <p>Dosya yüklemek için tıklayın veya sürükleyin</p>
          <p style="font-size:11px; color:#9ca3af;">PNG, JPG, GIF (max. 5MB)</p>
        </div>
      </div>
      <div class="note">
        <div>⚠️</div>
        <div>Sağlığınızla ilgili sorular için 'Fizyoterapiste Sor' (Premium) bölümünü kullanınız.</div>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-cancel">İptal</button>
        <button type="button" class="btn btn-send">Talebi Gönder</button>
      </div>
    </form>
    <div class="tickets">
      <div class="ticket">
        <div class="ticket-head">
          <div class="chip">💳 Ödeme İşlemleri</div>
          <div class="status pending">⏳ Beklemede</div>
        </div>
        <div class="msg">Ödeme yaparken hata kodu alıyorum, destek olabilir misiniz?</div>
        <div class="file">📎 odeme-hatasi.png</div>
      </div>
      <div class="ticket">
        <div class="ticket-head">
          <div class="chip">🔧 Teknik Sorun</div>
          <div class="status done">✅ Tamamlandı</div>
        </div>
        <div class="msg">Video açılmıyor, 404 hatası veriyor. Sorun çözüldü teşekkürler.</div>
      </div>
    </div>
  </div>
</body>
</html>`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
