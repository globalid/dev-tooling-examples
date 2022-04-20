import { randomUUID } from 'crypto';

import { PresentationRequirementsFactory } from '../presentationRequest/presentation-requirements-factory';
import { CreateProofRequestDtoFactory } from './create-proof-request-dto-factory';

describe('CreateProofRequestDtoFactory', () => {
  describe('buildCreateProofRequestEpamDto', () => {
    it('should build a CreateProofRequestDto', async () => {
      const trackingId = randomUUID();
      const webhookUrl = 'https://something.com/webhook';
      const presentationRequirementsFactory = new PresentationRequirementsFactory();
      const createProofRequestDtoFactory = new CreateProofRequestDtoFactory(presentationRequirementsFactory);

      const createSpy = jest.spyOn(presentationRequirementsFactory, 'create'); 

      const createProofRequestDto = createProofRequestDtoFactory.create(trackingId, webhookUrl);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createProofRequestDto.proof_requirements).toEqual(presentationRequirementsFactory.create());
    });
  })
});
