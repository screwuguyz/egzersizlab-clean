import mongoose, { Document, Schema } from 'mongoose';

/**
 * Şifre Sıfırlama Kodu Modeli
 */
export interface IPasswordResetCode extends Document {
  email: string;
  code: string; // 4 haneli kod
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const passwordResetCodeSchema = new Schema<IPasswordResetCode>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      length: 4,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index - otomatik silme
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Email ve code için compound index (hızlı arama)
passwordResetCodeSchema.index({ email: 1, code: 1 });

// Expired kodları otomatik sil (TTL)
passwordResetCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetCode = mongoose.model<IPasswordResetCode>(
  'PasswordResetCode',
  passwordResetCodeSchema
);

