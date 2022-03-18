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

export const code = '123abc';
export const accessToken = 'abcdefghijklmnopqrstuvwxyz';
export const decoupledId = 'a1eb812d-7420-48b1-82b1-766f9ef031e2';
