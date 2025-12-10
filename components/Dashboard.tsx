import React, { useEffect, useMemo, useRef, useState } from 'react';
import AssessmentWizard from './AssessmentWizard';
import AnalysisSummary from './AnalysisSummary';
import SupportTicketModal from './SupportTicketModal';
import HelpFAQModal from './HelpFAQModal';
import PackagesModal from './PackagesModal';
import SettingsModal from './SettingsModal';
import VideoModal from './VideoModal';
import ExerciseProgramModal from './ExerciseProgramModal';
import ProgressModal from './ProgressModal';
import AnimatedLogo from './AnimatedLogo';
import { apiService } from '../services/apiService';

interface CartItem {
  id: string;
  name: string;
  price: string;
}

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
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [clinicalTestType, setClinicalTestType] = useState<string | null>(null); // Hangi klinik test açılacak
  const [showSummary, setShowSummary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  // Paket tipi: 'none' | 'basic' | 'pro' | 'premium'
  type PackageType = 'none' | 'basic' | 'pro' | 'premium';
  const [packageType, setPackageType] = useState<PackageType>(() => {
    // localStorage'dan paket tipini kontrol et
    const saved = localStorage.getItem('packageType') as PackageType;
    return saved || 'none';
  });
  
  const hasPackage = packageType !== 'none';
  
  // Paket durumunu güncelle ve localStorage'a kaydet
  const updatePackageType = (type: PackageType) => {
    setPackageType(type);
    localStorage.setItem('packageType', type);
  };
  
  const [showExerciseProgram, setShowExerciseProgram] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; type: 'clinical' | 'admin' | 'motivation'; read: boolean; date: string }[]
  >([
    {
      id: 'n1',
      title: 'Fizyoterapistiniz programınızı güncelledi.',
      message: 'Yeni hareket planınız hazır, detayları görmek için tıklayın.',
      type: 'clinical',
      read: false,
      date: '2 saat önce',
    },
    {
      id: 'n2',
      title: 'Ödemeniz başarıyla alındı.',
      message: 'Klinik Takip Paketi hesabınıza tanımlandı, faturanızı görüntüleyebilirsiniz.',
      type: 'admin',
      read: false,
      date: '1 gün önce',
    },
    {
      id: 'n3',
      title: 'Egzersiz Vakti! 🏃‍♂️',
      message: 'Bugünkü programını henüz yapmadın. 15 dakikanı ayırmayı unutma.',
      type: 'motivation',
      read: true,
      date: '3 gün önce',
    },
  ]);

  // İstatistikler
  const [stats, setStats] = useState({
    todayExercises: 3,
    todayCompleted: 1,
    weeklyCompleted: 12,
    weeklyTotal: 18,
    progressPercentage: 68,
    streak: 5,
    totalExercises: 47,
  });

  // Bugünkü görevler
  const [todayTasks, setTodayTasks] = useState([
    { id: 't1', name: 'Boyun Germe Egzersizi', duration: '10 dk', completed: true, time: '09:00' },
    { id: 't2', name: 'Omuz Rotasyonu', duration: '5 dk', completed: false, time: '14:00' },
    { id: 't3', name: 'Bel Güçlendirme', duration: '15 dk', completed: false, time: '18:00' },
  ]);

  const toggleTask = (taskId: string) => {
    setTodayTasks(prev => {
      const updated = prev.map(t => t.id === taskId ? {...t, completed: !t.completed} : t);
      const completedCount = updated.filter(t => t.completed).length;
      setStats(prevStats => ({
        ...prevStats,
        todayCompleted: completedCount,
      }));
      return updated;
    });
  };

  // Paket bilgisi - paket tipine göre dinamik
  const getPackageInfo = () => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 1);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (packageType) {
      case 'basic':
        return {
          name: 'Temel Analiz & Egzersiz Planı',
          startDate: formatDate(today),
          endDate: 'Tek Seferlik',
          daysRemaining: null,
          features: [
            'Detaylı anamnez değerlendirmesi',
            'Fizyoterapist tarafından vaka analizi',
            '4-6 haftalık kişiye özel egzersiz reçetesi',
            'Egzersiz videoları ve açıklamaları',
          ],
          price: '599₺',
        };
      case 'pro':
        return {
          name: 'Klinik Takip & İlerleme Paketi',
          startDate: formatDate(today),
          endDate: formatDate(endDate),
          daysRemaining,
          features: [
            'Temel paketteki tüm hizmetler',
            'Haftalık kontrol ve değerlendirme',
            'Ağrı ve gelişime göre program revizyonu',
            'Sistem üzerinden soru-cevap hakkı',
            '1 aylık aktif takip',
          ],
          price: '1.299₺',
        };
      case 'premium':
        return {
          name: 'Premium Danışmanlık & Video Analizi',
          startDate: formatDate(today),
          endDate: formatDate(endDate),
          daysRemaining,
          features: [
            'Tüm paketlerdeki hizmetler',
            'Video analizi: Egzersizlerinizi kaydedin, geri bildirim alın',
            'Hızlı destek (chat/WhatsApp)',
            'Öncelikli değerlendirme (aynı gün dönüş)',
            'Sınırsız program güncellemesi',
          ],
          price: '2.499₺',
        };
      default:
        return {
          name: '',
          startDate: '',
          endDate: '',
          daysRemaining: null,
          features: [],
          price: '',
        };
    }
  };
  
  const packageInfo = getPackageInfo();

  // Son aktiviteler
  const recentActivities = [
    { id: 'a1', type: 'exercise', text: 'Boyun Germe Egzersizi tamamlandı', time: '2 saat önce', icon: '✅' },
    { id: 'a2', type: 'message', text: 'Fizyoterapistinizden yeni mesaj', time: '1 gün önce', icon: '💬' },
    { id: 'a3', type: 'program', text: 'Egzersiz programınız güncellendi', time: '2 gün önce', icon: '📝' },
    { id: 'a4', type: 'achievement', text: '5 günlük streak kazandınız!', time: '3 gün önce', icon: '🏆' },
  ];

  // İlerleme verisi (haftalık)
  const progressData = [
    { day: 'Pzt', value: 80 },
    { day: 'Sal', value: 65 },
    { day: 'Çar', value: 90 },
    { day: 'Per', value: 70 },
    { day: 'Cum', value: 85 },
    { day: 'Cmt', value: 60 },
    { day: 'Paz', value: 45 },
  ];

  // Rozetler/Başarılar
  const badges = [
    { id: 'b1', name: 'İlk Adım', icon: '🎯', earned: true, description: 'İlk egzersizini tamamladın!' },
    { id: 'b2', name: '5 Gün Streak', icon: '🔥', earned: true, description: '5 gün üst üste egzersiz yaptın!' },
    { id: 'b3', name: 'Haftalık Şampiyon', icon: '👑', earned: false, description: 'Bir hafta boyunca tüm egzersizleri tamamla' },
    { id: 'b4', name: '100 Egzersiz', icon: '💯', earned: false, description: 'Toplam 100 egzersiz tamamla' },
    { id: 'b5', name: 'Sabah Kahramanı', icon: '🌅', earned: false, description: '7 sabah egzersiz yap' },
    { id: 'b6', name: 'Hafta Sonu Savaşçısı', icon: '⚔️', earned: false, description: 'Hafta sonu egzersizlerini tamamla' },
    { id: 'b7', name: 'Mükemmel Hafta', icon: '⭐', earned: false, description: 'Bir hafta hiç egzersiz kaçırma' },
    { id: 'b8', name: '30 Günlük Efsane', icon: '🏆', earned: false, description: '30 gün üst üste devam et' },
    { id: 'b9', name: 'Hızlı Başlangıç', icon: '⚡', earned: false, description: 'İlk 3 günü tamamla' },
    { id: 'b10', name: 'Gece Kuşu', icon: '🦉', earned: false, description: '10 akşam egzersiz yap' },
    { id: 'b11', name: 'İlerleme Ustası', icon: '📈', earned: false, description: 'İlerleme skorunu %80\'e çıkar' },
    { id: 'b12', name: 'Sosyal Kelebek', icon: '🦋', earned: false, description: '10 arkadaşını davet et' },
  ];

  const addToCart = (item: { id: string; name: string; price?: string }) => {
    if (!cart.find(c => c.id === item.id)) {
      setCart([...cart, { id: item.id, name: item.name, price: item.price || '0' }]);
      // Close all modals and open cart
      setShowSummary(false);
      setShowPackages(false);
      setTimeout(() => setShowCart(true), 300);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + parseInt(item.price.replace(/\./g, '')), 0);
  };

  const healthTips = [
    { icon: '💡', title: 'Biliyor muydunuz?', text: "Kronik ağrıların %80'i doğru duruş ve egzersizle ameliyatsız iyileşebilir." },
    { icon: '🧘', title: 'Günlük İpucu', text: 'Her gün 10 dakika germe egzersizi, kas gerginliğini %40 azaltır.' },
    { icon: '🚶', title: 'Hareket Şart!', text: 'Her 45 dakikada bir 5 dakika yürümek, bel ağrısı riskini %50 düşürür.' },
    { icon: '💧', title: 'Su İçin', text: 'Günde 2 litre su içmek, eklem sağlığını korur ve kas kramplarını önler.' },
    { icon: '😴', title: 'Uyku Önemli', text: 'Kaliteli 7-8 saat uyku, kas onarımı ve ağrı yönetimi için kritiktir.' },
    { icon: '🏋️', title: 'Düzenli Egzersiz', text: 'Haftada 3 gün egzersiz, kronik ağrıyı %60 oranında azaltabilir.' },
    { icon: '🪑', title: 'Doğru Oturuş', text: 'Ergonomik oturma pozisyonu, boyun ve sırt ağrılarını önler.' },
    { icon: '🌿', title: 'Stres Yönetimi', text: 'Stres kas gerginliğini artırır. Nefes egzersizleri rahatlamanıza yardımcı olur.' },
  ];
  const [scrollProgress, setScrollProgress] = useState(0);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const notificationButtonRef = useRef<HTMLDivElement | null>(null);

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


  // Login success message kontrolü
  useEffect(() => {
    const showSuccess = localStorage.getItem('showLoginSuccess');
    if (showSuccess === 'true') {
      setShowLoginSuccess(true);
      localStorage.removeItem('showLoginSuccess');
      // 3 saniye sonra otomatik kapat
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Kullanıcı bilgilerini ve dashboard verilerini backend'den çek
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Kullanıcı bilgilerini getir
        const response = await apiService.getCurrentUser();
        if (response.success && (response as any).user) {
          const user = (response as any).user;
          const firstName = user.name?.split(' ')[0] || 'Kullanıcı';
          const upperFirstName = firstName.toUpperCase();
          
          setConfig((prev) => ({
            ...prev,
            user_name: upperFirstName,
          }));

          if (user.packageType) {
            setPackageType(user.packageType);
            localStorage.setItem('packageType', user.packageType);
          }
        }

        // Dashboard verilerini getir
        const dashboardResponse = await apiService.getDashboardData();
        if (dashboardResponse.success && dashboardResponse.data) {
          const dashboardData = dashboardResponse.data;
          
          // Assessment sonuçlarını yükle
          if (dashboardData.assessmentResults) {
            console.log('Assessment sonuçları yüklendi:', dashboardData.assessmentResults);
          }
          
          // Fotoğrafları yükle
          if (dashboardData.photos) {
            console.log('Fotoğraflar yüklendi:', dashboardData.photos);
          }
          
          // Form verilerini yükle
          if (dashboardData.formData) {
            console.log('Form verileri yüklendi:', dashboardData.formData);
          }
          
          // Bildirimleri yükle
          if (dashboardData.notifications && Array.isArray(dashboardData.notifications)) {
            setNotifications(dashboardData.notifications);
          }
        }
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error);
        // Hata durumunda varsayılan ismi kullan
      }
    };

    fetchUserData();
  }, []);

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
      if (notificationRef.current?.contains(target) || notificationButtonRef.current?.contains(target)) return;
      setShowNotifications(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  // Rotating health tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 8000); // 8 saniyede bir değişir
    return () => clearInterval(tipInterval);
  }, [healthTips.length]);

  return (
    <div className="dashboard-wrapper" style={{ minHeight: '100vh', background: gradientBackground }}>
      {/* Login Success Message */}
      {showLoginSuccess && (
        <div 
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Giriş yapıldı</span>
          <button
            onClick={() => setShowLoginSuccess(false)}
            style={{
              marginLeft: 8,
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: 0,
              width: 20,
              height: 20,
            }}
          >
            ×
          </button>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        body { margin: 0; padding: 0; box-sizing: border-box; }
        * { box-sizing: inherit; }
        .dashboard-wrapper { display: flex; height: 100%; width: 100%; position: relative; }
        .sidebar { width: 260px; background: #fff; box-shadow: 2px 0 20px rgba(0,0,0,0.08); display: flex; flex-direction: column; height: 100%; border-radius: 0 24px 24px 0; overflow: hidden; }
        .sidebar-header { padding: 24px; border-bottom: 1px solid #e5e7eb; background: #fff; }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-progress { width: 100%; height: 3px; background: #e5e7eb; border-radius: 999px; margin-top: 10px; overflow: hidden; }
        .logo-progress-inner { height: 100%; background: linear-gradient(90deg, #667eea, #22c55e); transition: width 0.15s ease-out; }
        .menu-items { flex: 1; padding: 16px 0; overflow-y: auto; }
        .menu-section-title { padding: 20px 24px 8px 36px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #9ca3af; text-transform: uppercase; }
        .menu-divider { height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin: 12px 24px; border: none; }
        .menu-item { display: flex; align-items: center; padding: 14px 24px; color: #4b5563; cursor: pointer; transition: all 0.2s; font-size: 15px; gap: 12px; margin: 0 12px; border-radius: 12px; }
        .menu-item:hover { background: #f3f4f6; color: #667eea; }
        .menu-item.active { background: linear-gradient(135deg, #eef2ff, #f0f9ff); color: #667eea; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15); }
        .menu-item.locked { opacity: 0.55; cursor: not-allowed; }
        .menu-item.premium-feature { position: relative; }
        .menu-item.premium-feature::after { content: 'PREMIUM'; position: absolute; right: 50px; font-size: 9px; font-weight: 700; color: #f59e0b; background: #fef3c7; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; }
        .main-content { flex: 1; overflow-y: auto; height: 100%; background: transparent; }
        .top-bar { background: #fff; padding: 20px 32px 20px 48px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); position: relative; border-radius: 24px; margin: 24px 24px 24px 32px; }
        .welcome-section { display: flex; align-items: center; gap: 24px; flex: 1; }
        .welcome-text { padding-left: 16px; }
        .welcome-text h1 { font-size: 28px; font-weight: 600; color: ${config.text_color}; margin: 0 0 4px 0; }
        .welcome-text p { font-size: 15px; color: #6b7280; margin: 0; }
        .welcome-badges { display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; border: 2px solid #fbbf24; }
        .welcome-badges-title { font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; }
        .welcome-badges-list { display: flex; align-items: center; gap: 8px; }
        .welcome-badge-item { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2); }
        .welcome-badge-item:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
        .welcome-badge-icon { display: flex; align-items: center; justify-content: center; }
        .welcome-badge-more { width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb; border: 2px solid #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #6b7280; cursor: pointer; transition: all 0.2s; }
        .welcome-badge-more:hover { background: #d1d5db; }
        .top-bar-right { display: flex; align-items: center; gap: 20px; position: relative; }
        .notification-bell { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 18px; position: relative; }
        .notification-bell:hover { background: #e5e7eb; }
        .notification-badge { position: absolute; top: -2px; right: -2px; min-width: 18px; height: 18px; background: #ef4444; color: #fff; border-radius: 999px; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 5px; border: 2px solid #fff; }
        .notification-wrapper { position: relative; }
        .notification-dropdown { position: absolute; top: 50px; right: 0; width: 360px; background: #fff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; overflow: hidden; z-index: 1000; animation: slideDown 0.2s ease; max-height: 500px; display: flex; flex-direction: column; }
        .notification-header { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 14px 16px; font-size: 15px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
        .notification-items { max-height: 400px; overflow-y: auto; }
        .notification-item { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: all 0.2s; margin: 0 8px; border-radius: 12px; }
        .notification-item:hover { background: #f9fafb; margin: 4px 8px; }
        .notification-item.read { background: #fff; opacity: 0.7; }
        .notification-item.unread { background: #f0f9ff; }
        .notification-item-title { font-size: 13px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
        .notification-item-message { font-size: 12px; color: #6b7280; line-height: 1.4; margin-bottom: 4px; }
        .notification-item-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
        .notification-item-type { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; }
        .notification-item-type.clinical { background: #dbeafe; color: #1d4ed8; }
        .notification-item-type.admin { background: #fee2e2; color: #b91c1c; }
        .notification-item-type.motivation { background: #dcfce7; color: #15803d; }
        .notification-item-date { font-size: 11px; color: #9ca3af; }
        .notification-empty { padding: 40px 20px; text-align: center; color: #9ca3af; font-size: 14px; }
        .notification-footer { padding: 12px 16px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
        .notification-footer-btn { background: none; border: none; color: #667eea; font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 8px; }
        .notification-footer-btn:hover { text-decoration: underline; }
        
        /* Cart Styles */
        .cart-wrapper { position: relative; }
        .cart-bell { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 18px; position: relative; flex-shrink: 0; }
        .cart-bell:hover { background: #d1fae5; }
        .cart-badge { position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; background: #ef4444; color: #fff; font-size: 11px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: bounce 0.5s ease; }
        @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .cart-overlay { position: fixed; inset: 0; z-index: 999; }
        .cart-dropdown { position: absolute; top: 50px; right: 0; width: 320px; background: #fff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; overflow: hidden; z-index: 1000; animation: slideDown 0.2s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .cart-header { background: linear-gradient(135deg, #10b981, #059669); color: #fff; padding: 14px 16px; font-size: 15px; font-weight: 700; }
        .cart-empty { padding: 30px; text-align: center; color: #9ca3af; font-size: 14px; }
        .cart-items { max-height: 240px; overflow-y: auto; }
        .cart-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; margin: 0 8px; border-radius: 12px; }
        .cart-item-info { display: flex; flex-direction: column; gap: 2px; }
        .cart-item-name { font-size: 13px; font-weight: 600; color: #1f2937; }
        .cart-item-price { font-size: 14px; font-weight: 700; color: #10b981; }
        .cart-item-remove { background: none; border: none; color: #ef4444; font-size: 16px; cursor: pointer; padding: 4px; border-radius: 4px; }
        .cart-item-remove:hover { background: #fef2f2; }
        .cart-footer { padding: 14px 16px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
        .cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .cart-total span:first-child { font-size: 14px; color: #6b7280; font-weight: 500; }
        .cart-total-price { font-size: 20px; font-weight: 800; color: #10b981; }
        .cart-checkout-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .cart-checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .profile-pic { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 16px; cursor: pointer; position: relative; flex-shrink: 0; }
        .content-area { padding: 32px; max-width: 1200px; margin: 0 auto; }
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
        .tip-carousel { position: relative; overflow: hidden; }
        .tip-carousel .info-card-icon { transition: transform 0.5s ease; }
        .tip-title-animated, .tip-text-animated { 
          animation: tipFadeIn 0.5s ease; 
        }
        @keyframes tipFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tip-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .tip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s;
        }
        .tip-dot:hover { background: #9ca3af; }
        .tip-dot.active { 
          background: #10b981; 
          width: 24px; 
          border-radius: 4px; 
        }
        .profile-dropdown { position: absolute; top: 70px; right: 32px; width: 320px; background: #fff; border-radius: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.25s ease; z-index: 1000; border: 1px solid #e5e7eb; overflow: hidden; }
        .profile-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
        .profile-card-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; }
        .profile-avatar-large { width: 70px; height: 70px; border-radius: 50%; background: #fff; color: #667eea; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700; margin: 0 auto 10px auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .profile-name { font-size: 18px; font-weight: 700; margin: 0 0 4px 0; }
        .premium-badge-inline { display: inline-flex; align-items: center; gap: 6px; background: rgba(251, 191, 36, 0.18); color: #b45309; padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 700; border: 1px solid rgba(251, 191, 36, 0.35); }
        .profile-menu-section { padding: 14px 0; }
        .profile-menu-section:not(:last-child) { border-bottom: 1px solid #f3f4f6; }
        .profile-section-title { padding: 8px 16px; font-size: 11px; font-weight: 700; color: #9ca3af; letter-spacing: 1px; text-transform: uppercase; }
        .profile-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #374151; cursor: pointer; transition: all 0.2s; font-size: 14px; margin: 0 12px; border-radius: 12px; }
        .profile-menu-item:hover { background: #f9fafb; color: #4f46e5; }
        .profile-menu-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .profile-menu-icon { font-size: 18px; width: 22px; text-align: center; }
        .profile-menu-text { flex: 1; }
        .profile-menu-text .subtitle { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        
        /* İstatistik Kartları */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: ${config.card_background}; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 16px; transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .stat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
        .stat-content { flex: 1; }
        .stat-value { font-size: 28px; font-weight: 800; color: #1f2937; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #6b7280; font-weight: 500; }
        
        /* Hızlı Erişim Butonları */
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .quick-action-btn { background: ${config.card_background}; border: 2px solid #e5e7eb; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .quick-action-btn:hover { border-color: #667eea; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15); }
        .quick-action-btn.primary { background: linear-gradient(135deg, #667eea, #764ba2); border-color: transparent; color: #fff; }
        .quick-action-btn.primary:hover { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3); }
        .quick-action-icon { font-size: 32px; flex-shrink: 0; }
        .quick-action-text { flex: 1; }
        .quick-action-title { font-size: 15px; font-weight: 700; color: #1f2937; margin-bottom: 2px; }
        .quick-action-btn.primary .quick-action-title { color: #fff; }
        .quick-action-subtitle { font-size: 12px; color: #6b7280; }
        .quick-action-btn.primary .quick-action-subtitle { color: rgba(255,255,255,0.9); }
        
        /* Dashboard Grid */
        .dashboard-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; margin-bottom: 24px; }
        .dashboard-left, .dashboard-right { display: flex; flex-direction: column; gap: 24px; }
        
        /* Görev Kartı */
        .task-card, .progress-chart-card, .package-status-card, .activities-card, .badges-card { background: ${config.card_background}; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-title { font-size: 18px; font-weight: 700; color: #1f2937; margin: 0; }
        .card-badge { background: #eef2ff; color: #667eea; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; }
        .task-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .task-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: #f9fafb; transition: all 0.2s; }
        .task-item:hover { background: #f3f4f6; }
        .task-item.completed { opacity: 0.6; }
        .task-checkbox { font-size: 20px; cursor: pointer; flex-shrink: 0; }
        .task-info { flex: 1; }
        .task-name { font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 4px; }
        .task-item.completed .task-name { text-decoration: line-through; color: #9ca3af; }
        .task-meta { display: flex; gap: 12px; font-size: 12px; color: #6b7280; }
        .task-duration, .task-time { display: flex; align-items: center; gap: 4px; }
        .task-view-all { width: 100%; padding: 10px; background: #f3f4f6; border: none; border-radius: 10px; color: #667eea; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .task-view-all:hover { background: #eef2ff; }
        
        /* İlerleme Grafiği */
        .chart-container { margin-bottom: 16px; }
        .chart-bars { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; height: 200px; padding: 0 8px; }
        .chart-bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .chart-bar { width: 100%; max-width: 50px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 8px 8px 0 0; position: relative; transition: all 0.3s; min-height: 20px; }
        .chart-bar:hover { opacity: 0.8; }
        .chart-value { position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 700; color: #667eea; white-space: nowrap; }
        .chart-label { margin-top: 8px; font-size: 11px; color: #6b7280; font-weight: 600; }
        .chart-footer { display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid #e5e7eb; }
        .chart-stat { display: flex; flex-direction: column; gap: 4px; }
        .chart-stat-label { font-size: 12px; color: #6b7280; }
        .chart-stat-value { font-size: 16px; font-weight: 700; color: #1f2937; }
        
        /* Paket Durumu */
        .package-badge { padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .package-badge.active { background: #dcfce7; color: #15803d; }
        .package-info { margin-bottom: 16px; }
        .package-name { font-size: 16px; font-weight: 700; color: #1f2937; margin-bottom: 8px; }
        .package-dates { font-size: 13px; color: #6b7280; margin-bottom: 12px; }
        .package-countdown { display: flex; align-items: center; gap: 8px; padding: 10px; background: #fef3c7; border-radius: 10px; margin-bottom: 12px; }
        .countdown-icon { font-size: 18px; }
        .countdown-text { font-size: 13px; font-weight: 700; color: #92400e; }
        .package-features { display: flex; flex-direction: column; gap: 6px; }
        .package-feature { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4b5563; }
        .package-feature span { color: #10b981; font-weight: 700; }
        .package-manage-btn { width: 100%; padding: 10px; background: #f3f4f6; border: none; border-radius: 10px; color: #667eea; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .package-manage-btn:hover { background: #eef2ff; }
        
        /* Son Aktiviteler */
        .activities-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 12px; background: #f9fafb; transition: all 0.2s; }
        .activity-item:hover { background: #f3f4f6; }
        .activity-icon { font-size: 20px; flex-shrink: 0; }
        .activity-content { flex: 1; }
        .activity-text { font-size: 13px; font-weight: 600; color: #1f2937; margin-bottom: 4px; }
        .activity-time { font-size: 11px; color: #9ca3af; }
        .activities-view-all { width: 100%; padding: 10px; background: #f3f4f6; border: none; border-radius: 10px; color: #667eea; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .activities-view-all:hover { background: #eef2ff; }
        
        /* Rozetler */
        .badges-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .badge-item { position: relative; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; transition: all 0.2s; }
        .badge-item.earned { background: linear-gradient(135deg, #fef3c7, #fde68a); border-color: #fbbf24; }
        .badge-item.locked { opacity: 0.5; }
        .badge-icon { font-size: 32px; margin-bottom: 8px; }
        .badge-name { font-size: 12px; font-weight: 700; color: #1f2937; }
        .badge-lock { position: absolute; top: 8px; right: 8px; font-size: 16px; opacity: 0.6; }
        
        /* Klinik Testler Bölümü */
        .clinical-tests-section {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          width: 100%;
          max-width: 100%;
          overflow: visible;
        }
        .clinical-tests-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .clinical-tests-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: nowrap;
          align-items: stretch;
          justify-content: flex-start;
        }
        .clinical-test-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: 2px solid transparent;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1 1 0;
          min-width: 0;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }
        .clinical-test-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #764ba2, #667eea);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .clinical-test-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .test-btn-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .test-btn-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .test-btn-text {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .test-btn-desc {
          font-size: 10px;
          font-weight: 500;
          opacity: 0.9;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        @media (max-width: 1200px) {
          .clinical-test-btn {
            padding: 10px 12px;
          }
          .test-btn-icon {
            font-size: 20px;
          }
          .test-btn-text {
            font-size: 12px;
          }
          .test-btn-desc {
            font-size: 9px;
          }
        }
        
        @media (max-width: 768px) {
          .clinical-tests-buttons {
            flex-wrap: wrap;
            gap: 8px;
          }
          .clinical-test-btn {
            flex: 1 1 calc(50% - 4px);
            min-width: 0;
            padding: 10px 12px;
          }
          .test-btn-icon {
            font-size: 20px;
          }
          .test-btn-text {
            font-size: 12px;
          }
          .test-btn-desc {
            font-size: 10px;
          }
          .sidebar { position: fixed; left: -260px; z-index: 100; transition: left 0.3s; }
          .sidebar.open { left: 0; }
          .main-cta-card { flex-direction: column; text-align: center; }
          .cta-illustration { width: 140px; height: 140px; }
          .profile-dropdown { right: 16px; width: calc(100% - 32px); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .quick-actions { grid-template-columns: 1fr; }
          .dashboard-grid { grid-template-columns: 1fr; }
          .chart-bars { height: 150px; }
          .badges-grid { grid-template-columns: repeat(2, 1fr); }
          .welcome-section { flex-direction: column; align-items: flex-start; gap: 16px; }
          .welcome-badges { width: 100%; }
        }
      `}</style>

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <AnimatedLogo size={56} />
            <span style={{ fontSize: 20, fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EgzersizLab</span>
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
          {hasPackage ? (
            <div className="menu-item" onClick={() => setShowExerciseProgram(true)}>
              <span role="img" aria-label="exercise">🧘</span>
              <span>Egzersiz Programım</span>
              <span>✅</span>
            </div>
          ) : (
            <div className="menu-item locked" onClick={() => handleLockedClick(false)}>
              <span role="img" aria-label="exercise">🧘</span>
              <span>Egzersiz Programım</span>
              <span>🔒</span>
            </div>
          )}
          {hasPackage ? (
            <div className="menu-item" onClick={() => setShowProgress(true)}>
              <span role="img" aria-label="calendar">📅</span>
              <span>Takvim / İlerleme</span>
              <span>✅</span>
            </div>
          ) : (
            <div className="menu-item locked" onClick={() => handleLockedClick(false)}>
              <span role="img" aria-label="calendar">📅</span>
              <span>Takvim / İlerleme</span>
              <span>🔒</span>
            </div>
          )}
          <div className="menu-divider" />
          <div className="menu-section-title">DESTEK & İLETİŞİM</div>
          {packageType === 'premium' ? (
            <div className="menu-item" onClick={() => {
              // WhatsApp'a yönlendir - EgzersizLab WhatsApp numarası
              // TODO: Gerçek WhatsApp numarası ile değiştirilecek
              const whatsappNumber = '905551234567'; // Placeholder numara
              const message = encodeURIComponent('Merhaba, EgzersizLab fizyoterapist desteği için yazıyorum.');
              window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }}>
              <span role="img" aria-label="chat">💬</span>
              <span>Fizyoterapiste Sor</span>
              <span>✅</span>
            </div>
          ) : (
          <div className="menu-item locked premium-feature" onClick={() => handleLockedClick(true)}>
            <span role="img" aria-label="chat">💬</span>
            <span>Fizyoterapiste Sor</span>
            <span>🔒</span>
          </div>
          )}
          <div className="menu-item" onClick={() => setShowSupport(true)}>
            <span role="img" aria-label="ticket">🎟️</span>
            <span>Destek Talebi</span>
          </div>
          <div className="menu-item" onClick={() => setShowFAQ(true)}>
            <span role="img" aria-label="help">❓</span>
            <span>Yardım / SSS</span>
          </div>
          <div className="menu-divider" />
          <div className="menu-section-title">HESAP & AYARLAR</div>
          <div className="menu-item" onClick={() => setShowPackages(true)}>
            <span role="img" aria-label="package">📦</span>
            <span>Paketlerim & Ödemeler</span>
          </div>
          <div className="menu-item" onClick={() => setShowSettings(true)}>
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
          <div className="welcome-section">
          <div className="welcome-text">
            <h1 id="welcome-title">Merhaba, {config.user_name} 👋</h1>
            <p id="welcome-subtitle">{config.welcome_subtitle}</p>
          </div>
            {/* Başarılar - Welcome Text'in Yanında */}
            {hasPackage && (
              <div className="welcome-badges" onClick={() => setShowBadgesModal(true)} style={{ cursor: 'pointer' }}>
                <div className="welcome-badges-title">🏆 Başarılarım</div>
                <div className="welcome-badges-list">
                  {badges.filter(b => b.earned).slice(0, 3).map((badge) => (
                    <div key={badge.id} className="welcome-badge-item" title={badge.name}>
                      <span className="welcome-badge-icon">{badge.icon}</span>
                            </div>
                          ))}
                  {badges.filter(b => b.earned).length > 3 && (
                    <div className="welcome-badge-more" title={`+${badges.filter(b => b.earned).length - 3} daha fazla`}>
                      +{badges.filter(b => b.earned).length - 3}
                      </div>
                  )}
                  {badges.filter(b => b.earned).length === 0 && (
                    <div style={{ fontSize: '12px', color: '#92400e', fontStyle: 'italic' }}>
                      İlk başarınızı kazanın!
                    </div>
                  )}
                      </div>
                      </div>
            )}
                      </div>
          {/* Test Butonları - Paket Tipini Değiştir */}
          <div style={{ 
            position: 'fixed', 
            top: '80px', 
            right: '20px', 
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div 
              style={{ 
                background: packageType === 'none' ? '#ef4444' : '#e5e7eb',
                color: packageType === 'none' ? '#fff' : '#6b7280',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                textAlign: 'center',
                minWidth: '120px'
              }}
              onClick={() => updatePackageType('none')}
              title="Paket yok görünümü"
            >
              ❌ Paket Yok
                      </div>
            <div 
              style={{ 
                background: packageType === 'basic' ? '#3b82f6' : '#e5e7eb',
                color: packageType === 'basic' ? '#fff' : '#6b7280',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                textAlign: 'center',
                minWidth: '120px'
              }}
              onClick={() => updatePackageType('basic')}
              title="Temel paket görünümü"
            >
              📦 Temel Paket
                        </div>
            <div 
              style={{ 
                background: packageType === 'pro' ? '#10b981' : '#e5e7eb',
                color: packageType === 'pro' ? '#fff' : '#6b7280',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                textAlign: 'center',
                minWidth: '120px'
              }}
              onClick={() => updatePackageType('pro')}
              title="Klinik takip paketi görünümü"
            >
              ⭐ Klinik Paket
            </div>
            <div 
              style={{ 
                background: packageType === 'premium' ? '#f59e0b' : '#e5e7eb',
                color: packageType === 'premium' ? '#fff' : '#6b7280',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                textAlign: 'center',
                minWidth: '120px'
              }}
              onClick={() => updatePackageType('premium')}
              title="Premium paket görünümü"
            >
              👑 Premium Paket
                      </div>
                    </div>
          <div className="top-bar-right">
            {/* Notification Bell */}
            <div className="notification-wrapper">
              <div 
                className="notification-bell" 
                title="Bildirimler"
                ref={notificationButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
                  </div>
              
              {showNotifications && (
                <>
                  <div className="cart-overlay" onClick={() => setShowNotifications(false)} />
                  <div className="notification-dropdown" ref={notificationRef}>
                    <div className="notification-header">
                      <span>🔔 Bildirimler</span>
                      {unreadCount > 0 && (
                        <span style={{ fontSize: '12px', opacity: 0.9 }}>{unreadCount} okunmamış</span>
                      )}
                    </div>
                    <div className="notification-items">
                  {notifications.length === 0 ? (
                        <div className="notification-empty">
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔕</div>
                          <div>Yeni bildiriminiz yok</div>
                        </div>
                  ) : (
                        notifications.map((notif) => (
                        <div
                          key={notif.id}
                            className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                          onClick={() => handleNotificationClick(notif.id)}
                        >
                            <div className="notification-item-title">{notif.title}</div>
                            <div className="notification-item-message">{notif.message}</div>
                            <div className="notification-item-meta">
                              <span className={`notification-item-type ${notif.type}`}>
                                {notif.type === 'clinical' ? 'Klinik' : notif.type === 'admin' ? 'İdari' : 'Motivasyon'}
                            </span>
                              <span className="notification-item-date">{notif.date}</span>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="notification-footer">
                        <button className="notification-footer-btn">Tümünü Gör</button>
                    </div>
                  )}
                </div>
                </>
              )}
            </div>
            
            {/* Cart Button */}
            <div className="cart-wrapper">
              <div 
                className="cart-bell" 
                title="Sepetim"
                onClick={() => setShowCart(!showCart)}
              >
                🛒
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </div>
              
              {/* Cart Dropdown with Overlay */}
              {showCart && (
                <>
                <div className="cart-overlay" onClick={() => setShowCart(false)} />
                <div className="cart-dropdown">
                  <div className="cart-header">
                    🛒 Sepetim ({cart.length})
                  </div>
                  {cart.length === 0 ? (
                    <div className="cart-empty">Sepetiniz boş</div>
                  ) : (
                    <>
                      <div className="cart-items">
                        {cart.map(item => (
                          <div key={item.id} className="cart-item">
                            <div className="cart-item-info">
                              <span className="cart-item-name">{item.name}</span>
                              <span className="cart-item-price">{item.price}₺</span>
                            </div>
                            <button 
                              className="cart-item-remove"
                              onClick={() => removeFromCart(item.id)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="cart-footer">
                        <div className="cart-total">
                          <span>Toplam:</span>
                          <span className="cart-total-price">{getCartTotal().toLocaleString()}₺</span>
                        </div>
                        <button className="cart-checkout-btn">
                          💳 Ödemeye Geç
                        </button>
                      </div>
                    </>
                  )}
                </div>
                </>
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
                <span className="premium-badge-inline">⭐ Premium Üye</span>
              </div>
              <div className="profile-menu-section">
                <div className="profile-section-title">Kişisel Sağlık Verileri</div>
                <div className="profile-menu-item">
                  <span className="profile-menu-icon">📸</span>
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
                  <span className="profile-menu-icon">🔒</span>
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
          {/* Analiz Başlatma Kartı - Sadece Paket Yokken Görünür */}
          {!hasPackage && (
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
          )}

          {/* Paket Satın Alan Kullanıcılar İçin Özellikler */}
          {hasPackage ? (
            <>
              {/* Klinik Testler Bölümü */}
              <div className="clinical-tests-section">
                <div className="clinical-tests-title">🔬 Klinik Testler</div>
                <div className="clinical-tests-buttons">
                  <button 
                    className="clinical-test-btn"
                    disabled
                    title="Manuel kas testi simülasyonu - Hangi kaslarınız uykuda, hangileri aşırı çalışıyor? (Gluteal amnezi, core stabilizasyonu vb.)"
                  >
                    <span className="test-btn-icon">💪</span>
                    <div className="test-btn-content">
                      <span className="test-btn-text">Kas Kuvvet Analizi</span>
                      <span className="test-btn-desc">Manuel kas testi simülasyonu</span>
                    </div>
                  </button>
                  <button 
                    className="clinical-test-btn"
                    disabled
                    title="Ağrısının sebebi kas kısalığı mı? Hamstring, pektoral, iliopsoas, piriformis gerginlik testleri."
                  >
                    <span className="test-btn-icon">📏</span>
                    <div className="test-btn-content">
                      <span className="test-btn-text">Esneklik Testleri</span>
                      <span className="test-btn-desc">Kas kısalık analizi</span>
                    </div>
                  </button>
                  <button 
                    className="clinical-test-btn"
                    disabled
                    title="Gonyometrik analiz - Eklemler tam açıyla hareket ediyor mu, kısıtlılık derecesi nedir?"
                  >
                    <span className="test-btn-icon">📐</span>
                    <div className="test-btn-content">
                      <span className="test-btn-text">Eklem Hareket Açıklığı</span>
                      <span className="test-btn-desc">Gonyometrik analiz</span>
                    </div>
                  </button>
                  <button 
                    className="clinical-test-btn"
                    disabled
                    title="Sinir germe testleri - Ağrı kas kaynaklı mı yoksa sinir sıkışması mı (Fıtık/Siyatik)?"
                  >
                    <span className="test-btn-icon">🧠</span>
                    <div className="test-btn-content">
                      <span className="test-btn-text">Nörodinamik Testler</span>
                      <span className="test-btn-desc">Sinir germe testleri</span>
                    </div>
                  </button>
                  <button 
                    className="clinical-test-btn"
                    disabled
                    title="Vücudun uzaydaki konum algısı ve denge stratejisi"
                  >
                    <span className="test-btn-icon">⚖️</span>
                    <div className="test-btn-content">
                      <span className="test-btn-text">Denge & Propriosepsiyon</span>
                      <span className="test-btn-desc">Fonksiyonel denge analizi</span>
                    </div>
                  </button>
                  <button 
                    className="clinical-test-btn"
                    disabled
                    title="Çömelme, eğilme ve uzanma sırasında omurga biyomekaniği kontrolü"
                  >
                    <span className="test-btn-icon">🩺</span>
                    <div className="test-btn-content">
                      <span className="test-btn-text">Hareket Kalitesi</span>
                      <span className="test-btn-desc">Biyomekanik analiz</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* İstatistik Kartları */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.todayCompleted}/{stats.todayExercises}</div>
                    <div className="stat-label">Bugünkü Egzersizler</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>📈</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.weeklyCompleted}/{stats.weeklyTotal}</div>
                    <div className="stat-label">Bu Hafta Tamamlanan</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.progressPercentage}%</div>
                    <div className="stat-label">Genel İlerleme</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>🔥</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.streak} gün</div>
                    <div className="stat-label">Streak</div>
                  </div>
                </div>
              </div>

              {/* Hızlı Erişim Butonları */}
              <div className="quick-actions">
                <button className="quick-action-btn primary" onClick={() => setShowExerciseProgram(true)}>
                  <span className="quick-action-icon">🏃‍♂️</span>
                  <div className="quick-action-text">
                    <div className="quick-action-title">Egzersiz Yap</div>
                    <div className="quick-action-subtitle">Bugünkü programını başlat</div>
                  </div>
                </button>
                <button className="quick-action-btn" onClick={() => setShowProgress(true)}>
                  <span className="quick-action-icon">📊</span>
                  <div className="quick-action-text">
                    <div className="quick-action-title">İlerlememi Gör</div>
                    <div className="quick-action-subtitle">Detaylı analiz</div>
                  </div>
                </button>
              </div>

              {/* Ana İçerik Grid */}
              <div className="dashboard-grid">
                {/* Sol Kolon */}
                <div className="dashboard-left">
                  {/* Bugünkü Görevler */}
                  <div className="task-card">
                    <div className="card-header">
                      <h3 className="card-title">📅 Bugünkü Görevler</h3>
                      <span className="card-badge">{todayTasks.filter(t => t.completed).length}/{todayTasks.length}</span>
                    </div>
                    <div className="task-list">
                      {todayTasks.map((task) => (
                        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                          <div className="task-checkbox" onClick={() => toggleTask(task.id)}>
                            {task.completed ? '✅' : '⭕'}
                          </div>
                          <div className="task-info">
                            <div className="task-name">{task.name}</div>
                            <div className="task-meta">
                              <span className="task-duration">⏱️ {task.duration}</span>
                              <span className="task-time">🕐 {task.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="task-view-all" onClick={() => setShowExerciseProgram(true)}>
                      Tüm Programı Gör →
                    </button>
                  </div>

                  {/* İlerleme Grafiği */}
                  <div className="progress-chart-card">
                    <div className="card-header">
                      <h3 className="card-title">📈 Haftalık İlerleme</h3>
                    </div>
                    <div className="chart-container">
                      <div className="chart-bars">
                        {progressData.map((item, idx) => (
                          <div key={idx} className="chart-bar-wrapper">
                            <div className="chart-bar" style={{ height: `${item.value}%` }}>
                              <span className="chart-value">{item.value}%</span>
                            </div>
                            <div className="chart-label">{item.day}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="chart-footer">
                      <div className="chart-stat">
                        <span className="chart-stat-label">Ortalama:</span>
                        <span className="chart-stat-value">{Math.round(progressData.reduce((a, b) => a + b.value, 0) / progressData.length)}%</span>
                      </div>
                      <div className="chart-stat">
                        <span className="chart-stat-label">En Yüksek:</span>
                        <span className="chart-stat-value">{Math.max(...progressData.map(d => d.value))}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="dashboard-right">
                  {/* Paket Durumu */}
                  <div className="package-status-card">
                    <div className="card-header">
                      <h3 className="card-title">📦 Aktif Paket</h3>
                      <span className="package-badge active" style={{
                        background: packageType === 'premium' ? '#fef3c7' : packageType === 'pro' ? '#dcfce7' : '#dbeafe',
                        color: packageType === 'premium' ? '#92400e' : packageType === 'pro' ? '#15803d' : '#1e40af'
                      }}>
                        {packageType === 'premium' ? '👑 Premium' : packageType === 'pro' ? '⭐ Klinik' : packageType === 'basic' ? '📦 Temel' : 'Aktif'}
                      </span>
                    </div>
                    <div className="package-info">
                      <div className="package-name">{packageInfo.name}</div>
                      <div className="package-dates">
                        <span>📅 {packageInfo.startDate} {packageInfo.endDate !== 'Tek Seferlik' ? `- ${packageInfo.endDate}` : ''}</span>
                      </div>
                      {packageInfo.daysRemaining !== null && (
                        <div className="package-countdown">
                          <span className="countdown-icon">⏳</span>
                          <span className="countdown-text">{packageInfo.daysRemaining} gün kaldı</span>
                        </div>
                      )}
                      <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 700, color: '#10b981' }}>
                        💰 {packageInfo.price}
                      </div>
                      <div className="package-features">
                        {packageInfo.features.map((feature, idx) => (
                          <div key={idx} className="package-feature">
                            <span>✓</span> {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="package-manage-btn" onClick={() => setShowPackages(true)}>
                      Paketi Yönet →
                    </button>
                  </div>

                  {/* Son Aktiviteler */}
                  <div className="activities-card">
                    <div className="card-header">
                      <h3 className="card-title">🕐 Son Aktiviteler</h3>
                    </div>
                    <div className="activities-list">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-icon">{activity.icon}</div>
                          <div className="activity-content">
                            <div className="activity-text">{activity.text}</div>
                            <div className="activity-time">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="activities-view-all">
                      Tüm Aktiviteleri Gör →
                    </button>
                  </div>

                </div>
              </div>
            </>
          ) : null}

          {/* Alt Bilgi Kartları */}
          <div className="info-cards">
            <div className="info-card video-card" onClick={() => setShowVideo(true)}>
              <div className="info-card-icon">🎬</div>
              <h3 id="video-title">{config.video_title}</h3>
              <p>1 dakikalık "Sistem Nasıl İşliyor?" videosunu izleyerek süreci daha iyi anlayabilirsiniz.</p>
            </div>
            <div className="info-card tip-card tip-carousel">
              <div className="info-card-icon">{healthTips[currentTipIndex].icon}</div>
              <h3 className="tip-title-animated">{healthTips[currentTipIndex].title}</h3>
              <p className="tip-text-animated">{healthTips[currentTipIndex].text}</p>
              <div className="tip-dots">
                {healthTips.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`tip-dot ${idx === currentTipIndex ? 'active' : ''}`}
                    onClick={() => setCurrentTipIndex(idx)}
                  />
                ))}
              </div>
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
        clinicalTestType={clinicalTestType}
        onClose={() => {
          setShowWizard(false);
          setClinicalTestType(null);
        }}
        onComplete={() => {
          setShowSummary(true);
        }}
      />
      <AnalysisSummary open={showSummary} onClose={() => setShowSummary(false)} onAddToCart={addToCart} cartItems={cart} />
      <SupportTicketModal open={showSupport} onClose={() => setShowSupport(false)} />
      <HelpFAQModal open={showFAQ} onClose={() => setShowFAQ(false)} onOpenSupport={() => setShowSupport(true)} />
      <PackagesModal 
        open={showPackages} 
        onClose={() => setShowPackages(false)} 
        onPurchase={(packageId?: string) => { 
          if (packageId === 'basic') updatePackageType('basic');
          else if (packageId === 'pro') updatePackageType('pro');
          else if (packageId === 'premium') updatePackageType('premium');
          setShowPackages(false); 
        }} 
        onCancelPackage={() => updatePackageType('none')} 
        hasPackage={hasPackage} 
        onAddToCart={addToCart} 
        cartItems={cart} 
      />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <VideoModal open={showVideo} onClose={() => setShowVideo(false)} />
      <ExerciseProgramModal open={showExerciseProgram} onClose={() => setShowExerciseProgram(false)} />
      <ProgressModal open={showProgress} onClose={() => setShowProgress(false)} />
      
      {/* Başarılar Modal */}
      {showBadgesModal && (
        <>
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2000,
            }}
            onClick={() => setShowBadgesModal(false)}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '85vh',
            overflowY: 'auto',
            zIndex: 2001,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                🏆 Başarılarım
              </h2>
              <button
                onClick={() => setShowBadgesModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
        </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
            }}>
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    background: badge.earned ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f9fafb',
                    border: `2px solid ${badge.earned ? '#f59e0b' : '#e5e7eb'}`,
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    position: 'relative',
                    opacity: badge.earned ? 1 : 0.7,
                    transition: 'all 0.2s',
                    cursor: badge.earned ? 'default' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!badge.earned) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!badge.earned) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{badge.icon}</div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: badge.earned ? '#92400e' : '#6b7280',
                    marginBottom: '6px',
                  }}>
                    {badge.name}
            </div>
                  {badge.description && (
                    <div style={{
                      fontSize: '11px',
                      color: badge.earned ? '#b45309' : '#9ca3af',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      minHeight: '30px',
                    }}>
                      {badge.description}
          </div>
                  )}
                  {!badge.earned && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '20px',
                      opacity: 0.5,
                    }}>
                      🔒
        </div>
      )}
                  {badge.earned && (
                    <div style={{
                      fontSize: '12px',
                      color: '#92400e',
                      fontWeight: 700,
                      marginTop: '8px',
                      background: 'rgba(251, 191, 36, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      display: 'inline-block',
                    }}>
                      ✓ Kazanıldı
            </div>
                  )}
    </div>
              ))}
      </div>
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              borderRadius: '16px',
              textAlign: 'center',
              border: '2px solid #fbbf24',
            }}>
              <div style={{ fontSize: '18px', color: '#92400e', fontWeight: 700, marginBottom: '6px' }}>
                {badges.filter(b => b.earned).length} / {badges.length} başarı kazandınız! 🎉
        </div>
              <div style={{ fontSize: '13px', color: '#b45309', marginTop: '4px' }}>
                Devam edin, daha fazla başarı sizi bekliyor! Her rozet seni hedefine bir adım daha yaklaştırıyor! 💪
        </div>
              <div style={{
                marginTop: '12px',
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '999px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(badges.filter(b => b.earned).length / badges.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease',
                }} />
      </div>
      </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
