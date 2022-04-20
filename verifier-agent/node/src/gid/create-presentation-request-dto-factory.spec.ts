import { randomUUID } from 'crypto';

import { PresentationRequirementsFactory } from '../presentationRequest/presentation-requirements-factory';
import { CreatePresentationRequestDtoFactory } from './create-presentation-request-dto-factory';

describe('CreatePresentationRequestDtoFactory', () => {
  describe('buildCreatePresentationRequestEpamDto', () => {
    it('should build a CreatePresentationRequestDto', async () => {
      const trackingId = randomUUID();
      const webhookUrl = 'https://something.com/webhook';
      const presentationRequirementsFactory = new PresentationRequirementsFactory();
      const createPresentationRequestDtoFactory = new CreatePresentationRequestDtoFactory(presentationRequirementsFactory);

      const createSpy = jest.spyOn(presentationRequirementsFactory, 'create');

      const createPresentationRequestDto = createPresentationRequestDtoFactory.create(trackingId, webhookUrl);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createPresentationRequestDto.proof_requirements).toEqual(presentationRequirementsFactory.create());
    });
  });
});
