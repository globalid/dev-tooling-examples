import { Test, TestingModule } from '@nestjs/testing';
import { PiiController } from './pii.controller';

describe('PiiController', () => {
  let controller: PiiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiiController],
    }).compile();

    controller = module.get<PiiController>(PiiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
