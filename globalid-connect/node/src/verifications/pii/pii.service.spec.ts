import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { VaultService } from '../vault/vault.service';

import { PiiService } from './pii.service';

describe('PiiService', () => {
  let service: PiiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, PiiService, VaultService]
    }).compile();

    service = module.get<PiiService>(PiiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
