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
  'head-front': 'Baş',
  'head-back': 'Baş (Arka)',
  'neck-front': 'Boyun',
  'neck-back': 'Boyun (Arka)',
  'shoulder-front-left': 'Sol Omuz',
  'shoulder-front-right': 'Sağ Omuz',
  'shoulder-back-left': 'Sol Omuz',
  'shoulder-back-right': 'Sağ Omuz',
  chest: 'Göğüs',
  abdomen: 'Karın',
  'hip-front': 'Kalça',
  'hip-back': 'Kalça',
  'upper-back': 'Üst Sırt',
  'mid-back': 'Orta Sırt',
  'lower-back': 'Bel',
  'thigh-front-left': 'Sol Uyluk',
  'thigh-front-right': 'Sağ Uyluk',
  'thigh-back-left': 'Sol Uyluk',
  'thigh-back-right': 'Sağ Uyluk',
  'knee-front-left': 'Sol Diz',
  'knee-front-right': 'Sağ Diz',
  'knee-back-left': 'Sol Diz',
  'knee-back-right': 'Sağ Diz',
  'calf-back-left': 'Sol Baldır',
  'calf-back-right': 'Sağ Baldır',
  'ankle-front-left': 'Sol Ayak Bileği',
  'ankle-front-right': 'Sağ Ayak Bileği',
  'elbow-front-left': 'Sol Dirsek',
  'elbow-front-right': 'Sağ Dirsek',
  'elbow-back-left': 'Sol Dirsek',
  'elbow-back-right': 'Sağ Dirsek',
  'wrist-front-left': 'Sol El Bileği',
  'wrist-front-right': 'Sağ El Bileği',
  'wrist-back-left': 'Sol El Bileği',
  'wrist-back-right': 'Sağ El Bileği',
};

const bodyPartsFront: BodyPart[] = [
  { id: 'head-front', label: 'Baş', cx: 100, cy: 42, r: 16 },
  { id: 'neck-front', label: 'Boyun', cx: 100, cy: 82, r: 10 },
  { id: 'shoulder-front-left', label: 'Sol Omuz', cx: 58, cy: 105, r: 12 },
  { id: 'shoulder-front-right', label: 'Sağ Omuz', cx: 142, cy: 105, r: 12 },
  { id: 'chest', label: 'Göğüs', cx: 100, cy: 130, r: 18 },
  { id: 'abdomen', label: 'Karın', cx: 100, cy: 175, r: 18 },
  { id: 'hip-front', label: 'Kalça', cx: 100, cy: 220, r: 16 },
  { id: 'elbow-front-left', label: 'Sol Dirsek', cx: 38, cy: 165, r: 10 },
  { id: 'elbow-front-right', label: 'Sağ Dirsek', cx: 162, cy: 165, r: 10 },
  { id: 'wrist-front-left', label: 'Sol Bilek', cx: 38, cy: 200, r: 8 },
  { id: 'wrist-front-right', label: 'Sağ Bilek', cx: 162, cy: 200, r: 8 },
  { id: 'thigh-front-left', label: 'Sol Uyluk', cx: 75, cy: 280, r: 14 },
  { id: 'thigh-front-right', label: 'Sağ Uyluk', cx: 125, cy: 280, r: 14 },
  { id: 'knee-front-left', label: 'Sol Diz', cx: 73, cy: 320, r: 12 },
  { id: 'knee-front-right', label: 'Sağ Diz', cx: 127, cy: 320, r: 12 },
  { id: 'ankle-front-left', label: 'Sol Ayak Bileği', cx: 72, cy: 385, r: 9 },
  { id: 'ankle-front-right', label: 'Sağ Ayak Bileği', cx: 128, cy: 385, r: 9 },
];

const bodyPartsBack: BodyPart[] = [
  { id: 'head-back', label: 'Baş (Arka)', cx: 100, cy: 42, r: 16 },
  { id: 'neck-back', label: 'Boyun (Arka)', cx: 100, cy: 82, r: 10 },
  { id: 'shoulder-back-left', label: 'Sol Omuz', cx: 58, cy: 105, r: 12 },
  { id: 'shoulder-back-right', label: 'Sağ Omuz', cx: 142, cy: 105, r: 12 },
  { id: 'upper-back', label: 'Üst Sırt', cx: 100, cy: 125, r: 16 },
  { id: 'mid-back', label: 'Orta Sırt', cx: 100, cy: 155, r: 16 },
  { id: 'lower-back', label: 'Bel', cx: 100, cy: 185, r: 16 },
  { id: 'hip-back', label: 'Kalça', cx: 100, cy: 220, r: 16 },
  { id: 'elbow-back-left', label: 'Sol Dirsek', cx: 38, cy: 165, r: 10 },
  { id: 'elbow-back-right', label: 'Sağ Dirsek', cx: 162, cy: 165, r: 10 },
  { id: 'wrist-back-left', label: 'Sol Bilek', cx: 38, cy: 200, r: 8 },
  { id: 'wrist-back-right', label: 'Sağ Bilek', cx: 162, cy: 200, r: 8 },
  { id: 'thigh-back-left', label: 'Sol Uyluk (Arka)', cx: 75, cy: 280, r: 14 },
  { id: 'thigh-back-right', label: 'Sağ Uyluk (Arka)', cx: 125, cy: 280, r: 14 },
  { id: 'knee-back-left', label: 'Sol Diz (Arka)', cx: 73, cy: 320, r: 12 },
  { id: 'knee-back-right', label: 'Sağ Diz (Arka)', cx: 127, cy: 320, r: 12 },
  { id: 'calf-back-left', label: 'Sol Baldır', cx: 72, cy: 355, r: 10 },
  { id: 'calf-back-right', label: 'Sağ Baldır', cx: 128, cy: 355, r: 10 },
];

interface AssessmentWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
  clinicalTestType?: string | null; // Hangi klinik test açıldı: 'muscle-strength', 'flexibility', 'range-of-motion', 'posture', 'functional'
}

const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ open, onClose, onComplete, clinicalTestType }) => {
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

  const renderBody = (parts: BodyPart[], title: string, isFront: boolean) => (
    <div className="body-diagram-new">
      <div className="body-diagram-header">
        <span className="body-view-icon">{isFront ? '👤' : '🔙'}</span>
        <span className="body-view-title">{title}</span>
      </div>
      <div className="body-svg-container">
        <svg viewBox="0 0 200 420" className="body-svg-new">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id={`bodyGrad${isFront ? 'F' : 'B'}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="bodyShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
            </filter>
          </defs>
          
          {/* Human silhouette - more anatomical */}
          <g filter="url(#bodyShadow)">
            {/* Head */}
            <ellipse cx="100" cy="42" rx="28" ry="32" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Neck */}
            <rect x="88" y="72" width="24" height="22" rx="8" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Shoulders & Upper torso */}
            <path d="M52 100 Q60 88 88 92 L112 92 Q140 88 148 100 L152 120 Q100 115 48 120 Z" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Torso */}
            <path d="M52 118 L56 200 Q100 215 144 200 L148 118 Q100 125 52 118" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Pelvis/Hips */}
            <ellipse cx="100" cy="220" rx="46" ry="28" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Left Arm */}
            <path d="M52 100 Q42 105 38 130 L34 175 Q32 190 38 200 L42 200 Q48 188 46 175 L50 130 Q52 115 52 100" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Right Arm */}
            <path d="M148 100 Q158 105 162 130 L166 175 Q168 190 162 200 L158 200 Q152 188 154 175 L150 130 Q148 115 148 100" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Left Leg */}
            <path d="M68 240 L62 320 Q58 350 62 380 L72 395 L82 395 L86 380 Q88 350 84 320 L78 240" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
            
            {/* Right Leg */}
            <path d="M132 240 L138 320 Q142 350 138 380 L128 395 L118 395 L114 380 Q112 350 116 320 L122 240" fill={`url(#bodyGrad${isFront ? 'F' : 'B'})`} stroke="#cbd5e1" strokeWidth="1.5"/>
          </g>
          
          {/* Clickable pain areas */}
          {parts.map((part) => {
            const active = selectedAreas.includes(part.id);
            return (
              <g key={part.id} onClick={() => toggleArea(part.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={part.cx}
                  cy={part.cy}
                  r={part.r + 4}
                  className={`pain-area-glow ${active ? 'active' : ''}`}
                />
                <circle
                  cx={part.cx}
                  cy={part.cy}
                  r={part.r}
                  className={`pain-area ${active ? 'selected' : ''}`}
                />
                {active && (
                  <text x={part.cx} y={part.cy + 4} textAnchor="middle" className="pain-check">✓</text>
                )}
                <title>{partLabels[part.id] || part.label}</title>
              </g>
            );
          })}
        </svg>
      </div>
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

  const goNext = async () => {
    if (!validateStep(step)) return;
    if (step < 5) {
      setStep((s) => (s + 1) as StepKey);
    } else {
      // Son adımda verileri kaydet
      try {
        const { apiService } = await import('../services/apiService');
        
        // Form verilerini topla
        const formData = {
          gender,
          age,
          height,
          weight,
          workType,
          chronicConditions,
          medications,
          selectedAreas,
          painDuration,
          painIntensity,
          selectedPainTypes,
          safetyAnswers,
          manualArea,
        };

        // Fotoğrafları kaydet - Developer için tam base64 verisi
        const photoData = {
          front: photos.front || null,
          side: photos.side || null,
          back: photos.back || null,
        };

        // Assessment sonuçlarını topla
        const assessmentResults = {
          formData,
          photos: photoData,
          completedAt: new Date().toISOString(),
        };

        // Dashboard verilerini kaydet - Fotoğraflar dahil
        await apiService.saveDashboardData({
          assessmentResults,
          photos: photoData, // Tam base64 verisi
          formData,
        });
      } catch (error) {
        console.error('Dashboard verileri kaydedilirken hata:', error);
        // Hata olsa bile devam et
      }

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
      <div className="assessment-modal bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[98vh] overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <span className="text-white text-3xl">🏥</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Vücut Analizi</h2>
                <p className="text-gray-500 text-xl mt-1">Kişiselleştirilmiş program için bilgi topluyoruz</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition text-2xl"
              aria-label="Kapat"
            >
              ×
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-1">
                <div className={`h-2 flex-1 rounded-full transition-all ${s <= step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              </div>
            ))}
            <span className="text-xl font-semibold text-gray-500 ml-2">{step}/5</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-8">
          {step === 1 && (
            <div className="step1-compact">
              <div className="section-header-compact">
                <h3>Fiziksel Profiliniz</h3>
                <p>Kişisel bilgileriniz tedavi planınızı şekillendirir</p>
              </div>
              
              {/* Gender + Measurements Row */}
              <div className="profile-top-row">
                <div className="gender-compact">
                  {genderOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setGender(opt.value)} className={`gender-btn ${gender === opt.value ? 'sel' : ''}`}>
                      <span>{opt.icon}</span><span>{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="measures-compact">
                  <div className="meas-item">
                    <span className="meas-label">Yaş</span>
                    <input type="number" min={18} max={100} placeholder="—" value={age ?? ''} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}/>
                  </div>
                  <div className="meas-item">
                    <span className="meas-label">Boy</span>
                    <input type="number" min={100} max={250} placeholder="—" value={height ?? ''} onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : null)}/>
                    <span className="meas-unit">cm</span>
                  </div>
                  <div className="meas-item">
                    <span className="meas-label">Kilo</span>
                    <input type="number" min={30} max={300} placeholder="—" value={weight ?? ''} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}/>
                    <span className="meas-unit">kg</span>
                  </div>
                </div>
              </div>
              
              {/* Work Type */}
              <div className="work-compact">
                <label className="field-label-sm">💼 İş Hayatınız</label>
                <div className="work-btns">
                  {workTypes.map((opt) => (
                    <button key={opt.value} onClick={() => setWorkType(opt.value)} className={`work-btn ${workType === opt.value ? 'sel' : ''}`}>
                      <span>{opt.icon}</span><span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Optional Fields */}
              <div className="optional-compact">
                <div className="opt-field">
                  <label>Kronik rahatsızlıklar <span className="opt-tag">opsiyonel</span></label>
                  <textarea rows={1} placeholder="Varsa belirtin..." value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)}/>
                </div>
                <div className="opt-field">
                  <label>Düzenli ilaçlar <span className="opt-tag">opsiyonel</span></label>
                  <textarea rows={1} placeholder="Varsa belirtin..." value={medications} onChange={(e) => setMedications(e.target.value)}/>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step2-compact">
              <div className="section-header-compact">
                <h3>Ağrı veya Sorun Nerede?</h3>
                <p>Şekil üzerinde tıklayarak seçin • Birden fazla bölge seçebilirsiniz</p>
              </div>

              <div className="body-diagrams-compact">
                {renderBody(bodyPartsFront, 'ÖN', true)}
                {renderBody(bodyPartsBack, 'ARKA', false)}
              </div>

              <div className="bottom-row-compact">
                <div className="selected-areas-compact">
                  {selectedAreas.length === 0 ? (
                    <span className="empty-hint-sm">👆 Bölge seçin</span>
                  ) : (
                    selectedAreas.map((area) => (
                      <span key={area} className="area-tag-sm">
                        {partLabels[area] || area.replace(/-/g, ' ')}
                        <button onClick={() => toggleArea(area)}>×</button>
                      </span>
                    ))
                  )}
                </div>
                <div className="manual-add-compact">
                  <input
                    type="text"
                    value={manualArea}
                    onChange={(e) => setManualArea(e.target.value)}
                    placeholder="Başka bölge yazın..."
                    className="manual-input-sm"
                  />
                  <button type="button" onClick={addManualArea} className="manual-add-btn-sm">+</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step3-compact">
              <div className="section-header-compact">
                <h3>Süre ve Şiddet</h3>
                <p>Ağrınızın ne zamandır devam ettiğini ve şiddetini belirtin</p>
              </div>
              
              <div className="step3-grid">
                {/* Left: Duration */}
                <div className="duration-compact">
                  <label className="field-label-sm">⏱️ Ne zamandır var?</label>
                  <div className="duration-list-compact">
                    {painDurations.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPainDuration(opt.value)}
                        className={`duration-item-compact ${painDuration === opt.value ? 'selected' : ''}`}
                      >
                        <span className="dur-icon">{opt.icon}</span>
                        <div className="dur-text">
                          <span className="dur-title">{opt.label}</span>
                          <span className="dur-sub">{opt.helper}</span>
                        </div>
                        {painDuration === opt.value && <span className="dur-check">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Right: Intensity & Type */}
                <div className="intensity-compact">
                  <label className="field-label-sm">📊 Ağrı Şiddeti</label>
                  <div className="intensity-box">
                    <div className="intensity-top">
                      <span className="int-emoji" style={{ color: painMood.color }}>{painMood.emoji}</span>
                      <span className="int-val" style={{ color: painMood.color }}>{painIntensity}/10</span>
                    </div>
                    <div className="int-labels"><span>Hafif</span><span>Orta</span><span>Şiddetli</span></div>
                    <input type="range" min={1} max={10} value={painIntensity} onChange={(e) => setPainIntensity(Number(e.target.value))} className="int-slider"/>
                    <div className="int-nums">{[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} className={painIntensity >= n ? 'act' : ''}>{n}</span>)}</div>
                  </div>
                  
                  <label className="field-label-sm mt-3">🎯 Ağrı Tipi <span className="opt-tag">opsiyonel</span></label>
                  <div className="pain-types-compact">
                    {painTypes.map((p) => (
                      <button key={p.value} onClick={() => togglePainType(p.value)} className={`ptype-btn ${selectedPainTypes.includes(p.value) ? 'sel' : ''}`}>
                        {p.icon && <span>{p.icon}</span>}<span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step4-compact">
              <div className="section-header-compact">
                <h3>Güvenlik Kontrolü</h3>
                <p>Sağlığınız için önemli sorular • Dürüstçe cevaplayın 🛡️</p>
              </div>
              
              <div className="safety-list-compact">
                {safetyQuestions.map((item, index) => {
                  if (item.key === 'pregnancy' && gender === 'male') return null;
                  const value = safetyAnswers[item.key];
                  return (
                    <div key={item.key} className="safety-item-compact">
                      <div className="safety-left">
                        <span className="safety-num">{index + 1}</span>
                        <span className="safety-ico">{item.icon}</span>
                        <div className="safety-txt">
                          <span className="safety-q">{item.question}</span>
                          {item.helper && <span className="safety-h">{item.helper}</span>}
                        </div>
                      </div>
                      <div className="safety-btns">
                        <button onClick={() => setSafetyAnswers((prev) => ({ ...prev, [item.key]: 'no' }))} className={`saf-btn no ${value === 'no' ? 'sel' : ''}`}>Hayır</button>
                        <button onClick={() => setSafetyAnswers((prev) => ({ ...prev, [item.key]: 'yes' }))} className={`saf-btn yes ${value === 'yes' ? 'sel' : ''}`}>Evet</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {Object.values(safetyAnswers).includes('yes') && (
                <div className="safety-warn-compact">
                  <span>⚠️</span>
                  <span>Belirttiğiniz durumlar nedeniyle, egzersiz programına başlamadan önce doktorunuza danışmanızı öneririz.</span>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="step5-compact">
              <div className="section-header-compact">
                <h3>Postür Fotoğrafları</h3>
                <p>En doğru analiz için fotoğraf ekleyin • İsteğe bağlı</p>
              </div>
              
              {/* Compact Info Row */}
              <div className="photo-info-row">
                <span className="info-chip">🔒 KVKK korumalı</span>
                <span className="info-chip">💡 Dar kıyafet, düz arka plan</span>
              </div>
              
              {/* Photo Upload Cards */}
              <div className="photo-grid-compact">
                {([
                  { view: 'front', title: 'Önden', icon: '👤' },
                  { view: 'side', title: 'Yandan', icon: '↔️' },
                  { view: 'back', title: 'Arkadan', icon: '🔙' },
                ] as const).map(({ view, title, icon }) => (
                  <div
                    key={view}
                    className={`photo-card-compact ${photos[view] ? 'has-photo' : ''}`}
                    onClick={() => document.getElementById(`file-${view}`)?.click()}
                  >
                    {photos[view] ? (
                      <div className="photo-prev-compact">
                        <img src={photos[view] as string} alt={view} />
                        <div className="photo-badge">✓</div>
                      </div>
                    ) : (
                      <div className="photo-empty-compact">
                        <svg viewBox="0 0 50 100" className="sil-svg">
                          <ellipse cx="25" cy="12" rx="10" ry="11" fill="#d1d5db"/>
                          <rect x="20" y="22" width="10" height="8" rx="3" fill="#d1d5db"/>
                          <path d="M12 30 Q25 28 38 30 L40 55 Q25 60 10 55 Z" fill="#d1d5db"/>
                          <ellipse cx="25" cy="65" rx="14" ry="10" fill="#d1d5db"/>
                          <rect x="17" y="74" width="6" height="20" rx="3" fill="#d1d5db"/>
                          <rect x="27" y="74" width="6" height="20" rx="3" fill="#d1d5db"/>
                        </svg>
                        <span className="photo-add-icon">📷</span>
                      </div>
                    )}
                    <div className="photo-label">{icon} {title}</div>
                    <input id={`file-${view}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(view, e.target.files?.[0] || null)}/>
                  </div>
                ))}
              </div>
              
              <div className="photo-note-compact">
                ℹ️ Fotoğraf eklemeden de devam edebilirsiniz
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex items-center gap-4">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="back-btn"
          >
            ← Geri
          </button>
          <button
            onClick={goNext}
            className="next-btn"
          >
            {step === 5 ? '✓ Analizi Tamamla' : 'Devam Et →'}
          </button>
        </div>
      </div>

      <style>{`
        .assessment-modal {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        /* Global font size increase for readability */
        .assessment-modal * {
          font-size: inherit;
        }
        .assessment-modal {
          font-size: 18px;
        }
        
        /* Section Header */
        .section-header {
          margin-bottom: 4px;
        }
        .section-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .section-header p {
          font-size: 18px;
          color: #64748b;
          margin: 6px 0 0 0;
        }
        
        /* Compact Step 1 */
        .step1-compact {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .profile-top-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: start;
        }
        .gender-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .gender-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 20px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gender-btn:hover, .gender-btn.sel {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        .measures-compact {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .meas-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meas-label {
          font-size: 20px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .meas-item input {
          padding: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 26px;
          font-weight: 600;
          color: #1e293b;
          background: #f8fafc;
          width: 100%;
        }
        .meas-item input:focus {
          outline: none;
          border-color: #10b981;
          background: #fff;
        }
        .meas-unit {
          font-size: 18px;
          color: #94a3b8;
          margin-top: 4px;
        }
        .work-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .work-btns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .work-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 16px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 22px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .work-btn:hover, .work-btn.sel {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        .optional-compact {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
        }
        .opt-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .opt-field label {
          font-size: 22px;
          font-weight: 500;
          color: #475569;
        }
        .opt-tag {
          font-size: 16px;
          font-weight: 600;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 6px 10px;
          border-radius: 6px;
          margin-left: 6px;
        }
        .opt-field textarea {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          font-size: 20px;
          color: #334155;
          background: #f8fafc;
          resize: none;
        }
        .opt-field textarea:focus {
          outline: none;
          border-color: #10b981;
          background: #fff;
        }
        
        /* Gender Cards */
        .gender-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gender-card:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .gender-card.selected {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        .gender-icon {
          font-size: 32px;
        }
        .gender-label {
          font-size: 20px;
          font-weight: 600;
          color: #334155;
        }
        .gender-card.selected .gender-label {
          color: #047857;
        }
        
        /* Measurements Grid */
        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .measure-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .measure-field label {
          font-size: 18px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .measure-input-wrap {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .measure-input-wrap:focus-within {
          border-color: #10b981;
          background: #fff;
        }
        .measure-input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 16px;
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          width: 100%;
          outline: none;
        }
        .measure-input-wrap input::placeholder {
          color: #cbd5e1;
        }
        .measure-input-wrap .unit {
          padding: 0 16px;
          font-size: 18px;
          color: #94a3b8;
          font-weight: 500;
          background: #f1f5f9;
        }
        
        /* Work Section */
        .work-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .field-label {
          font-size: 18px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .work-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .work-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 18px 14px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .work-card:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .work-card.selected {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        .work-icon {
          font-size: 32px;
        }
        .work-label {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          text-align: center;
          line-height: 1.4;
        }
        .work-card.selected .work-label {
          color: #047857;
        }
        
        /* Optional Fields */
        .optional-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 8px;
          border-top: 1px dashed #e2e8f0;
        }
        .optional-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .optional-field label {
          font-size: 18px;
          font-weight: 500;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .optional-tag {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .optional-field textarea {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 18px;
          color: #334155;
          background: #f8fafc;
          resize: none;
          transition: all 0.2s;
        }
        .optional-field textarea:focus {
          outline: none;
          border-color: #10b981;
          background: #fff;
        }
        .optional-field textarea::placeholder {
          color: #94a3b8;
        }
        
        /* Navigation Buttons */
        .back-btn {
          padding: 18px 28px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 20px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .back-btn:hover:not(:disabled) {
          border-color: #cbd5e1;
          color: #334155;
        }
        .back-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .next-btn {
          flex: 1;
          padding: 18px 32px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .next-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        /* Legacy styles for other steps */
        .wizard-option-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s;
          width: 100%;
          justify-content: flex-start;
        }
        .wizard-option-btn.active {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        .wizard-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 18px;
          color: #4b5563;
        }
        .wizard-field input,
        .wizard-field textarea {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
          font-size: 20px;
          transition: border-color 0.2s;
        }
        .wizard-field input:focus,
        .wizard-field textarea:focus {
          outline: none;
          border-color: #10b981;
        }
        /* Compact Step 2 - Body Selection */
        .step2-compact {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 100%;
        }
        .section-header-compact {
          margin-bottom: 0;
        }
        .section-header-compact h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .section-header-compact p {
          font-size: 20px;
          color: #64748b;
          margin: 6px 0 0 0;
        }
        .body-diagrams-compact {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          flex: 1;
          min-height: 0;
        }
        .bottom-row-compact {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .selected-areas-compact {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 8px;
          min-height: 36px;
          align-items: center;
        }
        .empty-hint-sm {
          font-size: 18px;
          color: #94a3b8;
        }
        .area-tag-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 600;
          color: #047857;
        }
        .area-tag-sm button {
          background: none;
          border: none;
          color: #059669;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .manual-add-compact {
          display: flex;
          gap: 6px;
        }
        .manual-input-sm {
          width: 200px;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 18px;
        }
        .manual-input-sm:focus {
          outline: none;
          border-color: #10b981;
        }
        .manual-add-btn-sm {
          width: 50px;
          height: 50px;
          border: none;
          border-radius: 12px;
          background: #10b981;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
        }
        
        /* Compact Body Diagram */
        .body-diagram-new {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .body-diagram-new:hover {
          border-color: #10b981;
        }
        .body-diagram-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .body-view-icon {
          font-size: 20px;
        }
        .body-view-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .body-svg-container {
          padding: 8px;
          display: flex;
          justify-content: center;
          flex: 1;
          min-height: 0;
        }
        .body-svg-new {
          width: 100%;
          max-width: 160px;
          height: auto;
          max-height: 100%;
        }
        
        /* Legacy grid fallback */
        .body-diagrams-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        /* Pain area circles */
        .pain-area {
          fill: rgba(16, 185, 129, 0.15);
          stroke: #10b981;
          stroke-width: 2;
          stroke-dasharray: 4 2;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .pain-area:hover {
          fill: rgba(16, 185, 129, 0.35);
          stroke-width: 2.5;
          stroke-dasharray: none;
        }
        .pain-area.selected {
          fill: #10b981;
          stroke: #047857;
          stroke-width: 3;
          stroke-dasharray: none;
        }
        .pain-area-glow {
          fill: transparent;
          stroke: transparent;
          transition: all 0.25s ease;
        }
        .pain-area-glow.active {
          fill: rgba(16, 185, 129, 0.2);
          stroke: rgba(16, 185, 129, 0.4);
          stroke-width: 2;
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .pain-check {
          fill: #fff;
          font-size: 16px;
          font-weight: 700;
          pointer-events: none;
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        /* Legacy body diagram (fallback) */
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
          font-size: 20px;
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
          fill: #a7f3d0;
          stroke: #34d399;
        }
        .body-part.selected {
          fill: #34d399;
          stroke: #059669;
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
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #10b981;
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .pain-slider-ui::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .pain-slider-ui::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #10b981;
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .pain-slider-ui::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        .safety-card {
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          border-radius: 16px;
          padding: 14px;
        }
        .safety-btn {
          padding: 16px 24px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          background: #fff;
          font-size: 20px;
          font-weight: 700;
          color: #374151;
          transition: all 0.2s;
          min-width: 120px;
        }
        .safety-btn.active-yes {
          border-color: #22c55e;
          background: #dcfce7;
          color: #166534;
        }
        .safety-btn.active-no {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
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
        
        /* Step 2 - Body Selection */
        .selected-areas-wrap {
          min-height: 36px;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px dashed #e2e8f0;
        }
        .empty-hint {
          font-size: 18px;
          color: #94a3b8;
        }
        .selected-areas {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .area-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #a7f3d0;
          border-radius: 24px;
          font-size: 18px;
          font-weight: 600;
          color: #047857;
        }
        .area-tag button {
          background: none;
          border: none;
          color: #059669;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          opacity: 0.6;
        }
        .area-tag button:hover {
          opacity: 1;
        }
        .manual-add-row {
          display: flex;
          gap: 10px;
        }
        .manual-input {
          flex: 1;
          padding: 16px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 20px;
          color: #334155;
          background: #f8fafc;
          transition: all 0.2s;
        }
        .manual-input:focus {
          outline: none;
          border-color: #10b981;
          background: #fff;
        }
        .manual-input::placeholder {
          color: #94a3b8;
        }
        .manual-add-btn {
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          background: #10b981;
          color: #fff;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .manual-add-btn:hover {
          background: #059669;
        }
        
        /* Compact Step 3 */
        .step3-compact {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .step3-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 16px;
        }
        .field-label-sm {
          font-size: 20px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 8px;
        }
        .mt-3 { margin-top: 12px; }
        .opt-tag {
          font-size: 9px;
          font-weight: 600;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 2px 5px;
          border-radius: 4px;
          text-transform: uppercase;
          margin-left: 4px;
        }
        
        /* Duration Compact */
        .duration-compact {
          display: flex;
          flex-direction: column;
        }
        .duration-list-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .duration-item-compact {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .duration-item-compact:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .duration-item-compact.selected {
          border-color: #10b981;
          background: #ecfdf5;
        }
        .dur-icon {
          font-size: 20px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border-radius: 8px;
        }
        .duration-item-compact.selected .dur-icon {
          background: rgba(16, 185, 129, 0.2);
        }
        .dur-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .dur-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .dur-sub {
          font-size: 16px;
          color: #64748b;
        }
        .dur-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        
        /* Intensity Compact */
        .intensity-compact {
          display: flex;
          flex-direction: column;
        }
        .intensity-box {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
        }
        .intensity-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .int-emoji {
          font-size: 32px;
          line-height: 1;
        }
        .int-val {
          font-size: 24px;
          font-weight: 800;
        }
        .int-labels {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .int-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 8px;
          background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%);
          outline: none;
        }
        .int-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #1e293b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        .int-nums {
          display: flex;
          justify-content: space-between;
          padding: 0 2px;
          margin-top: 4px;
        }
        .int-nums span {
          font-size: 9px;
          font-weight: 600;
          color: #cbd5e1;
          width: 16px;
          text-align: center;
        }
        .int-nums span.act {
          color: #10b981;
        }
        
        /* Pain Types Compact */
        .pain-types-compact {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        .ptype-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ptype-btn:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .ptype-btn.sel {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        
        /* Legacy Step 3 styles */
        .step3-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .duration-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .duration-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .duration-card-new {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .duration-card-new:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .duration-card-new.selected {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        .duration-icon {
          font-size: 28px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border-radius: 12px;
        }
        .duration-card-new.selected .duration-icon {
          background: rgba(16, 185, 129, 0.2);
        }
        .duration-content {
          flex: 1;
        }
        .duration-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
        }
        .duration-helper {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .duration-check {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }
        
        /* Intensity Section */
        .intensity-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .intensity-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
        }
        .intensity-emoji-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .intensity-emoji {
          font-size: 48px;
          line-height: 1;
        }
        .intensity-value {
          font-size: 32px;
          font-weight: 800;
        }
        .intensity-slider-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .intensity-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
        }
        .intensity-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 10px;
          border-radius: 10px;
          background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%);
          outline: none;
        }
        .intensity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid #1e293b;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        .intensity-scale {
          display: flex;
          justify-content: space-between;
          padding: 0 4px;
        }
        .intensity-scale span {
          font-size: 11px;
          font-weight: 600;
          color: #cbd5e1;
          width: 20px;
          text-align: center;
        }
        .intensity-scale span.active {
          color: #10b981;
        }
        
        /* Pain Type Section */
        .pain-type-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pain-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }
        .pain-type-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 20px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pain-type-btn:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .pain-type-btn.selected {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        .pain-type-icon {
          font-size: 16px;
        }
        
        /* Compact Step 4 - Safety */
        .step4-compact {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .safety-list-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .safety-item-compact {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
        }
        .safety-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .safety-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .safety-ico {
          font-size: 20px;
          flex-shrink: 0;
        }
        .safety-txt {
          flex: 1;
          min-width: 0;
        }
        .safety-q {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          display: block;
          line-height: 1.4;
        }
        .safety-h {
          font-size: 16px;
          color: #64748b;
          display: block;
          margin-top: 4px;
        }
        .safety-btns {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .saf-btn {
          padding: 14px 20px;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 18px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .saf-btn.no:hover, .saf-btn.no.sel {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        .saf-btn.yes:hover {
          border-color: #f59e0b;
          background: #fffbeb;
        }
        .saf-btn.yes.sel {
          border-color: #f59e0b;
          background: #fef3c7;
          color: #b45309;
        }
        .safety-warn-compact {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 10px;
          font-size: 12px;
          color: #92400e;
        }
        
        /* Legacy Step 4 styles */
        .step4-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .safety-info-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #a7f3d0;
          border-radius: 14px;
        }
        .safety-info-icon {
          font-size: 32px;
        }
        .safety-info-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .safety-info-text strong {
          font-size: 20px;
          color: #047857;
        }
        .safety-info-text span {
          font-size: 18px;
          color: #059669;
        }
        .safety-questions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .safety-question-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          transition: all 0.2s;
        }
        .safety-question-card:hover {
          border-color: #cbd5e1;
        }
        .safety-question-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .safety-question-icon {
          font-size: 32px;
          flex-shrink: 0;
        }
        .safety-question-content {
          flex: 1;
          min-width: 0;
        }
        .safety-question-text {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.5;
        }
        .safety-question-helper {
          font-size: 18px;
          color: #64748b;
          margin-top: 6px;
        }
        .safety-answer-buttons {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .safety-answer-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px 22px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-size: 20px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }
        .safety-answer-btn .btn-icon {
          font-size: 24px;
        }
        .safety-answer-btn.no:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .safety-answer-btn.no.selected {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }
        .safety-answer-btn.yes:hover {
          border-color: #f59e0b;
          background: #fffbeb;
        }
        .safety-answer-btn.yes.selected {
          border-color: #f59e0b;
          background: #fef3c7;
          color: #b45309;
        }
        .safety-warning-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #fbbf24;
          border-radius: 14px;
        }
        .safety-warning-box .warning-icon {
          font-size: 24px;
        }
        .safety-warning-box .warning-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .safety-warning-box .warning-content strong {
          font-size: 14px;
          color: #92400e;
        }
        .safety-warning-box .warning-content p {
          font-size: 13px;
          color: #a16207;
          margin: 0;
          line-height: 1.4;
        }
        
        /* Compact Step 5 - Photo Upload */
        .step5-compact {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .photo-info-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .info-chip {
          padding: 6px 12px;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
        }
        .photo-grid-compact {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .photo-card-compact {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
        }
        .photo-card-compact:hover {
          border-color: #10b981;
          border-style: solid;
          background: #f0fdf4;
        }
        .photo-card-compact.has-photo {
          border-style: solid;
          border-color: #10b981;
        }
        .photo-empty-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 10px;
          gap: 6px;
          height: 130px;
        }
        .sil-svg {
          width: 50px;
          height: 80px;
        }
        .photo-add-icon {
          font-size: 20px;
        }
        .photo-prev-compact {
          position: relative;
          height: 130px;
        }
        .photo-prev-compact img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .photo-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photo-label {
          padding: 12px;
          background: #fff;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        .photo-note-compact {
          font-size: 20px;
          color: #64748b;
          text-align: center;
          padding: 16px;
          background: #f1f5f9;
          border-radius: 12px;
        }
        .photo-note-compact-old {
          text-align: center;
          font-size: 18px;
          color: #64748b;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        /* Legacy Step 5 styles */
        .step5-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .photo-info-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .photo-info-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
        }
        .photo-info-card.privacy {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
        }
        .photo-info-card.tips {
          background: linear-gradient(135deg, #fefce8 0%, #fef08a 100%);
          border: 1px solid #fde047;
        }
        .info-card-icon {
          font-size: 24px;
        }
        .info-card-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .info-card-content strong {
          font-size: 18px;
          color: #1e293b;
        }
        .info-card-content span {
          font-size: 16px;
          color: #64748b;
        }
        .photo-upload-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .photo-upload-card {
          border: 2px dashed #d1d5db;
          border-radius: 16px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
        }
        .photo-upload-card:hover {
          border-color: #10b981;
          border-style: solid;
          background: #f0fdf4;
        }
        .photo-upload-card.has-photo {
          border-style: solid;
          border-color: #10b981;
        }
        .photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          gap: 8px;
        }
        .photo-silhouette {
          width: 60px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .silhouette-svg {
          width: 100%;
          height: 100%;
        }
        .photo-upload-icon {
          font-size: 24px;
        }
        .photo-upload-text {
          font-size: 18px;
          font-weight: 600;
          color: #64748b;
        }
        .photo-preview-wrap {
          position: relative;
          height: 140px;
        }
        .photo-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .photo-preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .photo-upload-card:hover .photo-preview-overlay {
          opacity: 1;
        }
        .photo-change-btn {
          padding: 8px 14px;
          background: #fff;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
        }
        .photo-success-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photo-card-footer {
          padding: 12px;
          background: #fff;
          text-align: center;
        }
        .photo-card-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }
        .photo-card-hint {
          font-size: 18px;
          color: #64748b;
          margin-top: 4px;
        }
        .photo-skip-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 10px;
        }
        .photo-skip-note .skip-icon {
          font-size: 16px;
        }
        .photo-skip-note span {
          font-size: 12px;
          color: #64748b;
        }
        
        /* Legacy Duration Cards */
        .duration-card {
          padding: 16px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .duration-card:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }
        .duration-card.selected {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        
        @media (max-width: 640px) {
          .measurements-grid {
            grid-template-columns: 1fr;
          }
          .work-options {
            grid-template-columns: 1fr;
          }
          .body-diagrams-grid, .body-diagrams-compact {
            grid-template-columns: 1fr;
          }
          .body-svg-new {
            max-width: 180px;
          }
          .photo-info-cards {
            grid-template-columns: 1fr;
          }
          .photo-upload-grid {
            grid-template-columns: 1fr;
          }
          .safety-question-card {
            flex-wrap: wrap;
          }
          .safety-answer-buttons {
            width: 100%;
            margin-top: 10px;
          }
          .safety-answer-btn {
            flex: 1;
          }
          .step3-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AssessmentWizard;
