import React, { useState, useEffect } from 'react';

// Safe value renderer - Objelerin React child olarak render edilmesini engeller
const safeRender = (value: any): string | number => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') {
    // Eğer objenin 'value' property'si varsa onu kullan
    if ('value' in value) return value.value;
    // Değilse JSON string olarak döndür
    return JSON.stringify(value);
  }
  return value;
};

// Ağrı şiddetini güvenli şekilde al
const getPainIntensity = (formData: any): number => {
  if (!formData?.painIntensity) return 0;
  if (typeof formData.painIntensity === 'number') return formData.painIntensity;
  if (typeof formData.painIntensity === 'object' && 'value' in formData.painIntensity) {
    return formData.painIntensity.value;
  }
  return 0;
};

// JSON Viewer Component - Renkli ve Katlanabilir
const JsonViewer: React.FC<{ data: any; level?: number }> = ({ data, level = 0 }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getTypeColor = (value: any): string => {
    if (value === null) return 'text-gray-500';
    if (typeof value === 'string') return 'text-green-400';
    if (typeof value === 'number') return 'text-blue-400';
    if (typeof value === 'boolean') return 'text-yellow-400';
    return 'text-white';
  };

  const getKeyLabel = (key: string): string => {
    const labels: Record<string, string> = {
      'gender': '👤 Cinsiyet',
      'age': '🎂 Yaş',
      'height': '📏 Boy',
      'weight': '⚖️ Kilo',
      'selectedAreas': '🎯 Seçilen Bölgeler',
      'painDuration': '⏱️ Ağrı Süresi',
      'painIntensity': '💢 Ağrı Şiddeti',
      'selectedPainTypes': '🔥 Ağrı Tipleri',
      'safetyAnswers': '🛡️ Güvenlik Cevapları',
      'selectedPackage': '📦 Seçilen Paket',
      'purchases': '💳 Satın Almalar',
      'exercisePrograms': '🏋️ Egzersiz Programları',
      'progressData': '📈 İlerleme Verileri',
      'assessmentResults': '📊 Değerlendirme Sonuçları',
      'formData': '📝 Form Verileri',
      'photos': '📸 Fotoğraflar',
      'name': '📛 İsim',
      'price': '💰 Fiyat',
      'features': '✨ Özellikler',
      'duration': '📅 Süre',
      'date': '📆 Tarih',
      'status': '📌 Durum',
      'workType': '💼 Meslek Tipi',
      'chronicConditions': '🏥 Kronik Durumlar',
      'medications': '💊 İlaçlar',
      'surgery': '🔪 Ameliyat',
      'chronic': '♿ Kronik',
      'heart': '❤️ Kalp',
      'pregnancy': '🤰 Hamilelik',
    };
    return labels[key] || key;
  };

  const renderValue = (value: any, key: string, path: string): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500 italic">boş</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-500">[ ]</span>;
      }
      
      const isCollapsed = collapsed[path];
      return (
        <div className="ml-4">
          <span 
            onClick={() => toggleCollapse(path)}
            className="cursor-pointer text-purple-400 hover:text-purple-300"
          >
            {isCollapsed ? '▶' : '▼'} [{value.length} öğe]
          </span>
          {!isCollapsed && (
            <div className="ml-4 border-l-2 border-gray-700 pl-3 mt-1">
              {value.map((item, i) => (
                <div key={i} className="py-1">
                  {typeof item === 'object' ? (
                    <JsonViewer data={item} level={level + 1} />
                  ) : (
                    <span className={`${getTypeColor(item)} bg-gray-800/50 px-2 py-0.5 rounded`}>
                      {String(item)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isCollapsed = collapsed[path];
      const keys = Object.keys(value);
      
      if (keys.length === 0) {
        return <span className="text-gray-500">{'{ }'}</span>;
      }

      return (
        <div className="ml-4">
          <span 
            onClick={() => toggleCollapse(path)}
            className="cursor-pointer text-purple-400 hover:text-purple-300"
          >
            {isCollapsed ? '▶' : '▼'} {'{'}...{'}'}
          </span>
          {!isCollapsed && (
            <div className="ml-4 border-l-2 border-gray-700 pl-3 mt-1">
              {keys.map((k) => (
                <div key={k} className="py-1 flex items-start gap-2">
                  <span className="text-pink-400 font-medium whitespace-nowrap">
                    {getKeyLabel(k)}:
                  </span>
                  {renderValue(value[k], k, `${path}.${k}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Primitive values
    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-0.5 rounded text-sm ${value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {value ? '✅ Evet' : '❌ Hayır'}
        </span>
      );
    }

    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      // Date string
      return (
        <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
          📆 {new Date(value).toLocaleString('tr-TR')}
        </span>
      );
    }

    return (
      <span className={`${getTypeColor(value)} bg-gray-800/50 px-2 py-0.5 rounded`}>
        {String(value)}
      </span>
    );
  };

  if (!data || typeof data !== 'object') {
    return <span className={getTypeColor(data)}>{String(data)}</span>;
  }

  return (
    <div className="font-mono text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="py-2 border-b border-gray-800 last:border-0">
          <div className="flex items-start gap-2">
            <span className="text-pink-400 font-semibold whitespace-nowrap">
              {getKeyLabel(key)}:
            </span>
            {renderValue(value, key, key)}
          </div>
        </div>
      ))}
    </div>
  );
};

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  dashboardData?: {
    assessmentResults?: any;
    exercisePrograms?: any[];
    progressData?: any;
    notifications?: any[];
    photos?: {
      front?: string;
      side?: string;
      back?: string;
    };
    formData?: any;
  };
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  usersWithData: number;
  newUsersLastWeek: number;
  newUsersLastMonth: number;
}

// Production URL - Hostinger'da çalışırken Railway backend'i kullan
const isProduction = typeof window !== 'undefined' && 
  !window.location.hostname.includes('localhost') && 
  !window.location.hostname.includes('127.0.0.1') &&
  window.location.hostname !== '';
const API_BASE_URL = isProduction 
  ? 'https://egzersizlab-clean-production.up.railway.app/api'
  : 'http://localhost:5000/api';

console.log('Admin Panel API URL:', API_BASE_URL, 'isProduction:', isProduction);

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [downloadingVideo, setDownloadingVideo] = useState<string | null>(null);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [exerciseProgram, setExerciseProgram] = useState({
    title: '',
    description: '',
    exercises: '',
    frequency: '3', // Haftalık seans
    duration: '4', // Hafta
    notes: ''
  });
  const [savingProgram, setSavingProgram] = useState(false);

  // Egzersiz programı kaydetme fonksiyonu
  const saveExerciseProgram = async () => {
    if (!selectedUser || !exerciseProgram.title || !exerciseProgram.exercises) {
      alert('Lütfen program başlığı ve egzersizleri doldurun.');
      return;
    }
    
    setSavingProgram(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}/exercise-program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({
          ...exerciseProgram,
          assignedAt: new Date().toISOString(),
          assignedBy: 'admin'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Egzersiz programı başarıyla atandı! ✅\nKullanıcı dashboard\'unda görecek.');
        setShowProgramModal(false);
        setExerciseProgram({ title: '', description: '', exercises: '', frequency: '3', duration: '4', notes: '' });
        loadUserDetail(selectedUser._id);
      } else {
        alert('Program atama hatası: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error('Program atama hatası:', err);
      alert('Program atarken bir hata oluştu');
    } finally {
      setSavingProgram(false);
    }
  };

  // Video indirme fonksiyonu
  const downloadVideo = async (userId: string, testType: string, testIndex: number, testName: string) => {
    const downloadId = `${testType}-${testIndex}`;
    setDownloadingVideo(downloadId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/video/${testType}/${testIndex}`, {
        headers: {
          'X-Admin-Token': adminToken,
        },
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.video) {
        // Base64 video verisini indir
        const link = document.createElement('a');
        link.href = data.data.video;
        link.download = `${testName || 'video'}_${new Date().toISOString().slice(0,10)}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Video indirilemedi: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error('Video indirme hatası:', err);
      alert('Video indirirken bir hata oluştu');
    } finally {
      setDownloadingVideo(null);
    }
  };

  // Kullanıcı verilerini silme fonksiyonu
  const clearUserData = async (dataType: 'all' | 'clinical' | 'photos' | 'form') => {
    if (!selectedUser) return;
    
    setClearingData(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}/clear-data`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ dataType }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Veriler başarıyla silindi!');
        setShowClearDataModal(false);
        // Kullanıcı detaylarını yeniden yükle
        loadUserDetail(selectedUser._id);
      } else {
        alert('Veri silme hatası: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error('Veri silme hatası:', err);
      alert('Veriler silinirken bir hata oluştu');
    } finally {
      setClearingData(false);
    }
  };

  // Program silme fonksiyonu
  const deleteExerciseProgram = async (programIndex: number) => {
    if (!selectedUser) return;
    
    if (!confirm('Bu egzersiz programını silmek istediğinize emin misiniz?')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}/delete-program`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ programIndex }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Program başarıyla silindi!');
        // Kullanıcı detaylarını yeniden yükle
        loadUserDetail(selectedUser._id);
      } else {
        alert('Program silme hatası: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error('Program silme hatası:', err);
      alert('Program silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Load data when logged in
  useEffect(() => {
    if (isLoggedIn && adminToken) {
      loadStats();
      loadUsers();
    }
  }, [isLoggedIn, adminToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setIsLoggedIn(false);
    setUsers([]);
    setStats(null);
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Stats yüklenemedi:', err);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Kullanıcılar yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetail = async (userId: string) => {
    setLoading(true);
    setPageError(null);
    try {
      console.log('Kullanıcı detayı yükleniyor:', userId);
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await response.json();
      console.log('Kullanıcı verisi alındı:', data.success);
      
      if (data.success) {
        const userData = data.data;
        console.log('Dashboard data var mı:', !!userData.dashboardData);
        setSelectedUser(userData);
        setView('detail');
      } else {
        setPageError(data.error || 'Kullanıcı yüklenemedi');
      }
    } catch (err: any) {
      console.error('Kullanıcı detayı yüklenemedi:', err);
      setPageError('Kullanıcı detayları yüklenirken hata: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await response.json();
      if (data.success) {
        loadUsers();
        if (selectedUser?._id === userId) {
          setSelectedUser(null);
          setView('list');
        }
      }
    } catch (err) {
      console.error('Kullanıcı silinemedi:', err);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}/notes`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken 
        },
        body: JSON.stringify({ 
          adminNotes: adminNotes,
          noteDate: new Date().toISOString()
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Notlar kaydedildi!');
        loadUserDetail(selectedUser._id);
        setShowNotesModal(false);
      }
    } catch (err) {
      console.error('Not kaydedilemedi:', err);
    }
  };

  const assignPackage = async (packageType: string) => {
    if (!selectedUser) return;

    const packages: Record<string, any> = {
      'starter': {
        name: 'Başlangıç Paketi',
        price: 299,
        duration: '1 Ay',
        features: ['Temel Egzersiz Programı', 'Haftalık Takip', 'E-posta Desteği']
      },
      'pro': {
        name: 'Pro Paket',
        price: 599,
        duration: '3 Ay',
        features: ['Kişiselleştirilmiş Program', 'Haftalık Video Görüşme', '7/24 Destek', 'Beslenme Önerileri']
      },
      'premium': {
        name: 'Premium Paket',
        price: 999,
        duration: '6 Ay',
        features: ['VIP Kişisel Antrenör', 'Günlük Takip', 'Sınırsız Video Görüşme', 'Tam Beslenme Planı', 'Özel Egzersiz Videoları', 'Öncelikli Destek']
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}/package`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken 
        },
        body: JSON.stringify({ 
          selectedPackage: packages[packageType],
          purchases: [
            {
              name: packages[packageType].name,
              price: packages[packageType].price,
              date: new Date().toISOString(),
              status: 'completed'
            }
          ]
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`${packages[packageType].name} başarıyla atandı!`);
        loadUserDetail(selectedUser._id);
        setShowPackageModal(false);
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (err) {
      console.error('Paket atanamadı:', err);
      alert('Paket atanırken bir hata oluştu');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-purple-500/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
            <p className="text-gray-400 mt-2">EgzersizLab Yönetim</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Admin Şifresi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-gray-400 hover:text-white text-sm">
              ← Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Error Banner */}
      {pageError && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 m-4 rounded-lg">
          <strong>Hata:</strong> {pageError}
          <button 
            onClick={() => setPageError(null)} 
            className="ml-4 text-red-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EgzersizLab Admin</h1>
              <p className="text-sm text-gray-400">Yönetim Paneli</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => { loadStats(); loadUsers(); }}
              className="text-gray-400 hover:text-white transition-colors"
              title="Yenile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
              <div className="text-sm text-gray-400">Toplam Kullanıcı</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
              <div className="text-3xl font-bold text-green-400">{stats.activeUsers}</div>
              <div className="text-sm text-gray-400">Aktif Kullanıcı</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">{stats.usersWithData}</div>
              <div className="text-sm text-gray-400">Veri Girişi Yapan</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/30">
              <div className="text-3xl font-bold text-yellow-400">{stats.newUsersLastWeek}</div>
              <div className="text-sm text-gray-400">Son 7 Gün</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-pink-500/30">
              <div className="text-3xl font-bold text-pink-400">{stats.newUsersLastMonth}</div>
              <div className="text-sm text-gray-400">Son 30 Gün</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className={`${view === 'detail' ? 'hidden lg:block' : ''} lg:col-span-1`}>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-purple-500/30 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-3">Kullanıcılar ({users.length})</h2>
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-400">Yükleniyor...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">Kullanıcı bulunamadı</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => loadUserDetail(user._id)}
                      className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-colors ${
                        selectedUser?._id === user._id ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{user.name}</div>
                          <div className="text-gray-400 text-sm truncate">{user.email}</div>
                        </div>
                        {user.dashboardData?.photos && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Fotoğraf var" />
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Kayıt: {formatDate(user.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* User Detail */}
          <div className={`${view === 'list' && !selectedUser ? 'hidden lg:block' : ''} lg:col-span-2`}>
            {loading && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8 flex items-center justify-center">
                <div className="text-white">Yükleniyor...</div>
              </div>
            )}
            {!loading && selectedUser ? (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-purple-500/30 overflow-hidden">
                {/* Detail Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setView('list'); setSelectedUser(null); }}
                      className="lg:hidden text-gray-400 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedUser.name}</h2>
                      <p className="text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowProgramModal(true)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      📋 Program Ata
                    </button>
                    <button
                      onClick={() => setShowPackageModal(true)}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      📦 Paket Ata
                    </button>
                    <button
                      onClick={() => {
                        setAdminNotes(selectedUser.dashboardData?.adminNotes || '');
                        setShowNotesModal(true);
                      }}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      📝 Not Ekle
                    </button>
                    <button
                      onClick={() => setShowClearDataModal(true)}
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      🗑️ Verileri Sil
                    </button>
                    <button
                      onClick={() => deleteUser(selectedUser._id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      ❌ Hesabı Sil
                    </button>
                  </div>
                </div>

                <div className="p-4 max-h-[600px] overflow-y-auto">
                  {/* Admin Notes Banner */}
                  {selectedUser.dashboardData?.adminNotes && (
                    <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-blue-400 font-medium">📝 Admin Notları</h4>
                        {selectedUser.dashboardData.adminNoteDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(selectedUser.dashboardData.adminNoteDate).toLocaleString('tr-TR')}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {selectedUser.dashboardData.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Telefon</div>
                      <div className="text-white">{selectedUser.phone || 'Belirtilmemiş'}</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Durum</div>
                      <div className={selectedUser.isActive ? 'text-green-400' : 'text-red-400'}>
                        {selectedUser.isActive ? 'Aktif' : 'Pasif'}
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Kayıt Tarihi</div>
                      <div className="text-white">{formatDate(selectedUser.createdAt)}</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Son Güncelleme</div>
                      <div className="text-white">{formatDate(selectedUser.updatedAt)}</div>
                    </div>
                  </div>

                  {/* Photos */}
                  {selectedUser.dashboardData?.photos && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📸 Fotoğraflar</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedUser.dashboardData.photos.front && (
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Önden</div>
                            <img
                              src={selectedUser.dashboardData.photos.front}
                              alt="Önden"
                              className="w-full h-40 object-cover rounded-lg border border-gray-600"
                            />
                          </div>
                        )}
                        {selectedUser.dashboardData.photos.side && (
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Yandan</div>
                            <img
                              src={selectedUser.dashboardData.photos.side}
                              alt="Yandan"
                              className="w-full h-40 object-cover rounded-lg border border-gray-600"
                            />
                          </div>
                        )}
                        {selectedUser.dashboardData.photos.back && (
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Arkadan</div>
                            <img
                              src={selectedUser.dashboardData.photos.back}
                              alt="Arkadan"
                              className="w-full h-40 object-cover rounded-lg border border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assessment Results - Düzenli Görünüm */}
                  {selectedUser.dashboardData?.assessmentResults && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📊 Değerlendirme Sonuçları</h3>
                      
                      {/* Form Data */}
                      {selectedUser.dashboardData.assessmentResults.formData && (
                        <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                          <h4 className="text-md font-medium text-purple-400 mb-3">👤 Kişisel Bilgiler</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-gray-600/30 rounded p-2">
                              <span className="text-gray-400 text-xs">Cinsiyet</span>
                              <p className="text-white">{selectedUser.dashboardData.assessmentResults.formData.gender === 'male' ? '👨 Erkek' : '👩 Kadın'}</p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-2">
                              <span className="text-gray-400 text-xs">Yaş</span>
                              <p className="text-white">{selectedUser.dashboardData.assessmentResults.formData.age} yaş</p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-2">
                              <span className="text-gray-400 text-xs">Boy</span>
                              <p className="text-white">{selectedUser.dashboardData.assessmentResults.formData.height} cm</p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-2">
                              <span className="text-gray-400 text-xs">Kilo</span>
                              <p className="text-white">{selectedUser.dashboardData.assessmentResults.formData.weight} kg</p>
                            </div>
                          </div>
                          
                          {selectedUser.dashboardData.assessmentResults.formData.occupation && (
                            <div className="mt-3 bg-gray-600/30 rounded p-2">
                              <span className="text-gray-400 text-xs">Meslek</span>
                              <p className="text-white">{selectedUser.dashboardData.assessmentResults.formData.occupation}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Selected Areas */}
                      {selectedUser.dashboardData.assessmentResults.formData?.selectedAreas && (
                        <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                          <h4 className="text-md font-medium text-red-400 mb-3">🎯 Seçilen Ağrı Bölgeleri</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.dashboardData.assessmentResults.formData.selectedAreas.map((area: string, i: number) => (
                              <span key={i} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm border border-red-500/30">
                                {area.replace(/-/g, ' ').replace(/left/g, '(Sol)').replace(/right/g, '(Sağ)').replace(/front/g, 'Ön').replace(/back/g, 'Arka')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pain Info */}
                      {selectedUser.dashboardData.assessmentResults.formData && (
                        <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                          <h4 className="text-md font-medium text-yellow-400 mb-3">⚡ Ağrı Bilgileri</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-gray-600/30 rounded p-3">
                              <span className="text-gray-400 text-xs">Ağrı Süresi</span>
                              <p className="text-white text-lg">
                                {selectedUser.dashboardData.assessmentResults.formData.painDuration === 'acute' ? '🔴 Akut (0-6 hafta)' : 
                                 selectedUser.dashboardData.assessmentResults.formData.painDuration === 'subacute' ? '🟠 Subakut (6-12 hafta)' : 
                                 selectedUser.dashboardData.assessmentResults.formData.painDuration === 'moderate' ? '🟡 Orta (3-6 ay)' : 
                                 '🔵 Kronik (6+ ay)'}
                              </p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-3">
                              <span className="text-gray-400 text-xs">Ağrı Şiddeti</span>
                              <p className="text-white text-lg">
                                <span className={`font-bold ${
                                  getPainIntensity(selectedUser.dashboardData.assessmentResults.formData) <= 3 ? 'text-green-400' :
                                  getPainIntensity(selectedUser.dashboardData.assessmentResults.formData) <= 6 ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {getPainIntensity(selectedUser.dashboardData.assessmentResults.formData)}/10
                                </span>
                              </p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-3">
                              <span className="text-gray-400 text-xs">Ağrı Tipleri</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedUser.dashboardData.assessmentResults.formData.selectedPainTypes?.map((type: string, i: number) => (
                                  <span key={i} className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-xs">
                                    {type === 'burning' ? '🔥 Yanma' : 
                                     type === 'sharp' ? '⚡ Keskin' : 
                                     type === 'dull' ? '😑 Künt' : 
                                     type === 'throbbing' ? '💓 Zonklama' : 
                                     type === 'tingling' ? '✨ Karıncalanma' : type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Safety Answers */}
                      {selectedUser.dashboardData.assessmentResults.formData?.safetyAnswers && (
                        <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                          <h4 className="text-md font-medium text-green-400 mb-3">🛡️ Güvenlik Soruları</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {Object.entries(selectedUser.dashboardData.assessmentResults.formData.safetyAnswers).map(([key, value]) => (
                              <div key={key} className={`rounded p-2 ${value === 'yes' ? 'bg-red-500/20 border border-red-500/30' : 'bg-green-500/20 border border-green-500/30'}`}>
                                <span className="text-gray-300 text-xs capitalize">
                                  {key === 'surgery' ? 'Ameliyat' : 
                                   key === 'chronic' ? 'Kronik Hastalık' : 
                                   key === 'heart' ? 'Kalp Sorunu' : 
                                   key === 'pregnancy' ? 'Hamilelik' : key}
                                </span>
                                <p className={`font-medium ${value === 'yes' ? 'text-red-400' : 'text-green-400'}`}>
                                  {value === 'yes' ? '⚠️ Evet' : '✅ Hayır'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Package */}
                  {selectedUser.dashboardData?.selectedPackage && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📦 Seçilen Paket</h3>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-white">
                              {selectedUser.dashboardData.selectedPackage.name || selectedUser.dashboardData.selectedPackage}
                            </h4>
                            {selectedUser.dashboardData.selectedPackage.price && (
                              <p className="text-2xl font-bold text-green-400 mt-1">
                                {selectedUser.dashboardData.selectedPackage.price} ₺
                              </p>
                            )}
                          </div>
                          <div className="text-4xl">
                            {selectedUser.dashboardData.selectedPackage.name?.includes('Premium') ? '👑' : 
                             selectedUser.dashboardData.selectedPackage.name?.includes('Pro') ? '⭐' : '📋'}
                          </div>
                        </div>
                        {selectedUser.dashboardData.selectedPackage.features && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <p className="text-gray-400 text-sm mb-2">Özellikler:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedUser.dashboardData.selectedPackage.features.map((feature: string, i: number) => (
                                <span key={i} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                                  ✓ {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Purchase History */}
                  {selectedUser.dashboardData?.purchases && selectedUser.dashboardData.purchases.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">💳 Satın Alma Geçmişi</h3>
                      <div className="space-y-2">
                        {selectedUser.dashboardData.purchases.map((purchase: any, i: number) => (
                          <div key={i} className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{safeRender(purchase.name || purchase.item)}</p>
                              <p className="text-gray-400 text-sm">
                                {purchase.date ? new Date(purchase.date).toLocaleDateString('tr-TR') : 'Tarih yok'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-bold">{safeRender(purchase.price || purchase.amount)} ₺</p>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                purchase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                purchase.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {purchase.status === 'completed' ? '✓ Tamamlandı' : 
                                 purchase.status === 'pending' ? '⏳ Bekliyor' : safeRender(purchase.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clinical Test Results - Detailed View */}
                  {(selectedUser.dashboardData?.clinicalAssessments || selectedUser.dashboardData?.assessmentResults?.clinicalTests) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">🔬 Klinik Test Sonuçları</h3>
                      
                      {/* Clinical Assessments from new structure */}
                      {selectedUser.dashboardData?.clinicalAssessments && (
                        <div className="space-y-4">
                          {Object.entries(selectedUser.dashboardData.clinicalAssessments).map(([testType, testData]: [string, any]) => (
                            <div key={testType} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                              <h4 className="text-lg font-medium text-purple-400 mb-3 flex items-center gap-2">
                                {testType === 'strength' ? '💪 Kas Kuvveti Testleri' :
                                 testType === 'flexibility' ? '🧘 Esneklik Testleri' :
                                 testType === 'balance' ? '⚖️ Denge Testleri' :
                                 testType === 'neurodynamic' ? '🔌 Nörodinamik Testler' :
                                 testType === 'rom' ? '📐 Eklem Hareket Açıklığı' :
                                 testType === 'movement' ? '🏃 Hareket Analizi' : testType}
                              </h4>
                              
                              {Array.isArray(testData) ? (
                                <div className="space-y-3">
                                  {testData.map((test: any, i: number) => (
                                    <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-medium">{test.testName || test.name || test.testId}</span>
                                        {test.result && (
                                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            test.result === 'good' || test.result === 'normal' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            test.result === 'moderate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            test.result === 'poor' || test.result === 'positive' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                            'bg-gray-500/20 text-gray-400'
                                          }`}>
                                            {test.result === 'good' ? '✅ İyi' :
                                             test.result === 'normal' ? '✅ Normal' :
                                             test.result === 'moderate' ? '⚠️ Orta' :
                                             test.result === 'poor' ? '❌ Zayıf' :
                                             test.result === 'positive' ? '⚠️ Pozitif' :
                                             safeRender(test.result)}
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Measurement values */}
                                      {(test.value || test.leftValue || test.rightValue || test.time) && (
                                        <div className="flex gap-4 mb-2 text-sm">
                                          {test.value && (
                                            <span className="text-blue-400">📏 Değer: {safeRender(test.value)} {test.unit || ''}</span>
                                          )}
                                          {test.leftValue && (
                                            <span className="text-blue-400">⬅️ Sol: {safeRender(test.leftValue)} {test.unit || 'cm'}</span>
                                          )}
                                          {test.rightValue && (
                                            <span className="text-blue-400">➡️ Sağ: {safeRender(test.rightValue)} {test.unit || 'cm'}</span>
                                          )}
                                          {test.time && (
                                            <span className="text-cyan-400">⏱️ Süre: {safeRender(test.time)} sn</span>
                                          )}
                                        </div>
                                      )}
                                      
                                      {/* Response for neurodynamic tests */}
                                      {test.response && (
                                        <div className="text-sm mb-2">
                                          <span className="text-gray-400">Yanıt: </span>
                                          <span className={`${
                                            String(test.response).includes('elektrik') || String(test.response).includes('ağrı') 
                                              ? 'text-red-400' : 'text-green-400'
                                          }`}>
                                            {safeRender(test.response)}
                                          </span>
                                        </div>
                                      )}
                                      
                                      {/* Video/Photo */}
                                      {(test.videoUrl || test.video || test.hasVideo || test.photoUrl || test.photo) && (
                                        <div className="mt-3 p-2 bg-gray-900/50 rounded border border-gray-700">
                                          <p className="text-xs text-gray-400 mb-2">📹 Kayıt:</p>
                                          {(test.hasVideo || test.videoUrl || test.video) && (
                                            <div className="bg-blue-500/20 text-blue-400 p-3 rounded text-sm">
                                              <div className="flex items-center justify-between">
                                                <div>
                                                  ✅ Video kaydedildi {test.videoSize && `(${test.videoSize})`}
                                                  <br />
                                                  <span className="text-xs text-gray-400">
                                                    Videoyu görüntülemek için indirin
                                                  </span>
                                                </div>
                                                <button
                                                  onClick={() => {
                                                    if (selectedUser) {
                                                      downloadVideo(
                                                        selectedUser._id, 
                                                        testType, 
                                                        i, 
                                                        test.testName || test.name || 'video'
                                                      );
                                                    }
                                                  }}
                                                  disabled={downloadingVideo === `${testType}-${i}`}
                                                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-wait text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                                                >
                                                  {downloadingVideo === `${testType}-${i}` ? '⏳ İndiriliyor...' : '⬇️ İndir'}
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                          {(test.photoUrl || test.photo) && (
                                            <div className="mt-2">
                                              <img 
                                                src={test.photoUrl || test.photo} 
                                                alt="Test fotoğrafı"
                                                className="w-full max-h-48 object-contain rounded"
                                              />
                                              <button
                                                onClick={() => {
                                                  const photoData = test.photoUrl || test.photo;
                                                  if (photoData) {
                                                    const link = document.createElement('a');
                                                    link.href = photoData;
                                                    link.download = `${test.name || test.id || 'photo'}_${new Date().toISOString().slice(0,10)}.jpg`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                  }
                                                }}
                                                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                                              >
                                                📷 Fotoğrafı İndir
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      
                                      {/* Notes */}
                                      {test.notes && (
                                        <div className="mt-2 text-sm text-gray-400 italic">
                                          📝 Not: {safeRender(test.notes)}
                                        </div>
                                      )}
                                      
                                      {/* Date */}
                                      {test.date && (
                                        <div className="mt-2 text-xs text-gray-500">
                                          📅 {new Date(test.date).toLocaleString('tr-TR')}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : typeof testData === 'object' ? (
                                <div className="bg-gray-800/50 rounded p-3">
                                  <pre className="text-xs text-gray-400 overflow-x-auto">
                                    {JSON.stringify(testData, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                <p className="text-gray-400">{String(testData)}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Legacy clinical tests structure */}
                      {selectedUser.dashboardData?.assessmentResults?.clinicalTests && 
                       !selectedUser.dashboardData?.clinicalAssessments && (
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(selectedUser.dashboardData.assessmentResults.clinicalTests, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Exercise Programs */}
                  {selectedUser.dashboardData?.exercisePrograms && selectedUser.dashboardData.exercisePrograms.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">🏋️ Egzersiz Programları</h3>
                      <div className="space-y-3">
                        {selectedUser.dashboardData.exercisePrograms.map((program: any, i: number) => (
                          <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium">{program.title || program.name || `Program ${i + 1}`}</h4>
                              <div className="flex items-center gap-2">
                                {program.status && (
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    program.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    program.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {program.status === 'active' ? '🟢 Aktif' : 
                                     program.status === 'completed' ? '✅ Tamamlandı' : safeRender(program.status)}
                                  </span>
                                )}
                                <button
                                  onClick={() => deleteExerciseProgram(i)}
                                  className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors"
                                  title="Programı Sil"
                                >
                                  🗑️ Sil
                                </button>
                              </div>
                            </div>
                            
                            {/* Exercises in program */}
                            {program.exercises && (
                              <div className="mt-3 p-3 bg-gray-800/50 rounded border border-gray-700">
                                <h5 className="text-gray-300 font-medium mb-2">Egzersizler:</h5>
                                {typeof program.exercises === 'string' ? (
                                  <pre className="text-xs text-gray-400 whitespace-pre-wrap">{program.exercises}</pre>
                                ) : Array.isArray(program.exercises) ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {program.exercises.map((exercise: any, j: number) => (
                                      <div key={j} className="bg-gray-600/30 rounded p-2 flex items-center gap-2">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                          exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
                                        }`}>
                                          {exercise.completed ? '✓' : j + 1}
                                        </span>
                                        <div className="flex-1">
                                          <p className="text-white text-sm">{safeRender(exercise.name)}</p>
                                          {exercise.sets && exercise.reps && (
                                            <p className="text-gray-400 text-xs">{safeRender(exercise.sets)} set × {safeRender(exercise.reps)} tekrar</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-xs">Egzersiz bilgisi yok</p>
                                )}
                              </div>
                            )}
                            
                            {/* Progress bar */}
                            {program.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>İlerleme</span>
                                  <span>{program.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                    style={{ width: `${program.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Data / Completed Exercises */}
                  {selectedUser.dashboardData?.progressData && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📈 İlerleme & Tamamlanan Egzersizler</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        {/* Stats summary */}
                        {(selectedUser.dashboardData.progressData.totalExercises || 
                          selectedUser.dashboardData.progressData.completedExercises ||
                          selectedUser.dashboardData.progressData.totalDays) && (
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-gray-600/30 rounded p-3 text-center">
                              <p className="text-2xl font-bold text-purple-400">
                                {selectedUser.dashboardData.progressData.completedExercises || 0}
                              </p>
                              <p className="text-gray-400 text-xs">Tamamlanan</p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-3 text-center">
                              <p className="text-2xl font-bold text-blue-400">
                                {selectedUser.dashboardData.progressData.totalExercises || 0}
                              </p>
                              <p className="text-gray-400 text-xs">Toplam Egzersiz</p>
                            </div>
                            <div className="bg-gray-600/30 rounded p-3 text-center">
                              <p className="text-2xl font-bold text-green-400">
                                {selectedUser.dashboardData.progressData.totalDays || 0}
                              </p>
                              <p className="text-gray-400 text-xs">Aktif Gün</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Completed exercises list */}
                        {selectedUser.dashboardData.progressData.completedList && (
                          <div>
                            <p className="text-gray-400 text-sm mb-2">Son Yapılan Egzersizler:</p>
                            <div className="space-y-1">
                              {selectedUser.dashboardData.progressData.completedList.slice(0, 10).map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-gray-600/30 rounded p-2">
                                  <span className="text-white text-sm">{item.name || item}</span>
                                  {item.date && (
                                    <span className="text-gray-400 text-xs">
                                      {new Date(item.date).toLocaleDateString('tr-TR')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Raw progress data if different structure */}
                        {!selectedUser.dashboardData.progressData.completedExercises && 
                         !selectedUser.dashboardData.progressData.completedList && (
                          <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(selectedUser.dashboardData.progressData, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Activity Log */}
                  {selectedUser.dashboardData?.activityLog && selectedUser.dashboardData.activityLog.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📋 Aktivite Geçmişi</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {selectedUser.dashboardData.activityLog.slice(0, 20).map((activity: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-600/50 pb-2 last:border-0">
                              <span className="text-gray-500 text-xs">
                                {activity.date ? new Date(activity.date).toLocaleString('tr-TR') : ''}
                              </span>
                              <span className="text-white">{activity.action || activity.message || activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw Dashboard Data - Collapsible & Simple */}
                  <details className="group">
                    <summary className="text-lg font-semibold text-white mb-3 cursor-pointer flex items-center gap-2 hover:text-purple-400 transition-colors">
                      <span className="transform group-open:rotate-90 transition-transform">▶</span>
                      🗂️ Tüm Dashboard Verileri (Ham JSON)
                    </summary>
                    <div className="bg-gray-900/80 rounded-lg p-4 mt-2 border border-gray-700">
                      <div className="max-h-[500px] overflow-y-auto">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                          {selectedUser.dashboardData 
                            ? JSON.stringify(selectedUser.dashboardData, null, 2)
                            : 'Veri yok'}
                        </pre>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-400">Detayları görmek için bir kullanıcı seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Package Assignment Modal */}
      {showPackageModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                📦 {selectedUser.name} için Paket Ata
              </h3>
              <button 
                onClick={() => setShowPackageModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter Package */}
              <div 
                onClick={() => assignPackage('starter')}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-blue-500 cursor-pointer transition-all hover:scale-105"
              >
                <div className="text-3xl mb-2">📋</div>
                <h4 className="text-lg font-bold text-white">Başlangıç</h4>
                <p className="text-2xl font-bold text-blue-400 my-2">299 ₺</p>
                <p className="text-gray-400 text-sm mb-3">1 Ay</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>✓ Temel Egzersiz Programı</li>
                  <li>✓ Haftalık Takip</li>
                  <li>✓ E-posta Desteği</li>
                </ul>
              </div>

              {/* Pro Package */}
              <div 
                onClick={() => assignPackage('pro')}
                className="bg-gray-700/50 rounded-xl p-4 border border-yellow-500/50 hover:border-yellow-500 cursor-pointer transition-all hover:scale-105 relative"
              >
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                  POPÜLER
                </div>
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="text-lg font-bold text-white">Pro</h4>
                <p className="text-2xl font-bold text-yellow-400 my-2">599 ₺</p>
                <p className="text-gray-400 text-sm mb-3">3 Ay</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>✓ Kişiselleştirilmiş Program</li>
                  <li>✓ Haftalık Video Görüşme</li>
                  <li>✓ 7/24 Destek</li>
                  <li>✓ Beslenme Önerileri</li>
                </ul>
              </div>

              {/* Premium Package */}
              <div 
                onClick={() => assignPackage('premium')}
                className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500 hover:border-pink-500 cursor-pointer transition-all hover:scale-105 relative"
              >
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                  VIP
                </div>
                <div className="text-3xl mb-2">👑</div>
                <h4 className="text-lg font-bold text-white">Premium</h4>
                <p className="text-2xl font-bold text-purple-400 my-2">999 ₺</p>
                <p className="text-gray-400 text-sm mb-3">6 Ay</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>✓ VIP Kişisel Antrenör</li>
                  <li>✓ Günlük Takip</li>
                  <li>✓ Sınırsız Video Görüşme</li>
                  <li>✓ Tam Beslenme Planı</li>
                  <li>✓ Özel Egzersiz Videoları</li>
                  <li>✓ Öncelikli Destek</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-500 text-center text-sm mt-4">
              Bir pakete tıklayarak kullanıcıya atayabilirsiniz
            </p>
          </div>
        </div>
      )}

      {/* Admin Notes Modal */}
      {showNotesModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-blue-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                📝 {selectedUser.name} için Admin Notları
              </h3>
              <button 
                onClick={() => setShowNotesModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                Değerlendirme Notları (Sadece admin görebilir)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full h-48 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-blue-500"
                placeholder="Kullanıcı hakkında notlarınızı buraya yazın...

Örnek:
- Klinik test değerlendirmesi
- Önerilen egzersiz programı
- Dikkat edilmesi gerekenler
- Sonraki görüşme notları"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveAdminNotes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Program Modal */}
      {showProgramModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-3xl border border-green-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                📋 {selectedUser.name} için Egzersiz Programı
              </h3>
              <button 
                onClick={() => setShowProgramModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Program Başlığı */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Program Başlığı *
                </label>
                <input
                  type="text"
                  value={exerciseProgram.title}
                  onChange={(e) => setExerciseProgram({...exerciseProgram, title: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  placeholder="Örn: Baldır-Ayak Bileği Güçlendirme Programı"
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Program Açıklaması
                </label>
                <textarea
                  value={exerciseProgram.description}
                  onChange={(e) => setExerciseProgram({...exerciseProgram, description: e.target.value})}
                  className="w-full h-20 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-green-500"
                  placeholder="Bu program ne için tasarlandı, hedefler neler..."
                />
              </div>

              {/* Sıklık ve Süre */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Haftalık Seans
                  </label>
                  <select
                    value={exerciseProgram.frequency}
                    onChange={(e) => setExerciseProgram({...exerciseProgram, frequency: e.target.value})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="2">2 gün/hafta</option>
                    <option value="3">3 gün/hafta</option>
                    <option value="4">4 gün/hafta</option>
                    <option value="5">5 gün/hafta</option>
                    <option value="7">Her gün</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Program Süresi
                  </label>
                  <select
                    value={exerciseProgram.duration}
                    onChange={(e) => setExerciseProgram({...exerciseProgram, duration: e.target.value})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="2">2 hafta</option>
                    <option value="4">4 hafta</option>
                    <option value="6">6 hafta</option>
                    <option value="8">8 hafta</option>
                    <option value="12">12 hafta</option>
                  </select>
                </div>
              </div>

              {/* Egzersizler - Ana Editör */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Egzersizler * (Her satıra bir egzersiz yazın)
                </label>
                <textarea
                  value={exerciseProgram.exercises}
                  onChange={(e) => setExerciseProgram({...exerciseProgram, exercises: e.target.value})}
                  className="w-full h-64 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-green-500"
                  placeholder={`Örnek format:

1. ISSINMA (5 dk)
   - Yerinde yürüyüş: 2 dakika
   - Ayak bileği çevirme: 10 tur her yön

2. ANA EGZERSİZLER
   - Topuk kaldırma: 3 set x 15 tekrar
   - Tek ayak denge: 3 set x 30 saniye
   - Baldır germe (duvara): 3 set x 30 saniye

3. SOĞUMA (5 dk)
   - Derin nefes egzersizi
   - Hafif germe hareketleri

📌 Notlar:
- Ağrı hissederseniz egzersizi bırakın
- Her egzersiz arasında 30 sn dinlenin`}
                />
              </div>

              {/* Özel Notlar */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Kullanıcıya Özel Notlar
                </label>
                <textarea
                  value={exerciseProgram.notes}
                  onChange={(e) => setExerciseProgram({...exerciseProgram, notes: e.target.value})}
                  className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-green-500"
                  placeholder="Test sonuçlarına göre özel uyarılar, dikkat edilmesi gerekenler..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProgramModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveExerciseProgram}
                disabled={savingProgram || !exerciseProgram.title || !exerciseProgram.exercises}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingProgram ? '⏳ Kaydediliyor...' : '✅ Programı Ata'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Modal */}
      {showClearDataModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-orange-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                🗑️ {selectedUser.name} Verilerini Sil
              </h3>
              <button 
                onClick={() => setShowClearDataModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-400 mb-4">
              Silmek istediğiniz veri türünü seçin. Bu işlem geri alınamaz!
            </p>

            <div className="space-y-3">
              <button
                onClick={() => clearUserData('clinical')}
                disabled={clearingData}
                className="w-full p-4 bg-gray-700/50 hover:bg-orange-500/20 border border-gray-600 hover:border-orange-500/50 rounded-lg text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔬</span>
                  <div>
                    <p className="text-white font-medium">Klinik Test Sonuçları</p>
                    <p className="text-gray-400 text-sm">Tüm testler ve videolar silinir</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => clearUserData('photos')}
                disabled={clearingData}
                className="w-full p-4 bg-gray-700/50 hover:bg-orange-500/20 border border-gray-600 hover:border-orange-500/50 rounded-lg text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <p className="text-white font-medium">Fotoğraflar</p>
                    <p className="text-gray-400 text-sm">Ön, yan ve arka fotoğraflar silinir</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => clearUserData('form')}
                disabled={clearingData}
                className="w-full p-4 bg-gray-700/50 hover:bg-orange-500/20 border border-gray-600 hover:border-orange-500/50 rounded-lg text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="text-white font-medium">Form Verileri</p>
                    <p className="text-gray-400 text-sm">Değerlendirme formu verileri silinir</p>
                  </div>
                </div>
              </button>

              <hr className="border-gray-600 my-4" />

              <button
                onClick={() => clearUserData('all')}
                disabled={clearingData}
                className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-red-400 font-medium">TÜM VERİLERİ SİL</p>
                    <p className="text-gray-400 text-sm">Hesap kalır, tüm dashboard verileri silinir</p>
                  </div>
                </div>
              </button>
            </div>

            {clearingData && (
              <div className="mt-4 text-center text-orange-400">
                ⏳ Veriler siliniyor...
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowClearDataModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

