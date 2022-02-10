import { Test, TestingModule } from '@nestjs/testing';

import { PiiService } from './pii.service';

describe('PiiService', () => {
  let service: PiiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiiService]
    }).compile();

    service = module.get<PiiService>(PiiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
