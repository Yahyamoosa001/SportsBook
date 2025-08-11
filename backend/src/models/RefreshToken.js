import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  deviceInfo: {
    userAgent: String,
    ip: String
  },
  rememberMe: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for user lookup
refreshTokenSchema.index({ userId: 1 });

// Index for token lookup - removed duplicate index definition

// Static method to cleanup expired or revoked tokens
refreshTokenSchema.statics.cleanupTokens = async function() {
  const now = new Date();
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: now } },
      { isRevoked: true }
    ]
  });
  return result.deletedCount;
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllForUser = async function(userId) {
  return await this.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

// Instance method to check if token is valid
refreshTokenSchema.methods.isValid = function() {
  return !this.isRevoked && this.expiresAt > new Date();
};

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
