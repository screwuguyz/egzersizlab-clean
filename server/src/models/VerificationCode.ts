import mongoose, { Document, Schema } from 'mongoose';

/**
 * Email Aktivasyon Kodu Modeli
 */
export interface IVerificationCode extends Document {
  email: string;
  code: string; // 4 haneli kod
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>(
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
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Email ve code için compound index (hızlı arama)
verificationCodeSchema.index({ email: 1, code: 1 });

// Expired kodları otomatik sil (TTL)
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode = mongoose.model<IVerificationCode>(
  'VerificationCode',
  verificationCodeSchema
);

