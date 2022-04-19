import { randomUUID } from 'crypto';

import { createMock } from '@golevelup/ts-jest';

import { ProofRequirements } from './create-proof-request-dto';
import { CreateProofRequestDtoFactory } from './create-proof-request-dto-factory';

describe('CreateProofRequestDtoFactory', () => {
  describe('buildCreateProofRequestEpamDto', () => {
    it('should build a CreateProofRequestDto', async () => {
      const trackingId = randomUUID();
      const webhookUrl = 'https://something.com/webhook';
      const createProofRequestDtoFactory = new CreateProofRequestDtoFactory();
      const proofRequirementsMock = createMock<ProofRequirements>();
      const createSpy = jest
        .spyOn(createProofRequestDtoFactory, 'createProofRequirements')
        .mockReturnValueOnce(proofRequirementsMock);

      const createProofRequestDto = createProofRequestDtoFactory.buildCreateProofRequestDto(trackingId, webhookUrl);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createProofRequestDto.proof_requirements).toBe(proofRequirementsMock);
    });
  });
});
