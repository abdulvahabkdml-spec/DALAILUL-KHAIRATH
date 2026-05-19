/**
 * Admin User Seed Script
 *
 * Run ONCE to create the first Admin user with a hashed password
 * and encrypted MFA TOTP secret.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/seed-admin.ts
 *
 * After running:
 * 1. Copy the "otpauth://" URL shown in the console.
 * 2. Open Google Authenticator → Add account → Scan QR / Enter key.
 * 3. Use the 6-digit code at login.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { generateSecret, generateURI } from 'otplib';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ── Inline encrypt (mirrors src/lib/encryption.ts) ─────────────────────────
function encrypt(plaintext: string): string {
  const keyHex = process.env.AES_ENCRYPTION_KEY!;
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

// ── Inline User schema (avoids Next.js module resolution issues) ─────────────
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  encryptedMfaSecret: { type: String, required: true },
  isMfaEnabled: { type: Boolean, default: true },
  role: { type: String, default: 'Admin' },
  failedLoginAttempts: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env.local');

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  // ── Admin credentials — CHANGE THESE BEFORE RUNNING ────────────────────
  const USERNAME = 'admin';
  const EMAIL    = 'admin@dalailulkhairath.com';
  const PASSWORD = 'Change_This_Strong_Password_123!';

  // Check if admin already exists
  const existing = await User.findOne({ username: USERNAME });
  if (existing) {
    console.log(`⚠️  Admin user '${USERNAME}' already exists. Exiting.`);
    await mongoose.disconnect();
    return;
  }

  // Hash password with bcrypt (cost factor 12)
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  // Generate TOTP secret for Google Authenticator
  const mfaSecret = generateSecret();
  const encryptedMfaSecret = encrypt(mfaSecret);

  // Create user
  await User.create({ USERNAME, email: EMAIL, passwordHash, encryptedMfaSecret, isMfaEnabled: true, role: 'Admin', username: USERNAME });

  console.log('\n════════════════════════════════════════════════════');
  console.log('✅ Admin user created successfully!');
  console.log('────────────────────────────────────────────────────');
  console.log(`   Username : ${USERNAME}`);
  console.log(`   Email    : ${EMAIL}`);
  console.log(`   Password : ${PASSWORD}  ← CHANGE THIS`);
  console.log('────────────────────────────────────────────────────');
  console.log('📱 MFA Setup — scan this in Google Authenticator:');
  const otpAuthUrl = generateURI({
    secret: mfaSecret,
    label: EMAIL,
    issuer: 'Dalailul Khairath Admin',
  });
  console.log('\n  ' + otpAuthUrl);
  console.log('\n  Raw secret (fallback manual entry):');
  console.log('  ' + mfaSecret);
  console.log('════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
