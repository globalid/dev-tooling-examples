import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { code } from '../../../test/common';
import { IdentityController } from './identity.controller';
import { Identity } from './identity.interface';
import { IdentityService } from './identity.service';

describe('IdentityController', () => {
  let controller: IdentityController;
  let service: IdentityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityController]
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<IdentityController>(IdentityController);
    service = module.get(IdentityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getIdentity', () => {
    it('should return Identity', async() => {
      const Identity = createMock<Identity[]>();
      const serviceSpy = jest.spyOn(service, 'getIdentity').mockResolvedValueOnce(Identity);

      const result = await controller.getIdentity(code);

      expect(result).toBe(Identity);
      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(serviceSpy).toHaveBeenCalledWith(code);
    });
  });
});
