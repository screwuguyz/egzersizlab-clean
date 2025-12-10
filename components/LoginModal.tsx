import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import ForgotPasswordModal from './ForgotPasswordModal';

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const heroBackgroundStyle = {
    backgroundImage:
      'linear-gradient(135deg, rgba(102,126,234,0.95), rgba(118,75,162,0.95)), url("https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <style>{`
        .floating-icon { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .checkbox-custom {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .checkbox-custom:checked {
          background-color: #667eea;
          border-color: #667eea;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 13l4 4L19 7'%3E%3C/path%3E%3C/svg%3E");
          background-size: 14px;
          background-position: center;
          background-repeat: no-repeat;
        }
        .login-submit {
          position: relative;
          overflow: hidden;
        }
        .login-submit::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.6s ease;
        }
        .login-submit:hover::before { left: 100%; }
      `}</style>
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left */}
        <div className="text-white p-8 md:p-10 flex items-center" style={heroBackgroundStyle}>
          <div className="space-y-6 max-w-md text-center md:text-left">
            <div className="floating-icon">
              <svg className="w-16 h-16 mx-auto md:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Tekrar Hoş Geldiniz</h1>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              İyileşme yolculuğunuza kaldığınız yerden devam edin. Bugün kendiniz için harika bir gün olsun.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <div className="h-1 w-12 bg-white opacity-50 rounded" />
              <div className="h-1 w-12 bg-white opacity-70 rounded" />
              <div className="h-1 w-12 bg-white opacity-50 rounded" />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="p-8 md:p-10 bg-gray-50 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition text-xl"
            aria-label="Kapat"
          >
            ×
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Hesabınıza Giriş Yapın</h2>
              <p className="text-gray-600 text-sm">Sağlık yolculuğunuza devam edin</p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setLoading(true);

                try {
                  const response = await apiService.login(formData.email, formData.password);

                  if (response.success) {
                    onClose();
                    if (onSuccess) {
                      onSuccess();
                    } else {
                      // Dashboard'a yönlendir
                      window.location.href = '/#dashboard';
                    }
                  } else {
                    setError(response.error || 'Giriş başarısız. E-posta veya şifrenizi kontrol edin.');
                  }
                } catch (err: any) {
                  setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-posta Adresi <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Şifre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showPassword ? 'Gizle' : 'Göster'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="checkbox-custom" />
                  <span className="text-sm text-gray-700">Beni Hatırla</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Şifremi Unuttum
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="login-submit w-full py-4 text-white font-bold rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
              <div className="mt-5 text-center text-sm text-gray-600">
                Henüz hesabınız yok mu?{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Kayıt Olun
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => {
            setShowForgotPassword(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default LoginModal;
