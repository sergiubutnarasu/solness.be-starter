import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { AppConfigKey } from '../objects';
import AppHelper from './app.helper';
class CryptoHelperClass {
  private static instance: CryptoHelperClass;

  private ALGORITHM = 'aes-256-cbc';
  private IV_LENGTH = 16;
  private iv: Buffer;

  private constructor() {
    this.iv = Buffer.alloc(this.IV_LENGTH);
  }
  public static getInstance() {
    if (!CryptoHelperClass.instance) {
      CryptoHelperClass.instance = new CryptoHelperClass();
    }
    return CryptoHelperClass.instance;
  }

  public hash(word: string): string {
    return bcrypt.hashSync(word);
  }

  public compare(word: string, hash: string) {
    return bcrypt.compareSync(word, hash);
  }

  public encrypt(secretKey: string, text: string) {
    const cipher = crypto.createCipheriv(
      this.ALGORITHM,
      this.hashSecretKey(secretKey),
      Buffer.from(this.iv),
    );
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]).toString('base64');
    return encrypted;
  }

  public decrypt(secretKey: string, text: string) {
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      this.hashSecretKey(secretKey),
      Buffer.from(this.iv),
    );
    let decrypted = decipher.update(text, 'base64', 'utf8');
    decrypted += decipher.final();

    return decrypted;
  }

  public encryptValue(value: string) {
    if (!value) {
      return null;
    }

    return this.encrypt(
      AppHelper.getConfig(AppConfigKey.DefaultEncryptionKey),
      `${value}`,
    );
  }

  public decryptValue(value: string) {
    if (!value) {
      return null;
    }

    return this.decrypt(
      AppHelper.getConfig(AppConfigKey.DefaultEncryptionKey),
      String(value),
    );
  }

  private hashSecretKey(secretKey: string) {
    return crypto
      .createHash('sha256')
      .update(String(secretKey))
      .digest('base64')
      .substr(0, 32);
  }
}

const CryptoHelper = CryptoHelperClass.getInstance();
export default CryptoHelper;
