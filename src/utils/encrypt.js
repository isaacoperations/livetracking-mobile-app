import RNSimpleCrypto from 'react-native-simple-crypto';
import Config from 'react-native-config';
export const encryptHex = async (message) => {
  const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex;
  const key = Config.ENCRYPT_KEY;
  const iv = Config.ENCRYPT_IV;
  const messageArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(message);
  const keyArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(key);
  const ivArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(iv);
  const cipherTextArrayBuffer = await RNSimpleCrypto.AES.encrypt(
    messageArrayBuffer,
    keyArrayBuffer,
    ivArrayBuffer,
  );
  return toHex(cipherTextArrayBuffer);
};
