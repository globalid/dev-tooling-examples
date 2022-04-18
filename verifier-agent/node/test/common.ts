import * as crypto from 'crypto';
/**
 * Mock values returned by `ConfigService.get`
 *
 * @param env Key-Value pairs where Key is used to `get` a value from `ConfigService`
 */
export function mockConfigService(env: Record<string, any>) {
  return {
    get: jest.fn((key: string) => env[key])
  };
}

export const clientId = '123abc';
export const clientSecret = '456def';
export const accessToken = 'abcdefghijklmnopqrstuvwxyz';
export const trackingId = 'e6a35daf-684d-4ed5-bdb9-3c94b299d8de';
export const decoupledId = 'a1eb812d-7420-48b1-82b1-766f9ef031e2';
export const createProofRequestAxiosResponse = { data: { not: 'really sure' } };
export const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});
