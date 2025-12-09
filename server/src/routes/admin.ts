import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js';

const router = express.Router();

/**
 * Development için: Kullanıcı silme (sadece development'ta)
 */
router.delete('/user/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Bu endpoint sadece development modunda kullanılabilir',
      });
    }

    const { email } = req.params;
    const result = await User.deleteOne({ email });
    
    // İlgili aktivasyon kodlarını da sil
    await VerificationCode.deleteMany({ email });

    res.json({
      success: true,
      message: `Kullanıcı silindi: ${email}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

