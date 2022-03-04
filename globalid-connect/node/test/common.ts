export function mockConfigService(env: Record<string, any>) {
  return {
    get: jest.fn((key: string) => env[key])
  };
}

export const code = '123abc';
export const accessToken = 'abcdefghijklmnopqrstuvwxyz';
