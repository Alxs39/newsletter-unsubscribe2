import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import env from '#start/env';

/**
 * Service for encrypting/decrypting sensitive data using AES-256-GCM.
 * This algorithm provides authenticated encryption (confidentiality + integrity).
 */
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm' as const;
  private readonly ivLength = 12; // 96 bits recommended for GCM
  private readonly authTagLength = 16; // 128 bits
  private readonly key: Buffer;

  constructor() {
    const keyHex = env.get('ENCRYPTION_KEY');
    this.key = Buffer.from(keyHex, 'hex');

    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
    }
  }

  /**
   * Encrypt plaintext using AES-256-GCM.
   * @returns Format: base64(iv):base64(ciphertext):base64(authTag)
   */
  encrypt(plaintext: string): string {
    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv(this.algorithm, this.key, iv, {
      authTagLength: this.authTagLength,
    });

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [iv.toString('base64'), encrypted.toString('base64'), authTag.toString('base64')].join(
      ':'
    );
  }

  /**
   * Decrypt ciphertext encrypted with AES-256-GCM.
   * @param encryptedData Format: base64(iv):base64(ciphertext):base64(authTag)
   */
  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format: expected iv:ciphertext:authTag');
    }

    const [ivBase64, ciphertextBase64, authTagBase64] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const ciphertext = Buffer.from(ciphertextBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    const decipher = createDecipheriv(this.algorithm, this.key, iv, {
      authTagLength: this.authTagLength,
    });

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return decrypted.toString('utf8');
  }
}
