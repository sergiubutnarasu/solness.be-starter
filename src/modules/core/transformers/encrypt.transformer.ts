import { ValueTransformer } from 'typeorm';
import { AppHelper, CryptoHelper } from '../helpers';
import { AppConfigKey } from '../objects/enums';

const EncryptTransform: ValueTransformer = {
  from(value: any) {
    if (!value) {
      return value;
    }

    return CryptoHelper.decrypt(
      AppHelper.getConfig(AppConfigKey.DefaultEncryptionKey),
      value,
    );
  },
  to(value: any) {
    if (!value) {
      return value;
    }

    return CryptoHelper.encrypt(
      AppHelper.getConfig(AppConfigKey.DefaultEncryptionKey),
      `${value}`,
    );
  },
};

export default EncryptTransform;
