import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  packageType?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    rating: 5,
    comment: 'Bel ağrılarım için aldığım program sayesinde 2 ayda çok büyük ilerleme kaydettim. Fizyoterapist desteği harika!',
    date: '2 hafta önce',
    packageType: 'Klinik Paket',
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    rating: 5,
    comment: 'Diz cerrahisi sonrası rehabilitasyon sürecimde çok yardımcı oldu. Video anlatımlar çok net ve anlaşılır.',
    date: '1 ay önce',
    packageType: 'Premium Paket',
  },
  {
    id: 3,
    name: 'Zeynep Kaya',
    rating: 5,
    comment: 'Boyun ağrılarım için kişiselleştirilmiş program aldım. Artık günlük hayatımda çok daha rahatım. Teşekkürler!',
    date: '3 hafta önce',
    packageType: 'Temel Paket',
  },
  {
    id: 4,
    name: 'Ali Çelik',
    rating: 5,
    comment: 'Premium paket ile fizyoterapistimle sürekli iletişim halindeyim. Sorularıma anında cevap alıyorum. Mükemmel!',
    date: '1 hafta önce',
    packageType: 'Premium Paket',
  },
  {
    id: 5,
    name: 'Fatma Özkan',
    rating: 5,
    comment: 'Omuz problemim için aldığım program gerçekten işe yaradı. Egzersizler çok etkili ve kolay takip edilebilir.',
    date: '2 ay önce',
    packageType: 'Klinik Paket',
  },
  {
    id: 6,
    name: 'Can Arslan',
    rating: 5,
    comment: 'Spor yaralanması sonrası hızlı toparlanmamı sağladı. Profesyonel yaklaşım ve kişiselleştirilmiş program harika!',
    date: '3 hafta önce',
    packageType: 'Premium Paket',
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Otomatik kaydırma
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 saniyede bir değişir

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden"
      style={{ scrollMarginTop: '140px' }}
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Binlerce mutlu kullanıcımızın deneyimlerini keşfedin
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-xl font-bold text-slate-900 ml-2">4.9/5</span>
            <span className="text-slate-600 ml-2">(247 değerlendirme)</span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Carousel */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full px-4"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Rating and Info */}
                      <div className="md:w-1/3 flex flex-col items-center md:items-start">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                          {testimonial.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {testimonial.name}
                        </h3>
                        {testimonial.packageType && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
                            {testimonial.packageType}
                          </span>
                        )}
                        {renderStars(testimonial.rating)}
                        <p className="text-sm text-slate-500 mt-2">{testimonial.date}</p>
                      </div>

                      {/* Right: Comment */}
                      <div className="md:w-2/3 flex items-center">
                        <div>
                          <div className="text-4xl text-blue-200 mb-4">"</div>
                          <p className="text-lg text-slate-700 leading-relaxed italic">
                            {testimonial.comment}
                          </p>
                          <div className="text-4xl text-blue-200 mt-4 text-right">"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-all z-10 border border-gray-200"
            aria-label="Önceki yorum"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-all z-10 border border-gray-200"
            aria-label="Sonraki yorum"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Yorum ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Multiple Cards View (Desktop) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                "{testimonial.comment}"
              </p>
              {testimonial.packageType && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {testimonial.packageType}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;



