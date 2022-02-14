import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AttestationsController } from './attestations.controller';
import { AttestationsService } from './attestations.service';

describe('AttestationsController', () => {
  let controller: AttestationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttestationsController],
      providers: [AttestationsService, AuthService, ConfigService]
    }).compile();

    controller = module.get<AttestationsController>(AttestationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
