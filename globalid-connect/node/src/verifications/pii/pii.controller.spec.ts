import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { code } from '../../../test/stubs';
import { PiiController } from './pii.controller';
import { Pii } from './pii.interface';
import { PiiService } from './pii.service';

describe('PiiController', () => {
  let controller: PiiController;
  let service: PiiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PiiController] })
      .useMocker(createMock)
      .compile();

    controller = module.get(PiiController);
    service = module.get(PiiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPii', () => {
    it('should return PII record', async () => {
      const piiRecord = createMock<Pii[]>();
      const serviceSpy = jest.spyOn(service, 'get').mockResolvedValueOnce(piiRecord);

      const result = await controller.getPii(code);

      expect(result).toBe(piiRecord);
      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(serviceSpy).toHaveBeenCalledWith(code);
    });
  });
});
