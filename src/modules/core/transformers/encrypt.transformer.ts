import { ValueTransformer } from 'typeorm';
import { AppHelper, CryptoHelper } from '../helpers';
import { AppConfigKey } from '../objects/enums';

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
