import nodemailer from 'nodemailer';

/**
 * Email Servisi - Aktivasyon kodu gönderme
 */

// Email transporter oluştur
const createTransporter = () => {
  // Gmail için (development)
  if (process.env.SMTP_HOST === 'smtp.gmail.com') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    });
  }

  // Generic SMTP (production için)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * 4 haneli aktivasyon kodu gönder
 */
export const sendVerificationCode = async (
  email: string,
  code: string,
  name: string
): Promise<void> => {
  try {
    // Email servisi yapılandırılmamışsa konsola yazdır (development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`
📧 EMAIL AKTİVASYON KODU (Development Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
E-posta: ${email}
Kod: ${code}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Not: Production'da gerçek email gönderilecek.
SMTP ayarlarını .env dosyasına ekleyin.
      `);
      return;
    }

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
            .code-box { background: white; border: 3px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EgzersizLab</h1>
              <p>E-posta Aktivasyonu</p>
            </div>
            <div class="content">
              <p>Merhaba <strong>${name}</strong>,</p>
              <p>EgzersizLab'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki 4 haneli kodu kullanın:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p>Bu kod <strong>10 dakika</strong> geçerlidir.</p>
              <p>Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            </div>
            <div class="footer">
              <p>© 2024 EgzersizLab. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
EgzersizLab - E-posta Aktivasyon Kodu

Merhaba ${name},

EgzersizLab'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki 4 haneli kodu kullanın:

${code}

Bu kod 10 dakika geçerlidir.

Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.

© 2024 EgzersizLab
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Aktivasyon kodu gönderildi: ${email}`);
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    throw new Error('Email gönderilemedi. Lütfen daha sonra tekrar deneyin.');
  }
};

