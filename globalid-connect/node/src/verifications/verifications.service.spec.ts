import { Test, TestingModule } from '@nestjs/testing';

import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  let service: VerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationsService]
    }).compile();

    service = module.get<VerificationsService>(VerificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
