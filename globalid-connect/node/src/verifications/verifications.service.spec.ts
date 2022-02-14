import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { PiiService } from './pii/pii.service';
import { VaultService } from './vault/vault.service';

import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  let service: VerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, PiiService, VaultService, VerificationsService]
    }).compile();

    service = module.get<VerificationsService>(VerificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
