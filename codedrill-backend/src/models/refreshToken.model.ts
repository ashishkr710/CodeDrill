import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IRefreshToken {
  userId: Types.ObjectId;
  tokenHash: string;
  familyId: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {}

export interface IRefreshTokenModel extends Model<IRefreshTokenDocument> {
  revokeFamily(userId: Types.ObjectId | string, familyId: string): Promise<void>;
}

const refreshTokenSchema = new Schema<IRefreshTokenDocument, IRefreshTokenModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    familyId: {
      type: String,
      required: true,
      index: true
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL index for automatic Mongo document removal
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Compound index for finding and revoking token families efficiently
refreshTokenSchema.index({ userId: 1, familyId: 1 });

// Static helper to invalidate all tokens in a family upon detecting a replay attack
refreshTokenSchema.statics.revokeFamily = async function (
  userId: Types.ObjectId | string,
  familyId: string
): Promise<void> {
  await this.updateMany(
    { userId: new Types.ObjectId(userId), familyId },
    { $set: { isRevoked: true } }
  );
};

export const RefreshToken = mongoose.model<IRefreshTokenDocument, IRefreshTokenModel>(
  'RefreshToken',
  refreshTokenSchema
);
