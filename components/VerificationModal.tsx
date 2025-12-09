import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface VerificationModalProps {
  email: string;
  name: string;
  password: string;
  phone?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  email,
  name,
  password,
  phone,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Sadece rakam

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Son karakteri al
    setCode(newCode);
    setError(null);

    // Otomatik sonraki input'a geç
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode([...newCode, ...Array(4 - newCode.length).fill('')].slice(0, 4));
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError('Lütfen 4 haneli kodu giriniz');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.verifyAndRegister(email, fullCode, password, name, phone);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || 'Kod doğrulanamadı. Lütfen tekrar deneyin.');
        // Hata durumunda kodları temizle
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const response = await apiService.sendVerificationCode(email, password, name, phone);
      if (response.success) {
        setCountdown(60); // 60 saniye bekle
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(response.error || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setError(err.message || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setResendLoading(false);
    }
  };

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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">E-posta Aktivasyonu</h2>
            <p className="text-gray-600 text-sm">
              <strong>{email}</strong> adresine gönderilen 4 haneli kodu giriniz
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Aktivasyon Kodu
              </label>
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Kod 10 dakika geçerlidir
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.join('').length !== 4}
              className="w-full py-3 text-white font-bold rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Doğrulanıyor...' : 'Hesabı Aktifleştir'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || countdown > 0}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {countdown > 0
                  ? `Yeni kod gönder (${countdown}s)`
                  : resendLoading
                  ? 'Gönderiliyor...'
                  : 'Kodu tekrar gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;

