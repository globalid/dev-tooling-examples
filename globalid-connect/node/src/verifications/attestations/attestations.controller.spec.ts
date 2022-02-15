import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Attestation } from './attestation.interface';
import { code } from '../../../test/common';
import { AttestationsController } from './attestations.controller';
import { AttestationsService } from './attestations.service';

describe('AttestationsController', () => {
  let controller: AttestationsController;
  let service: AttestationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AttestationsController] })
      .useMocker(createMock)
      .compile();

    controller = module.get(AttestationsController);
    service = module.get(AttestationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAttestations', () => {
    it('should return Attestation records', async () => {
      const attestationRecord = createMock<Attestation[]>();
      const serviceSpy = jest.spyOn(service, 'getAttestations').mockResolvedValueOnce(attestationRecord);

      const result = await controller.getAttestations(code);

      expect(result).toBe(attestationRecord);
      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(serviceSpy).toHaveBeenCalledWith(code);
    });
  });
});
