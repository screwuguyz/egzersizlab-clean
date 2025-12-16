import React, { useState, useEffect } from 'react';

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
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction 
  ? 'https://egzersizlab-clean-production.up.railway.app/api'
  : 'http://localhost:5000/api';

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
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { 'X-Admin-Token': adminToken },
      });
      const data = await response.json();
      if (data.success) {
        setSelectedUser(data.data);
        setView('detail');
      }
    } catch (err) {
      console.error('Kullanıcı detayı yüklenemedi:', err);
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
            {selectedUser ? (
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
                  <button
                    onClick={() => deleteUser(selectedUser._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    Sil
                  </button>
                </div>

                <div className="p-4 max-h-[600px] overflow-y-auto">
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

                  {/* Assessment Results */}
                  {selectedUser.dashboardData?.assessmentResults && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📊 Değerlendirme Sonuçları</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedUser.dashboardData.assessmentResults, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Form Data */}
                  {selectedUser.dashboardData?.formData && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📝 Form Verileri</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedUser.dashboardData.formData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Exercise Programs */}
                  {selectedUser.dashboardData?.exercisePrograms && selectedUser.dashboardData.exercisePrograms.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">🏋️ Egzersiz Programları</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedUser.dashboardData.exercisePrograms, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Progress Data */}
                  {selectedUser.dashboardData?.progressData && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📈 İlerleme Verileri</h3>
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedUser.dashboardData.progressData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Raw Dashboard Data */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">🗂️ Tüm Dashboard Verileri (Ham)</h3>
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-96">
                        {JSON.stringify(selectedUser.dashboardData, null, 2) || 'Veri yok'}
                      </pre>
                    </div>
                  </div>
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
    </div>
  );
};

export default AdminPanel;

