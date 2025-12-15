import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import VerificationModal from './VerificationModal';

interface RegistrationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  onOpenLogin?: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSuccess, onOpenLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showKvkk, setShowKvkk] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
          width: 20px;
          height: 20px;
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
          background-size: 16px;
          background-position: center;
          background-repeat: no-repeat;
        }
        .registration-submit {
          position: relative;
          overflow: hidden;
        }
        .registration-submit::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.6s ease;
        }
        .registration-submit:hover::before { left: 100%; }
      `}</style>
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left */}
        <div className="text-white p-8 md:p-10 flex items-center" style={heroBackgroundStyle}>
          <div className="space-y-6 max-w-md">
            <div className="floating-icon">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold leading-tight">Ağrısız bir yaşama ilk adımı atıyorsunuz</h1>
            <p className="text-lg opacity-90">
              Profesyonel fizyoterapistlerimiz, size özel egzersiz programlarıyla sağlıklı yaşamınızı destekliyor.
            </p>
            <div className="space-y-3 pt-4">
              {[
                'Kişiye özel egzersiz programları',
                '7/24 Dijital Erişim imkanı',
                'Uzman fizyoterapist danışmanlığı',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Hesap Oluştur</h2>
              <p className="text-gray-600 text-sm">Sağlıklı yaşam yolculuğunuza başlayın</p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setLoading(true);

                try {
                  // Telefon numarası validasyonu (opsiyonel ama girilmişse geçerli olmalı)
                  if (formData.phone && formData.phone.trim() !== '') {
                    const phone = formData.phone.trim();
                    // Sadece rakam, +, -, boşluk ve parantez kabul edilir
                    if (!/^[0-9+\-\s()]+$/.test(phone)) {
                      setError('Geçerli bir telefon numarası giriniz (sadece rakam, +, -, boşluk kullanabilirsiniz)');
                      setLoading(false);
                      return;
                    }
                    // Sadece rakamları al ve uzunluk kontrolü yap
                    const phoneDigits = phone.replace(/\D/g, '');
                    // Türkiye telefon numarası: en az 10 haneli olmalı
                    if (phoneDigits.length < 10) {
                      setError('Telefon numarası en az 10 haneli olmalıdır (örn: 5XX XXX XX XX)');
                      setLoading(false);
                      return;
                    }
                  }

                  // Şifre validasyonu (backend'de de kontrol ediliyor ama frontend'de de kontrol edelim)
                  if (formData.password.length < 8) {
                    setError('Şifre en az 8 karakter olmalıdır');
                    setLoading(false);
                    return;
                  }

                  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                    setError('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir');
                    setLoading(false);
                    return;
                  }

                  // Aktivasyon kodu gönder
                  const response = await apiService.sendVerificationCode(
                    formData.email,
                    formData.password,
                    formData.name,
                    formData.phone
                  );

                  if (response.success) {
                    // Aktivasyon modalını aç
                    setShowVerification(true);
                  } else {
                    setError(response.error || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
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
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="Adınız ve Soyadınız"
                />
              </div>
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
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="0555 555 55 55"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Şifre Oluştur <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="En az 8 karakter (büyük/küçük harf + rakam)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    {showPassword ? 'Gizle' : 'Göster'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir
                </p>
              </div>
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="checkbox-custom mt-1" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                  <button type="button" onClick={() => setShowKvkk(true)} className="text-purple-600 hover:underline font-semibold">
                    KVKK
                  </button>{' '}
                  ve{' '}
                  <button type="button" onClick={() => setShowKvkk(true)} className="text-purple-600 hover:underline font-semibold">
                    Aydınlatma Metni
                  </button>
                    'ni okudum, kabul ediyorum.
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="registration-submit w-full py-3 text-white font-bold rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kayıt yapılıyor...' : 'Hesabımı Oluştur ve Değerlendirmeye Başla'}
              </button>
            </form>
            <div className="mt-5 text-center text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Giriş Yapın
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aktivasyon Modalı */}
      {showVerification && (
        <VerificationModal
          email={formData.email}
          name={formData.name}
          password={formData.password}
          phone={formData.phone}
          onClose={() => {
            setShowVerification(false);
            onClose();
          }}
          onSuccess={() => {
            if (onSuccess) {
              onSuccess();
            } else {
              // Dashboard'a yönlendir - hash routing kullan
              window.location.hash = '#dashboard';
              // Router'ın hash'i algılaması için kısa bir gecikme sonrası reload
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }
          }}
        />
      )}

      {showKvkk && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-4 text-sm text-gray-700">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">KVKK ve Aydınlatma Metni</h3>
                <button
                  onClick={() => setShowKvkk(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                  aria-label="Kapat"
                >
                  ×
                </button>
              </div>
              <p>
                EgzersizLab olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında; kimlik,
                iletişim, işlem güvenliği ve kullanım verilerinizi hizmet sunumu, üyelik işlemleri, destek ve güvenlik
                süreçleri için işliyoruz. Verileriniz, açık rızanıza dayalı olarak veya KVKK m.5/2 uyarınca sözleşmenin
                ifası, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaat ve hakların tesisi amaçlarıyla
                kullanılabilir.
              </p>
              <p>
                Kişisel verileriniz; yetkili kamu kurumları, iş ortakları, altyapı/hosting/e-posta sağlayıcıları ve
                hukuken yetkili üçüncü kişilerle, hizmetlerin sağlanması ve güvenliğinin tesis edilmesi amacıyla
                paylaşılabilir. Verileriniz yurt içinde veya hizmet alınan altyapılar nedeniyle yurt dışında
                barındırılabilir.
              </p>
              <p className="font-semibold">Haklarınız (KVKK m.11)</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>İşlenip işlenmediğini öğrenme,</li>
                <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
                <li>Yurt içi/dışı aktarılan üçüncü kişileri bilme,</li>
                <li>Eksik veya yanlış işlendi ise düzeltilmesini isteme,</li>
                <li>Silinmesini/yok edilmesini isteme,</li>
                <li>Otomatik sistemlerle analiz sonucu aleyhinize bir sonuca itiraz etme,</li>
                <li>Kanuna aykırı işlem nedeniyle zarara uğrarsanız tazminat talep etme.</li>
              </ul>
              <p>
                Başvuru: kvkk@egzersizlab.com adresine kimlik doğrulamalı e-posta ile başvurabilirsiniz. Detaylı
                aydınlatma ve çerez politikası için lütfen bizimle iletişime geçin.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowKvkk(false)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition"
                >
                  Anladım
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationModal;
