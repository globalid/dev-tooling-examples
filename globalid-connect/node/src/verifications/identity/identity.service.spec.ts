import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';

import { IdentityService } from './identity.service';

describe('IdentityService', () => {
  let service: IdentityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthService, ConfigService, IdentityService]
    }).compile();

    service = module.get<IdentityService>(IdentityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it("should return user's identity", async () => {
      const code = 'blah';
      const identity = {};

      const result = await service.get(code);

      expect(result).toBe(identity);
    });
  });
});
