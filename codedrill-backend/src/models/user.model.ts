import mongoose, { Schema, Document, Model } from 'mongoose';
import { hashPassword, verifyPassword } from '../utils/crypto.util.js';

export interface IUser {
  email: string;
  passwordHash: string;
  displayName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
    activityHistory: Array<{
      date: string;
      count: number;
    }>;
  };
  preferences: {
    theme: 'dark' | 'light' | 'system';
    editorFontSize: number;
    keyBindings: 'standard' | 'vim';
    emailNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  verifyPassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false // Excluded by default in queries for security
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    avatarUrl: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: null },
      activityHistory: [
        {
          date: { type: String, required: true },
          count: { type: Number, default: 1 }
        }
      ]
    },
    preferences: {
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
      editorFontSize: { type: Number, default: 14, min: 10, max: 28 },
      keyBindings: { type: String, enum: ['standard', 'vim'], default: 'standard' },
      emailNotifications: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      }
    }
  }
);

// Indexes
userSchema.index({ 'streak.currentStreak': -1 }, { sparse: true });

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  // If the password was set as plaintext, hash it before saving
  if (!this.passwordHash.startsWith('$argon2id$')) {
    this.passwordHash = await hashPassword(this.passwordHash);
  }
  next();
});

// Instance method to verify password
userSchema.methods.verifyPassword = async function (candidate: string): Promise<boolean> {
  return verifyPassword(this.passwordHash, candidate);
};

// Static method to find user by normalized email (including passwordHash for auth)
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
