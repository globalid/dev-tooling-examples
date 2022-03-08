/**
 * Mock values returned by `ConfigService.get`
 *
 * @param env Key-Value pairs where Key is used to `get` a value from `ConfigService`
 */
export function mockConfigService(env: Record<string, any>): { get: jest.Mock<any, [key: string]>; } {
  return {
    get: jest.fn((key: string) => env[key])
  };
}

export const code = '123abc';
export const accessToken = 'abcdefghijklmnopqrstuvwxyz';
