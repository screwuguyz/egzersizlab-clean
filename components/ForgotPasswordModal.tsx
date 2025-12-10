import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import ResetPasswordModal from './ResetPasswordModal';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userName, setUserName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiService.sendPasswordResetCode(email);
      if (response.success) {
        setSuccess(true);
        // Kullanıcı adını almak için (email'den tahmin edilebilir veya backend'den dönebilir)
        // Şimdilik email'in @ öncesi kısmını kullanıyoruz
        setUserName(email.split('@')[0]);
      } else {
        setError(response.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowResetModal(true);
  };

  if (showResetModal) {
    return <ResetPasswordModal email={email} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition text-xl"
            aria-label="Kapat"
          >
            ×
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Şifremi Unuttum</h2>
            <p className="text-gray-600 text-sm">
              {success
                ? 'E-posta adresinize şifre sıfırlama kodu gönderildi'
                : 'E-posta adresinizi girin, size şifre sıfırlama kodu gönderelim'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm text-center">
                  <strong>{email}</strong> adresine şifre sıfırlama kodu gönderildi.
                  <br />
                  Lütfen e-posta kutunuzu kontrol edin.
                </p>
              </div>
              <button
                onClick={handleContinue}
                className="w-full py-3 text-white font-bold rounded-lg shadow-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Kodu Girdim, Devam Et
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-gray-600 hover:text-gray-800 font-semibold"
              >
                İptal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-posta Adresi <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  placeholder="ornek@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-bold rounded-lg shadow-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Kodu Gönder'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-gray-600 hover:text-gray-800 font-semibold"
              >
                İptal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

