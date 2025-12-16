import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface ExerciseProgramModalProps {
  open: boolean;
  onClose: () => void;
}

interface ExerciseProgram {
  id: string;
  title: string;
  description: string;
  exercises: string;
  frequency: number;
  duration: number;
  notes: string;
  assignedAt: string;
  status: string;
  progress: number;
  completedSessions: number;
  totalSessions: number;
}

const ExerciseProgramModal: React.FC<ExerciseProgramModalProps> = ({ open, onClose }) => {
  const [program, setProgram] = useState<ExerciseProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProgram, setNoProgram] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadProgram();
    }
  }, [open]);

  const loadProgram = async () => {
    setLoading(true);
    try {
      const response: any = await apiService.getDashboardData();
      const programs = response?.data?.exercisePrograms || response?.exercisePrograms || [];
      
      const activeProgram = programs.find((p: any) => p.status === 'active');
      
      if (activeProgram) {
        setProgram(activeProgram);
        setNoProgram(false);
      } else {
        setProgram(null);
        setNoProgram(true);
      }
    } catch (error) {
      console.error('Program yüklenemedi:', error);
      setNoProgram(true);
    } finally {
      setLoading(false);
    }
  };

  // Egzersiz metnini parse et ve bölümlere ayır
  const parseExercises = (text: string) => {
    const sections: { title: string; icon: string; color: string; items: string[] }[] = [];
    let currentSection: { title: string; icon: string; color: string; items: string[] } | null = null;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Bölüm başlığı kontrolü (1. ISSINMA, 2. ANA EGZERSİZLER, vb.)
      if (/^[0-9]+\.?\s*[A-ZÇĞİÖŞÜ\s]+(\(.*\))?$/i.test(trimmed) || 
          trimmed.toUpperCase().includes('ISINMA') ||
          trimmed.toUpperCase().includes('ISITMA') ||
          trimmed.toUpperCase().includes('SOĞUMA') ||
          trimmed.toUpperCase().includes('ANA ') ||
          trimmed.toUpperCase().includes('NOTLAR')) {
        
        let icon = '🏋️';
        let color = '#6366f1';
        
        if (trimmed.toUpperCase().includes('ISIN') || trimmed.toUpperCase().includes('ISIT')) {
          icon = '🔥';
          color = '#f97316';
        } else if (trimmed.toUpperCase().includes('SOĞU') || trimmed.toUpperCase().includes('ESNE')) {
          icon = '❄️';
          color = '#06b6d4';
        } else if (trimmed.toUpperCase().includes('NOT')) {
          icon = '📝';
          color = '#eab308';
        } else if (trimmed.toUpperCase().includes('ANA') || trimmed.toUpperCase().includes('GÜÇLEN')) {
          icon = '💪';
          color = '#10b981';
        }
        
        currentSection = { title: trimmed, icon, color, items: [] };
        sections.push(currentSection);
      } else if (currentSection && trimmed.startsWith('-')) {
        currentSection.items.push(trimmed.substring(1).trim());
      } else if (currentSection && trimmed) {
        currentSection.items.push(trimmed);
      } else if (!currentSection && trimmed) {
        // Bölüm yoksa genel egzersizler olarak ekle
        if (!sections.find(s => s.title === 'Egzersizler')) {
          sections.push({ title: 'Egzersizler', icon: '🏋️', color: '#6366f1', items: [] });
        }
        const generalSection = sections.find(s => s.title === 'Egzersizler');
        if (generalSection) {
          generalSection.items.push(trimmed.startsWith('-') ? trimmed.substring(1).trim() : trimmed);
        }
      }
    });
    
    return sections;
  };

  if (!open) return null;

  const exerciseSections = program ? parseExercises(program.exercises) : [];

  return (
    <div className="program-modal-overlay">
      <style>{`
        .program-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes modalSlideUp { 
          from { opacity: 0; transform: translateY(30px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        
        .program-modal-box {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 24px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalSlideUp 0.4s ease;
        }
        
        .program-header {
          background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
          padding: 28px 28px 24px;
          position: relative;
          overflow: hidden;
        }
        .program-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        .program-header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .program-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        .program-close-btn:hover { 
          background: rgba(255, 255, 255, 0.3); 
          transform: scale(1.1);
        }
        
        .program-title-section {
          position: relative;
          z-index: 5;
        }
        .program-icon {
          font-size: 48px;
          margin-bottom: 12px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        .program-title {
          font-size: 26px;
          font-weight: 800;
          color: white;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .program-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          margin: 0;
          line-height: 1.5;
        }
        
        .program-stats {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          position: relative;
          z-index: 5;
        }
        .program-stat {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 10px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .program-stat-icon {
          font-size: 18px;
        }
        .program-stat-text {
          font-size: 13px;
          font-weight: 600;
          color: white;
        }
        
        .program-content {
          padding: 24px;
          max-height: 55vh;
          overflow-y: auto;
        }
        .program-content::-webkit-scrollbar {
          width: 6px;
        }
        .program-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .program-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .exercise-section {
          margin-bottom: 20px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .exercise-section:hover {
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .section-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .section-header:hover {
          filter: brightness(0.98);
        }
        .section-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          background: rgba(255,255,255,0.5);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .section-title {
          flex: 1;
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .section-count {
          background: rgba(255,255,255,0.7);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }
        .section-toggle {
          font-size: 14px;
          transition: transform 0.3s;
        }
        .section-toggle.open {
          transform: rotate(180deg);
        }
        
        .section-content {
          padding: 0 20px 20px;
        }
        
        .exercise-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 16px;
          background: white;
          border-radius: 12px;
          margin-bottom: 10px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s;
        }
        .exercise-item:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }
        .exercise-item:last-child {
          margin-bottom: 0;
        }
        
        .exercise-number {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          flex-shrink: 0;
        }
        .exercise-text {
          flex: 1;
          font-size: 14px;
          color: #334155;
          line-height: 1.6;
        }
        .exercise-highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
          color: #92400e;
          display: inline;
          margin-left: 6px;
        }
        
        .notes-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #fcd34d;
          border-radius: 16px;
          padding: 20px;
          margin-top: 8px;
        }
        .notes-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .notes-icon {
          font-size: 24px;
        }
        .notes-title {
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
          margin: 0;
        }
        .notes-content {
          font-size: 14px;
          color: #78350f;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        
        .program-footer {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .program-date {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .start-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .no-program {
          text-align: center;
          padding: 80px 20px;
        }
        .no-program-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.8;
        }
        .no-program h3 {
          font-size: 22px;
          color: #1e293b;
          margin: 0 0 12px 0;
          font-weight: 700;
        }
        .no-program p {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          max-width: 300px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .loading {
          text-align: center;
          padding: 80px 20px;
          color: #64748b;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="program-modal-box">
        <div className="program-header">
          <button className="program-close-btn" onClick={onClose}>×</button>
          
          {program && (
            <div className="program-title-section">
              <div className="program-icon">📋</div>
              <h2 className="program-title">{program.title}</h2>
              {program.description && (
                <p className="program-subtitle">{program.description}</p>
              )}
              
              <div className="program-stats">
                <div className="program-stat">
                  <span className="program-stat-icon">📅</span>
                  <span className="program-stat-text">{program.frequency}x / hafta</span>
                </div>
                <div className="program-stat">
                  <span className="program-stat-icon">⏱️</span>
                  <span className="program-stat-text">{program.duration} hafta</span>
                </div>
                <div className="program-stat">
                  <span className="program-stat-icon">🎯</span>
                  <span className="program-stat-text">{program.frequency * program.duration} seans</span>
                </div>
              </div>
            </div>
          )}
          
          {!program && !loading && (
            <div className="program-title-section">
              <div className="program-icon">📋</div>
              <h2 className="program-title">Egzersiz Programım</h2>
            </div>
          )}
        </div>

        <div className="program-content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Program yükleniyor...</p>
            </div>
          ) : noProgram ? (
            <div className="no-program">
              <div className="no-program-icon">📭</div>
              <h3>Henüz Program Atanmadı</h3>
              <p>Değerlendirmeniz tamamlandıktan sonra size özel bir egzersiz programı hazırlanacak.</p>
            </div>
          ) : program && (
            <>
              {exerciseSections.map((section, sIdx) => (
                <div 
                  key={sIdx} 
                  className="exercise-section"
                  style={{ background: `linear-gradient(135deg, ${section.color}10 0%, ${section.color}05 100%)` }}
                >
                  <div 
                    className="section-header"
                    style={{ background: `linear-gradient(135deg, ${section.color}20 0%, ${section.color}10 100%)` }}
                    onClick={() => setActiveSection(activeSection === section.title ? null : section.title)}
                  >
                    <div className="section-icon" style={{ background: `${section.color}20` }}>
                      {section.icon}
                    </div>
                    <h3 className="section-title">{section.title}</h3>
                    <span className="section-count">{section.items.length} egzersiz</span>
                    <span className={`section-toggle ${activeSection === section.title || activeSection === null ? 'open' : ''}`}>
                      ▼
                    </span>
                  </div>
                  
                  {(activeSection === section.title || activeSection === null) && (
                    <div className="section-content">
                      {section.items.map((item, iIdx) => {
                        // Set ve tekrar bilgisini ayıkla
                        const match = item.match(/(\d+\s*(?:set|seri)?\s*[x×]\s*\d+\s*(?:tekrar|saniye|sn|dk|dakika)?)/i);
                        const highlight = match ? match[1] : null;
                        const text = highlight ? item.replace(highlight, '').trim() : item;
                        
                        return (
                          <div key={iIdx} className="exercise-item">
                            <div className="exercise-number" style={{ background: `linear-gradient(135deg, ${section.color}20 0%, ${section.color}10 100%)`, color: section.color }}>
                              {iIdx + 1}
                            </div>
                            <div className="exercise-text">
                              {text.replace(/^[:\-\s]+/, '')}
                              {highlight && (
                                <span className="exercise-highlight">{highlight}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {program.notes && (
                <div className="notes-section">
                  <div className="notes-header">
                    <span className="notes-icon">⚠️</span>
                    <h3 className="notes-title">Önemli Notlar</h3>
                  </div>
                  <div className="notes-content">{program.notes}</div>
                </div>
              )}
            </>
          )}
        </div>
        
        {program && (
          <div className="program-footer">
            <div className="program-date">
              📌 Atanma: {new Date(program.assignedAt).toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <button className="start-button" onClick={onClose}>
              🚀 Başla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseProgramModal;
