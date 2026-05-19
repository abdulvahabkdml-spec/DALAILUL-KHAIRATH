/**
 * User Model
 * Stores admin/editor accounts with hashed passwords and encrypted TOTP secrets.
 * Passwords are NEVER stored in plaintext — only bcrypt hashes.
 * MFA TOTP secrets are encrypted with AES-256-GCM before storage.
 */
import { Schema, Document, models, model } from 'mongoose';

export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;          // bcrypt hash — NEVER plaintext
  encryptedMfaSecret: string;    // AES-256-GCM encrypted TOTP secret
  isMfaEnabled: boolean;
  role: UserRole;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Never returned in queries unless explicitly asked
    },
    encryptedMfaSecret: {
      type: String,
      required: true,
      select: false, // Never returned in queries
    },
    isMfaEnabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Editor', 'Viewer'] as UserRole[],
      default: 'Editor',
    },
    lastLoginAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  {
    timestamps: true,
    // Strip any unknown fields for extra safety
    strict: true,
  }
);

// Compound index for role-based queries
UserSchema.index({ role: 1, createdAt: -1 });

export const User = models.User || model<IUser>('User', UserSchema);
