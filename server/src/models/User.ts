import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Kullanıcı Modeli - Güvenli şifre hashleme ile
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  packageType: 'none' | 'basic' | 'pro' | 'premium';
  packageExpiry?: Date;
  dashboardData?: {
    assessmentResults?: any;
    exercisePrograms?: any[];
    progressData?: any;
    notifications?: any[];
    photos?: any;
    formData?: any;
    clinicalAssessments?: any; // Klinik test assessment'ları
    lastLogin?: Date;
    lastAssessmentDate?: Date; // Son assessment tarihi
    lastClinicalAssessmentDate?: Date; // Son klinik test tarihi
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'E-posta adresi gereklidir'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz'],
    },
    password: {
      type: String,
      required: [true, 'Şifre gereklidir'],
      minlength: [8, 'Şifre en az 8 karakter olmalıdır'],
      select: false, // Varsayılan olarak password'ü döndürme (güvenlik)
    },
    name: {
      type: String,
      required: [true, 'İsim gereklidir'],
      trim: true,
      maxlength: [100, 'İsim en fazla 100 karakter olabilir'],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string | undefined) {
          // Telefon boş veya undefined ise geçerli (opsiyonel)
          if (!v || v.trim() === '') return true;
          // Telefon varsa format kontrolü yap
          return /^[0-9+\-\s()]+$/.test(v);
        },
        message: 'Geçerli bir telefon numarası giriniz',
      },
    },
    packageType: {
      type: String,
      enum: ['none', 'basic', 'pro', 'premium'],
      default: 'none',
    },
    packageExpiry: {
      type: Date,
    },
    dashboardData: {
      type: {
        assessmentResults: Schema.Types.Mixed,
        exercisePrograms: [Schema.Types.Mixed],
        progressData: Schema.Types.Mixed,
        notifications: [Schema.Types.Mixed],
        photos: Schema.Types.Mixed,
        formData: Schema.Types.Mixed,
        clinicalAssessments: Schema.Types.Mixed, // Klinik test assessment'ları
        lastLogin: Date,
        lastAssessmentDate: Date, // Son assessment tarihi
        lastClinicalAssessmentDate: Date, // Son klinik test tarihi
      },
      default: {},
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // JSON'a dönüştürürken password'ü çıkar
        return ret;
      },
    },
  }
);

// Şifreyi hashle (kaydetmeden önce)
userSchema.pre('save', async function (next) {
  // Eğer password değişmediyse, tekrar hashleme
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // bcrypt ile güvenli hashleme (10 rounds - güvenlik/performans dengesi)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Not: Email için unique index zaten 'unique: true' ile otomatik oluşturuluyor

export const User = mongoose.model<IUser>('User', userSchema);


