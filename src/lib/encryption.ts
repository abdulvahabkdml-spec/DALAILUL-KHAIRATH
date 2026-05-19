/**
 * AES-256-GCM Encryption Utility
 * Used to encrypt sensitive fields (e.g., MFA secrets, PII) before storing in MongoDB.
 * AES-256-GCM provides both confidentiality (encryption) and integrity (authentication tag).
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;    // 96-bit IV is recommended for GCM
const TAG_LENGTH = 16;   // 128-bit auth tag

function getKey(): Buffer {
  const key = process.env.AES_ENCRYPTION_KEY;
  if (!key) {
    // Throw a descriptive error only when this function is actually called at runtime.
    // This prevents the Next.js build from crashing during static page collection.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AES_ENCRYPTION_KEY environment variable is not set.');
    }
    // Dev fallback: 32-byte zero key (clearly insecure, only for local iteration)
    return Buffer.from('0'.repeat(64), 'hex');
  }
  if (!/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error('AES_ENCRYPTION_KEY must be a 64-character hexadecimal string (32 bytes).');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypts plaintext using AES-256-GCM.
 * @returns A hex-encoded string in the format: iv:authTag:ciphertext
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Store as iv:authTag:ciphertext (all hex-encoded)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a hex-encoded AES-256-GCM ciphertext.
 * @param encryptedData A string in the format: iv:authTag:ciphertext
 */
export function decrypt(encryptedData: string): string {
  const key = getKey();
  const parts = encryptedData.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format.');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const ciphertext = Buffer.from(parts[2], 'hex');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
