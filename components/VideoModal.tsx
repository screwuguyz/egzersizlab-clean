import React, { useState } from 'react';

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ open, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!open) return null;

  // YouTube video ID - bunu kendi videonuzla değiştirin
  // Örnek: https://www.youtube.com/watch?v=VIDEO_ID → VIDEO_ID kısmını alın
  const youtubeVideoId = 'gC_L9qAHVJ8'; // EgzersizLab tanıtım videosu

  const steps = [
    { icon: '📝', title: 'Değerlendirme', desc: '3 dakikalık form' },
    { icon: '🔍', title: 'Analiz', desc: 'Uzman incelemesi' },
    { icon: '📋', title: 'Program', desc: 'Kişiye özel plan' },
    { icon: '🏋️', title: 'Egzersiz', desc: 'Video rehberlik' },
  ];

  return (
    <div className="video-overlay" onClick={onClose}>
      <style>{`
        .video-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        
        .video-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 800px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.4s ease;
        }
        
        .video-header {
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
          padding: 20px 24px;
          color: white;
          position: relative;
        }
        .video-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .video-header p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }
        .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .close-btn:hover { background: rgba(255, 255, 255, 0.3); transform: rotate(90deg); }
        
        .video-container {
          position: relative;
          background: #000;
          aspect-ratio: 16/9;
        }
        
        .video-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          cursor: pointer;
        }
        
        .play-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5);
          animation: pulse 2s infinite;
        }
        .play-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(236, 72, 153, 0.6);
        }
        .play-icon {
          width: 0;
          height: 0;
          border-left: 28px solid white;
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
          margin-left: 6px;
        }
        
        .video-title-overlay {
          color: white;
          margin-top: 20px;
          text-align: center;
        }
        .video-title-overlay h3 {
          margin: 0 0 6px 0;
          font-size: 18px;
        }
        .video-title-overlay p {
          margin: 0;
          font-size: 13px;
          opacity: 0.7;
        }
        
        .video-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .video-footer {
          padding: 20px 24px;
          background: #f8fafc;
        }
        .footer-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 16px 0;
          text-align: center;
        }
        
        .steps-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .step-item {
          flex: 1;
          text-align: center;
          padding: 12px 8px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          position: relative;
        }
        .step-item:not(:last-child)::after {
          content: '→';
          position: absolute;
          right: -14px;
          top: 50%;
          transform: translateY(-50%);
          color: #cbd5e1;
          font-size: 16px;
        }
        .step-icon {
          font-size: 24px;
          margin-bottom: 6px;
        }
        .step-title {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }
        .step-desc {
          font-size: 10px;
          color: #94a3b8;
        }
        
        .cta-section {
          margin-top: 16px;
          text-align: center;
        }
        .cta-btn {
          padding: 12px 28px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
        }
      `}</style>

      <div className="video-modal" onClick={(e) => e.stopPropagation()}>
        <div className="video-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>🎬 Sistem Nasıl İşliyor?</h2>
          <p>1 dakikalık tanıtım videosu</p>
        </div>

        <div className="video-container">
          {!isPlaying ? (
            <div className="video-placeholder" onClick={() => setIsPlaying(true)}>
              <div className="play-button">
                <div className="play-icon" />
              </div>
              <div className="video-title-overlay">
                <h3>Videoyu İzle</h3>
                <p>Tıklayarak başlat • 1:24</p>
              </div>
            </div>
          ) : (
            <iframe
              className="video-iframe"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="EgzersizLab Tanıtım Videosu"
            />
          )}
        </div>

        <div className="video-footer">
          <h4 className="footer-title">4 Adımda Sağlıklı Yaşam</h4>
          <div className="steps-row">
            {steps.map((step, i) => (
              <div key={i} className="step-item">
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="cta-section">
            <button className="cta-btn" onClick={onClose}>
              ▶ Hemen Başla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

