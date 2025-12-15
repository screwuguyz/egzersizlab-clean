import nodemailer from 'nodemailer';

/**
 * Email Transporter Oluştur
 * .env dosyasından SMTP ayarlarını alır
 */
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Development modu: SMTP ayarları yoksa konsola yazdır
  if (!smtpUser || !smtpPass) {
    console.log('⚠️  SMTP ayarları bulunamadı. Development modu aktif.');
    console.log('📧 Email gönderimi konsola yazdırılacak.');
    return null;
  }

  // Gmail STARTTLS (587), IPv4 zorlamalı, kısa timeout
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    requireTLS: true,
    connectionTimeout: 5000,  // 5 saniye - daha kısa
    greetingTimeout: 5000,    // 5 saniye
    socketTimeout: 8000,      // 8 saniye
    tls: {
      rejectUnauthorized: false,
    },
    family: 4, // IPv4 zorla
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

/**
 * Aktivasyon Kodu Gönder
 */
export const sendVerificationCode = async (
  email: string,
  code: string,
  name: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EgzersizLab" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'EgzersizLab - E-posta Aktivasyon Kodu',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EgzersizLab</h1>
              <p>Hesap Aktivasyonu</p>
            </div>
            <div class="content">
              <p>Merhaba <strong>${name}</strong>,</p>
              <p>EgzersizLab'a hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki 4 haneli kodu kullanın:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p><strong>Önemli:</strong></p>
              <ul>
                <li>Bu kod 10 dakika geçerlidir</li>
                <li>Kodu kimseyle paylaşmayın</li>
                <li>Bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelin</li>
              </ul>
              
              <p>Sağlıklı günler dileriz,<br><strong>EgzersizLab Ekibi</strong></p>
            </div>
            <div class="footer">
              <p>Bu otomatik bir e-postadır. Lütfen yanıtlamayın.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
EgzersizLab - E-posta Aktivasyon Kodu

Merhaba ${name},

EgzersizLab'a hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki 4 haneli kodu kullanın:

${code}

Önemli:
- Bu kod 10 dakika geçerlidir
- Kodu kimseyle paylaşmayın
- Bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelin

Sağlıklı günler dileriz,
EgzersizLab Ekibi
    `,
  };

  // Development modu: Konsola yazdır
  if (!transporter) {
    console.log('\n📧 ===== EMAIL (Development Mode) =====');
    console.log(`To: ${email}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Code: ${code}`);
    console.log('=====================================\n');
    return;
  }

  // Production: Email gönder
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Aktivasyon kodu gönderildi: ${email}`);
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    throw new Error('Email gönderilemedi. Lütfen tekrar deneyin.');
  }
};

/**
 * Şifre Sıfırlama Kodu Gönder
 */
export const sendPasswordResetCode = async (
  email: string,
  code: string,
  name: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"EgzersizLab" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'EgzersizLab - Şifre Sıfırlama Kodu',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 8px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Şifre Sıfırlama</h1>
              <p>EgzersizLab</p>
            </div>
            <div class="content">
              <p>Merhaba <strong>${name}</strong>,</p>
              <p>Şifrenizi sıfırlamak için aşağıdaki 4 haneli kodu kullanın:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <div class="warning">
                <p><strong>⚠️ Güvenlik Uyarısı:</strong></p>
                <ul>
                  <li>Bu kod 10 dakika geçerlidir</li>
                  <li>Kodu kimseyle paylaşmayın</li>
                  <li>Bu işlemi siz yapmadıysanız, hesabınızı korumak için derhal bizimle iletişime geçin</li>
                </ul>
              </div>
              
              <p>Sağlıklı günler dileriz,<br><strong>EgzersizLab Ekibi</strong></p>
            </div>
            <div class="footer">
              <p>Bu otomatik bir e-postadır. Lütfen yanıtlamayın.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
EgzersizLab - Şifre Sıfırlama Kodu

Merhaba ${name},

Şifrenizi sıfırlamak için aşağıdaki 4 haneli kodu kullanın:

${code}

⚠️ Güvenlik Uyarısı:
- Bu kod 10 dakika geçerlidir
- Kodu kimseyle paylaşmayın
- Bu işlemi siz yapmadıysanız, hesabınızı korumak için derhal bizimle iletişime geçin

Sağlıklı günler dileriz,
EgzersizLab Ekibi
    `,
  };

  // Development modu: Konsola yazdır
  if (!transporter) {
    console.log('\n📧 ===== ŞİFRE SIFIRLAMA KODU (Development Mode) =====');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`E-posta: ${email}`);
    console.log(`Kod: ${code}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    return;
  }

  // Production: Email gönder
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Şifre sıfırlama kodu EMAIL ile gönderildi: ${email}`);
  } catch (error: any) {
    console.error('❌ Email gönderme hatası:', error.message);
    console.error('❌ Hata detayı:', error);
    // Email gönderilemediyse hatayı fırlat - kullanıcı bilgilendirilsin
    throw new Error(`Email gönderilemedi: ${error.message}`);
  }
};

