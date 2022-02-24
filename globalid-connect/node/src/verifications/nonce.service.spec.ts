import { Test, TestingModule } from '@nestjs/testing';
import { NonceService } from './nonce.service';
import { validate as validateUuid } from 'uuid';

describe('NonceSevice', () => {
  let nonceService: NonceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NonceService]
    }).compile();

    nonceService = module.get(NonceService);
  });

  it('should be defined', () => {
    expect(nonceService).toBeDefined();
  });

  describe('generate', () => {
    it('should return a UUID', () => {
      const result = nonceService.generate();

      expect(validateUuid(result)).toBe(true);
    });
  });
});
