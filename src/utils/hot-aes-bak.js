import AES from 'crypto-js/aes';
export function sk() {
  return AES.encrypt(Date.now().toString(), 'itab1314').toString();
}
