import React from 'react';

const stats = [
  { icon: '✓', label: 'Tamamen Kişiye Özel' },
  { icon: '⏰', label: '7/24 Dijital Destek' },
  { icon: '🔬', label: 'Bilimsel Metodoloji' },
];

const values = [
  {
    title: 'Bilimin Işığında',
    color: 'text-blue-600',
    text: 'Uyguladığımız tüm yöntemler ve egzersiz programları, güncel fizyoterapi literatürüne ve bilimsel çalışmalara dayanır.',
  },
  {
    title: 'Sürdürülebilir İyileşme',
    color: 'text-purple-600',
    text: 'Anlık ağrı kesici çözümler değil, sorunun kök nedenine inen ve kalıcı iyileşmeyi hedefleyen alışkanlıklar kazandırırız.',
  },
  {
    title: 'Ulaşılabilirlik',
    color: 'text-pink-600',
    text: 'Profesyonel sağlık desteğini lüks olmaktan çıkarıp, dilediğiniz yerde ve zamanda ulaşabileceğiniz bir hizmete dönüştürüyoruz.',
  },
];

const WebinarPromo: React.FC = () => {
  return (
    <section
      id="about"
      className="w-full bg-white"
      style={{ scrollMarginTop: '140px' }}
    >
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#4f6edc] via-[#5c5db4] to-[#6a3fb0] text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Hareketin Bilimsel Formülü
          </h1>
          <p className="text-2xl md:text-3xl font-semibold opacity-90">EgzersizLab</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((item) => (
            <div
              key={item.label}
              className="stat-card bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 rounded-2xl p-8 text-center shadow-sm transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <p className="text-xl font-semibold text-slate-800">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-14">
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Biz Kimiz?</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              EgzersizLab, modern tıbbın kanıta dayalı rehabilitasyon yöntemlerini, dijital teknolojinin hızı ve
              erişilebilirliği ile birleştiren yeni nesil bir sağlık teknolojisi girişimidir. Amacımız, coğrafi
              sınırları ortadan kaldırarak herkesin doğru, güvenilir ve kişiye özel sağlık danışmanlığına ulaşmasını
              sağlamaktır.
            </p>
          </section>

          <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Misyonumuz</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              İnternetteki bilgi kirliliği ve herkese aynı programı sunan standart yaklaşımların aksine; her bireyin
              anatomisinin, yaşam tarzının ve ağrı geçmişinin &quot;parmak izi&quot; gibi benzersiz olduğuna inanıyoruz.
              EgzersizLab olarak, sağlığı şansa bırakmıyor; süreci bir laboratuvar titizliğiyle analiz edip, kişiye en
              uygun iyileşme haritasını çıkarıyoruz.
            </p>
          </section>

          <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Değerlerimiz</h2>
            <div className="space-y-5">
              {values.map((val) => (
                <div
                  key={val.title}
                  className="value-card bg-white rounded-xl p-6 shadow-sm border-l-4 border-transparent transition hover:border-l-blue-500 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-transparent"
                >
                  <h3 className={`text-xl font-bold mb-2 ${val.color}`}>{val.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{val.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <section className="text-center">
            <p className="text-xl text-slate-800 leading-relaxed mb-4">
              Vücudunuz, içinde yaşadığınız en değerli evinizdir. EgzersizLab ekibi olarak, o eve en iyi şekilde bakmanız
              için gereken bilgiyi ve desteği sağlamak üzere yanınızdayız.
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hareket özgürlüktür. Bilimle hareket edin.
            </p>
          </section>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-lg font-semibold text-slate-800">EgzersizLab Ekibi</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarPromo;
