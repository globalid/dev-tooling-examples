import { Test, TestingModule } from '@nestjs/testing';
import { Nonce } from './nonce';

describe('Nonce', () => {
  let nonceGenerator: Nonce;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Nonce],
    }).compile();

    nonceGenerator = module.get<Nonce>(Nonce);
  });

  it('should be defined', () => {
    expect(nonceGenerator).toBeDefined();
  });

  it('should generate a nonce', () => {
    const nonce = nonceGenerator.generateNonce();
    expect(nonce).toBeTruthy();
    expect(nonce.length).toBeGreaterThan(0);
  });
});
