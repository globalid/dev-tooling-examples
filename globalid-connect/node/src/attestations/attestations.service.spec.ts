import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AttestationsService } from './attestations.service';

describe('AttestationsService', () => {
  let service: AttestationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttestationsService, AuthService, ConfigService],
    }).compile();

    service = module.get<AttestationsService>(AttestationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
