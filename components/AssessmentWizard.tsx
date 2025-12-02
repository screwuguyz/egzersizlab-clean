import React, { useMemo, useState } from 'react';

type StepKey = 1 | 2 | 3 | 4 | 5;
type SafetyKey = 'surgery' | 'chronic' | 'heart' | 'pregnancy';

const genderOptions = [
  { value: 'female', label: 'Kadın', icon: '👩' },
  { value: 'male', label: 'Erkek', icon: '👨' },
];

const workTypes = [
  { value: 'desk', label: 'Masa Başı / Ofis', icon: '💻' },
  { value: 'active', label: 'Ayakta / Hareketli', icon: '🚶' },
  { value: 'physical', label: 'Bedensel Güç Gerektiren', icon: '💪' },
];

const painDurations = [
  { value: 'new', label: 'Yeni Başladı', helper: '1 aydan kısa süredir', icon: '🆕' },
  { value: 'moderate', label: 'Bir Süredir Var', helper: '1-3 ay arası', icon: '⏳' },
  { value: 'chronic', label: 'Kronikleşti', helper: '3 aydan uzun süredir', icon: '⚠️' },
];

const painTypes = [
  { value: 'ache', label: 'Sızlama' },
  { value: 'sharp', label: 'Batma' },
  { value: 'burning', label: 'Yanma', icon: '🔥' },
  { value: 'numbness', label: 'Uyuşma', icon: '⚡' },
  { value: 'stiffness', label: 'Tutukluk', icon: '🧱' },
];

const safetyQuestions: Array<{
  key: SafetyKey;
  question: string;
  icon: string;
  helper?: string;
}> = [
  {
    key: 'surgery',
    question: 'Son 6 ay içinde ilgili bölgede ameliyat oldunuz mu?',
    icon: '🏥',
  },
  {
    key: 'chronic',
    question: 'Tanısı konmuş romatolojik veya nörolojik bir hastalığınız var mı?',
    icon: '🧬',
    helper: 'Örn: MS, Ankilozan Spondilit vb.',
  },
  {
    key: 'heart',
    question: 'Egzersize engel kalp/tansiyon probleminiz var mı?',
    icon: '❤️',
  },
  {
    key: 'pregnancy',
    question: 'Hamilelik durumunuz veya şüpheniz var mı?',
    icon: '🤰',
  },
];

type BodyPart = { id: string; label: string; cx: number; cy: number; r: number };

const partLabels: Record<string, string> = {
  'head-front': 'Baş / Boyun',
  'head-back': 'Baş / Boyun (Arka)',
  'neck-front': 'Boyun',
  'neck-back': 'Boyun (Arka)',
  'shoulder-front-left': 'Sol Omuz',
  'shoulder-front-right': 'Sağ Omuz',
  'shoulder-back-left': 'Sol Omuz (Arka)',
  'shoulder-back-right': 'Sağ Omuz (Arka)',
  chest: 'Göğüs',
  abdomen: 'Karın',
  'hip-front': 'Bel / Kalça',
  'hip-back': 'Kalça (Arka)',
  'upper-back': 'Üst Sırt',
  'mid-back': 'Orta Sırt',
  'lower-back': 'Bel (Arka)',
  'knee-front-left': 'Sol Diz',
  'knee-front-right': 'Sağ Diz',
  'knee-back-left': 'Sol Diz (Arka)',
  'knee-back-right': 'Sağ Diz (Arka)',
  'ankle-front-left': 'Sol Ayak Bileği',
  'ankle-front-right': 'Sağ Ayak Bileği',
  'ankle-back-left': 'Sol Ayak Bileği (Arka)',
  'ankle-back-right': 'Sağ Ayak Bileği (Arka)',
  'elbow-front-left': 'Sol Dirsek',
  'elbow-front-right': 'Sağ Dirsek',
  'elbow-back-left': 'Sol Dirsek (Arka)',
  'elbow-back-right': 'Sağ Dirsek (Arka)',
  'wrist-front-left': 'Sol Bilek',
  'wrist-front-right': 'Sağ Bilek',
  'wrist-back-left': 'Sol Bilek (Arka)',
  'wrist-back-right': 'Sağ Bilek (Arka)',
};

const bodyPartsFront: BodyPart[] = [
  { id: 'head-front', label: 'Baş / Boyun', cx: 100, cy: 50, r: 18 },
  { id: 'neck-front', label: 'Boyun', cx: 100, cy: 76, r: 9 },
  { id: 'shoulder-front-left', label: 'Sol Omuz', cx: 72, cy: 92, r: 11 },
  { id: 'shoulder-front-right', label: 'Sağ Omuz', cx: 128, cy: 92, r: 11 },
  { id: 'chest', label: 'Göğüs', cx: 100, cy: 115, r: 24 },
  { id: 'abdomen', label: 'Karın', cx: 100, cy: 155, r: 22 },
  { id: 'hip-front', label: 'Bel / Kalça', cx: 100, cy: 200, r: 20 },
  { id: 'elbow-front-left', label: 'Sol Dirsek', cx: 64, cy: 142, r: 9 },
  { id: 'elbow-front-right', label: 'Sağ Dirsek', cx: 136, cy: 142, r: 9 },
  { id: 'wrist-front-left', label: 'Sol Bilek', cx: 60, cy: 190, r: 8 },
  { id: 'wrist-front-right', label: 'Sağ Bilek', cx: 140, cy: 190, r: 8 },
  { id: 'knee-front-left', label: 'Sol Diz', cx: 92, cy: 260, r: 12 },
  { id: 'knee-front-right', label: 'Sağ Diz', cx: 108, cy: 260, r: 12 },
  { id: 'ankle-front-left', label: 'Sol Ayak Bileği', cx: 92, cy: 315, r: 10 },
  { id: 'ankle-front-right', label: 'Sağ Ayak Bileği', cx: 108, cy: 315, r: 10 },
];

const bodyPartsBack: BodyPart[] = [
  { id: 'head-back', label: 'Baş / Boyun (Arka)', cx: 100, cy: 50, r: 18 },
  { id: 'neck-back', label: 'Boyun (Arka)', cx: 100, cy: 76, r: 9 },
  { id: 'shoulder-back-left', label: 'Sol Omuz (Arka)', cx: 72, cy: 92, r: 11 },
  { id: 'shoulder-back-right', label: 'Sağ Omuz (Arka)', cx: 128, cy: 92, r: 11 },
  { id: 'upper-back', label: 'Üst Sırt', cx: 100, cy: 115, r: 24 },
  { id: 'mid-back', label: 'Orta Sırt', cx: 100, cy: 155, r: 22 },
  { id: 'lower-back', label: 'Bel (Arka)', cx: 100, cy: 200, r: 20 },
  { id: 'hip-back', label: 'Kalça (Arka)', cx: 100, cy: 220, r: 18 },
  { id: 'elbow-back-left', label: 'Sol Dirsek (Arka)', cx: 64, cy: 142, r: 9 },
  { id: 'elbow-back-right', label: 'Sağ Dirsek (Arka)', cx: 136, cy: 142, r: 9 },
  { id: 'wrist-back-left', label: 'Sol Bilek (Arka)', cx: 60, cy: 190, r: 8 },
  { id: 'wrist-back-right', label: 'Sağ Bilek (Arka)', cx: 140, cy: 190, r: 8 },
  { id: 'knee-back-left', label: 'Sol Diz (Arka)', cx: 92, cy: 260, r: 12 },
  { id: 'knee-back-right', label: 'Sağ Diz (Arka)', cx: 108, cy: 260, r: 12 },
  { id: 'ankle-back-left', label: 'Sol Ayak Bileği (Arka)', cx: 92, cy: 315, r: 10 },
  { id: 'ankle-back-right', label: 'Sağ Ayak Bileği (Arka)', cx: 108, cy: 315, r: 10 },
];

interface AssessmentWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ open, onClose, onComplete }) => {
  const [step, setStep] = useState<StepKey>(1);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [workType, setWorkType] = useState<string | null>(null);
  const [chronicConditions, setChronicConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [painDuration, setPainDuration] = useState<string | null>(null);
  const [painIntensity, setPainIntensity] = useState<number>(5);
  const [selectedPainTypes, setSelectedPainTypes] = useState<string[]>([]);
  const [safetyAnswers, setSafetyAnswers] = useState<Record<SafetyKey, 'yes' | 'no' | undefined>>({
    surgery: undefined,
    chronic: undefined,
    heart: undefined,
    pregnancy: undefined,
  });
  const [photos, setPhotos] = useState<Record<'front' | 'side' | 'back', string | null>>({
    front: null,
    side: null,
    back: null,
  });
  const [manualArea, setManualArea] = useState('');

  const progress = useMemo(() => (step / 5) * 100, [step]);
  const painMood = useMemo(() => {
    if (painIntensity <= 2) return { emoji: '😀', color: '#10b981' };
    if (painIntensity <= 4) return { emoji: '🙂', color: '#22c55e' };
    if (painIntensity <= 6) return { emoji: '😐', color: '#f59e0b' };
    if (painIntensity <= 8) return { emoji: '😣', color: '#f97316' };
    return { emoji: '😡', color: '#ef4444' };
  }, [painIntensity]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const renderBody = (parts: BodyPart[], title: string) => (
    <div className="body-diagram">
      <div className="body-diagram-title">{title}</div>
      <svg viewBox="0 0 200 380" className="body-svg">
        <circle cx="100" cy="50" r="22" fill="#e5e7eb" />
        <rect x="92" y="70" width="16" height="20" rx="6" fill="#e5e7eb" />
        <path d="M72 90 Q100 78 128 90 L134 160 Q100 178 66 160 Z" fill="#e5e7eb" />
        <rect x="78" y="155" width="44" height="55" rx="18" fill="#e5e7eb" />
        <ellipse cx="100" cy="215" rx="28" ry="20" fill="#e5e7eb" />
        <rect x="86" y="235" width="16" height="90" rx="8" fill="#e5e7eb" />
        <rect x="98" y="235" width="16" height="90" rx="8" fill="#e5e7eb" />
        <ellipse cx="94" cy="325" rx="11" ry="12" fill="#e5e7eb" />
        <ellipse cx="106" cy="325" rx="11" ry="12" fill="#e5e7eb" />
        <rect x="62" y="102" width="14" height="60" rx="7" fill="#e5e7eb" />
        <rect x="124" y="102" width="14" height="60" rx="7" fill="#e5e7eb" />
        <rect x="56" y="150" width="12" height="52" rx="7" fill="#e5e7eb" />
        <rect x="132" y="150" width="12" height="52" rx="7" fill="#e5e7eb" />

        {parts.map((part) => {
          const active = selectedAreas.includes(part.id);
          return (
            <circle
              key={part.id}
              cx={part.cx}
              cy={part.cy}
              r={part.r}
              className={`body-part ${active ? 'selected' : ''}`}
              onClick={() => toggleArea(part.id)}
            >
              <title>{partLabels[part.id] || part.label}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );

  const togglePainType = (value: string) => {
    setSelectedPainTypes((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const addManualArea = () => {
    const trimmed = manualArea.trim();
    if (!trimmed) return;
    setSelectedAreas((prev) => [...prev, trimmed]);
    setManualArea('');
  };

  const handleFile = (view: 'front' | 'side' | 'back', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotos((prev) => ({ ...prev, [view]: (e.target?.result as string) || null }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (current: StepKey) => {
    switch (current) {
      case 1:
        return gender && age && height && weight && workType;
      case 2:
        return selectedAreas.length > 0;
      case 3:
        return painDuration !== null;
      case 4: {
        const required: SafetyKey[] =
          gender === 'male' ? ['surgery', 'chronic', 'heart'] : ['surgery', 'chronic', 'heart', 'pregnancy'];
        return required.every((k) => safetyAnswers[k] !== undefined);
      }
      case 5:
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step < 5) {
      setStep((s) => (s + 1) as StepKey);
    } else {
      if (onComplete) onComplete();
      onClose();
    }
  };

  const goBack = () => setStep((s) => Math.max(1, (s - 1) as StepKey) as StepKey);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vücut Analizi</h2>
              <p className="text-gray-600 text-sm">
                Size en uygun tedavi planını oluşturmak için birkaç soru soracağız.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-2xl leading-none"
              aria-label="Kapat"
            >
              ×
            </button>
          </div>
          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Fiziksel profilinizi oluşturun</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {genderOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGender(opt.value)}
                    className={`wizard-option-btn ${gender === opt.value ? 'active' : ''}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="wizard-field">
                  <span>Yaş</span>
                  <input
                    type="number"
                    min={18}
                    max={100}
                    value={age ?? ''}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
                  />
                </label>
                <label className="wizard-field">
                  <span>Boy (cm)</span>
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={height ?? ''}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : null)}
                  />
                </label>
                <label className="wizard-field">
                  <span>Kilo (kg)</span>
                  <input
                    type="number"
                    min={30}
                    max={300}
                    value={weight ?? ''}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}
                  />
                </label>
                <div className="wizard-field">
                  <span>İş hayatınız</span>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {workTypes.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setWorkType(opt.value)}
                        className={`wizard-option-btn ${workType === opt.value ? 'active' : ''}`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <label className="wizard-field">
                <span>Kronik rahatsızlıklar (opsiyonel)</span>
                <textarea
                  rows={2}
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                />
              </label>
              <label className="wizard-field">
                <span>Düzenli kullandığınız ilaçlar (opsiyonel)</span>
                <textarea
                  rows={2}
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Ağrı veya sorun nerede?</h3>
              <p className="text-gray-600 text-sm">Birden fazla bölge seçebilirsiniz.</p>

              <div className="grid md:grid-cols-2 gap-6">
                {renderBody(bodyPartsFront, 'ÖN TARAF')}
                {renderBody(bodyPartsBack, 'ARKA TARAF')}
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {selectedAreas.length === 0 && (
                  <span className="text-xs text-gray-500">Şekil üzerinden bölgeleri seçin.</span>
                )}
                {selectedAreas.map((area) => (
                  <span key={area} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {partLabels[area] || area.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>

              <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                <input
                  type="text"
                  value={manualArea}
                  onChange={(e) => setManualArea(e.target.value)}
                  placeholder="Şekilde yoksa bölgeyi yazın (ör. çene, topuk)"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addManualArea}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Ekle
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Süre ve şiddet</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {painDurations.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPainDuration(opt.value)}
                    className={`p-4 text-left rounded-xl border transition ${
                      painDuration === opt.value
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xl">{opt.icon}</div>
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.helper}</div>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Hafif</span>
                  <span>Orta</span>
                  <span>Şiddetli</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={painIntensity}
                    onChange={(e) => setPainIntensity(Number(e.target.value))}
                    className="w-full pain-slider-ui"
                  />
                </div>
                <div className="flex items-center justify-center gap-3 text-2xl font-bold" style={{ color: painMood.color }}>
                  <span className="text-4xl">{painMood.emoji}</span>
                  <span>{painIntensity}/10</span>
                </div>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <label className="wizard-field">
                  <span>Ağrıyı nasıl tarif edersiniz? (opsiyonel)</span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {painTypes.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => togglePainType(p.value)}
                        className={`wizard-option-btn ${
                          selectedPainTypes.includes(p.value) ? 'active' : ''
                        }`}
                      >
                        {p.icon && <span>{p.icon}</span>}
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </label>
              </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Güvenlik kontrolü</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                Aşağıdaki soruları dürüstçe cevaplayarak kendinizi koruyun 🛡️
              </p>
              <div className="space-y-3">
                {safetyQuestions.map((item) => {
                  if (item.key === 'pregnancy' && gender === 'male') return null;
                  const value = safetyAnswers[item.key];
                  return (
                    <div key={item.key} className="safety-card">
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800">{item.question}</div>
                          {item.helper && <div className="text-xs text-gray-500 mt-1">{item.helper}</div>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSafetyAnswers((prev) => ({ ...prev, [item.key]: 'no' }))}
                            className={`safety-btn ${value === 'no' ? 'active-no' : ''}`}
                          >
                            Hayır
                          </button>
                          <button
                            onClick={() => setSafetyAnswers((prev) => ({ ...prev, [item.key]: 'yes' }))}
                            className={`safety-btn ${value === 'yes' ? 'active-yes' : ''}`}
                          >
                            Evet
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {Object.values(safetyAnswers).includes('yes') && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
                  <strong>Önemli:</strong> Program başlamadan önce doktorunuza danışmanızı öneririz.
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Postür fotoğrafları</h3>
              <p className="text-sm text-gray-600">
                Ayaklar omuz genişliğinde, ışık yüzünüzde, düz arka plan. Aşağıdaki silüetleri referans alarak çekin.
              </p>
              <div className="space-y-3">
                <div className="alert alert-warning">
                  <div className="font-semibold flex items-center gap-2 text-amber-800">
                    <span>⚠️</span> En Doğru Sonuç İçin Çekim Standartları
                  </div>
                  <p className="text-sm text-amber-900 mt-1">
                    Yapay zeka ve uzmanlarımız milimetrik sapmaları ölçer. Kıyafet veya açı hatası, teşhisin yanlış
                    olmasına neden olabilir. Lütfen kurallara dikkat edin.
                  </p>
                </div>
                <div className="alert alert-info">
                  <div className="font-semibold flex items-center gap-2 text-indigo-900">
                    <span>🔒</span> Mahremiyet Uyarısı
                  </div>
                  <p className="text-sm text-indigo-900 mt-1">
                    Fotoğraflar KVKK kapsamında şifrelenir, sadece fizyoterapistiniz tarafından analiz amaçlı görülür ve asla
                    üçüncü kişilerle paylaşılmaz.
                  </p>
                </div>
                <div className="alert alert-rules space-y-2">
                  <div className="font-semibold flex items-center gap-2 text-gray-900">
                    <span>📋</span> 5 Altın Kural (En kritik)
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                      <div className="font-semibold text-emerald-800 mb-1">Kıyafet (en kritik)</div>
                      <div className="text-emerald-800 text-xs leading-relaxed">
                        Erkek: Şort (üst çıplak önerilir) veya dar atlet/tayt. <br />
                        Kadın: Spor sütyeni + kısa tayt veya vücudu saran spor kıyafet.
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs leading-relaxed">
                      <div className="font-semibold text-rose-800 mb-1">Yasaklılar</div>
                      Bol tişört, kapüşonlu, uzun etek, geniş pantolon, sweatshirt.
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 leading-relaxed">
                      <div className="font-semibold">Çekim Açısı ve Mesafe</div>
                      Kamera bel/göğüs hizasında ve yere dik olsun (selfie açısı yok). Ayak parmağından başa kadar kadraja sığ.
                    </div>
                    <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 leading-relaxed">
                      <div className="font-semibold">Işık ve Arka Plan</div>
                      Düz duvar önünde olun; arkanızda pencere/dağınık eşya olmasın. Işık yüzünüzde olmalı.
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 leading-relaxed">
                      <div className="font-semibold">Saç & Aksesuarlar</div>
                      Uzun saçları toplayın; boyun ve omuz açıkta kalsın. Ayakkabısız/çorapsız durun.
                    </div>
                    <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 leading-relaxed">
                      <div className="font-semibold">Doğal Duruş</div>
                      Karnınızı içeri çekmeyin, kendinizi dik tutmayın; günlük doğal duruşunuzla çekin.
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {([
                  { view: 'front', title: 'ÖNDEN Görünüm', hint: 'Ayaklar omuz hizasında, kollar yanda serbest. Karşıya bakın.' },
                  { view: 'side', title: 'YANDAN Görünüm', hint: 'Tam profil duruş. Kulak, omuz ve kalça aynı hizada olsun.' },
                  { view: 'back', title: 'ARKADAN Görünüm', hint: 'Sırtınız dönük, doğal duruşunuzda bekleyin.' },
                ] as const).map(({ view, title, hint }) => (
                  <div
                    key={view}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-white/80 hover:border-indigo-300 transition"
                  >
                    <div className="mb-3 flex justify-center">
                      <svg viewBox="0 0 80 180" className="h-32">
                        <circle cx="40" cy="20" r="12" fill="#e5e7eb" />
                        <rect x="36" y="32" width="8" height="12" rx="4" fill="#e5e7eb" />
                        <rect x="26" y="44" width="28" height="42" rx="12" fill="#e5e7eb" />
                        <rect x="30" y="86" width="20" height="36" rx="9" fill="#e5e7eb" />
                        <rect x="34" y="122" width="12" height="38" rx="6" fill="#e5e7eb" />
                        <rect x="24" y="50" width="8" height="30" rx="5" fill="#e5e7eb" />
                        <rect x="48" y="50" width="8" height="30" rx="5" fill="#e5e7eb" />
                        <circle cx="38" cy="160" r="7" fill="#e5e7eb" />
                        <circle cx="42" cy="160" r="7" fill="#e5e7eb" />
                      </svg>
                    </div>
                    <div className="font-semibold text-gray-800">{title}</div>
                    <div className="text-xs text-gray-500 mt-1 min-h-[32px]">{hint}</div>
                    <div className="mt-3 flex flex-col gap-2 items-center">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition"
                        onClick={() => document.getElementById(`file-${view}`)?.click()}
                      >
                        📷 Kamera ile Çek
                      </button>
                      <input
                        id={`file-${view}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(view as 'front' | 'side' | 'back', e.target.files?.[0] || null)}
                      />
                      {photos[view as 'front' | 'side' | 'back'] && (
                        <img
                          src={photos[view as 'front' | 'side' | 'back'] as string}
                          alt={`${view} upload`}
                          className="mt-1 w-full h-24 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-gray-500">
                Şimdilik atlayabilirsiniz (analiz hassasiyeti düşer).
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 disabled:opacity-50"
          >
            ← Geri
          </button>
          <button
            onClick={goNext}
            className="flex-1 px-4 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transition"
          >
            {step === 5 ? 'Tamamla' : 'İleri →'}
          </button>
        </div>
      </div>

      <style>{`
        .wizard-option-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
          background: #fff;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s;
          width: 100%;
          justify-content: flex-start;
        }
        .wizard-option-btn.active {
          border-color: #667eea;
          background: #eef2ff;
          color: #4338ca;
        }
        .wizard-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          color: #4b5563;
        }
        .wizard-field input,
        .wizard-field textarea {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        .wizard-field input:focus,
        .wizard-field textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        .body-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
        }
        .body-diagram-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #6b7280;
          text-transform: uppercase;
        }
        .body-svg {
          width: 100%;
          max-width: 260px;
          height: auto;
        }
        .body-part {
          fill: #e5e7eb;
          stroke: #d1d5db;
          stroke-width: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .body-part:hover {
          fill: #c7d2fe;
          stroke: #818cf8;
        }
        .body-part.selected {
          fill: #818cf8;
          stroke: #4338ca;
        }
        .pain-slider-ui {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%);
          outline: none;
        }
        .pain-slider-ui::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #6366f1;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .pain-slider-ui::-webkit-slider-thumb:hover {
          transform: scale(1.05);
        }
        .pain-slider-ui::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #6366f1;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .pain-slider-ui::-moz-range-thumb:hover {
          transform: scale(1.05);
        }
        .safety-card {
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          border-radius: 16px;
          padding: 14px;
        }
        .safety-btn {
          padding: 10px 18px;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
          background: #fff;
          font-weight: 700;
          color: #374151;
          transition: all 0.2s;
          min-width: 90px;
        }
        .safety-btn.active-yes {
          border-color: #22c55e;
          background: #dcfce7;
          color: #166534;
        }
        .safety-btn.active-no {
          border-color: #6366f1;
          background: #eef2ff;
          color: #3730a3;
        }
        .alert {
          border-radius: 12px;
          padding: 14px 16px;
          border: 1px solid;
        }
        .alert-warning {
          border-color: #fbbf24;
          background: #fef3c7;
        }
        .alert-info {
          border-color: #93c5fd;
          background: #eff6ff;
        }
        .alert-rules {
          border-color: #e5e7eb;
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default AssessmentWizard;
