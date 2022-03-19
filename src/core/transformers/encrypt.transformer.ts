import { ValueTransformer } from 'typeorm';
import { CryptoHelper } from '../helpers';

const EncryptTransform: ValueTransformer = {
  from(value: any) {
    if (!value) {
      return value;
    }

    return CryptoHelper.decryptValue(value);
  },
  to(value: any) {
    if (!value) {
      return value;
    }

    return CryptoHelper.encryptValue(`${value}`);
  },
};

export default EncryptTransform;
