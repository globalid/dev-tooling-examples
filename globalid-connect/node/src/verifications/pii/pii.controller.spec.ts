import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { VaultService } from '../vault/vault.service';
import { PiiController } from './pii.controller';
import { PiiService } from './pii.service';

describe('PiiController', () => {
  let controller: PiiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiiController],
      providers: [AuthService, ConfigService, PiiService, VaultService]
    }).compile();

    controller = module.get<PiiController>(PiiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
