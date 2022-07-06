import { randomUUID } from 'crypto';

import { HolderAcceptance, HolderRejection, HolderResponseState } from '@globalid/verifier-toolkit';
import { BadRequestException } from '@nestjs/common';

import { trackingId } from '../../test/common';
import { HolderResponsePipe } from './holder-response.pipe';

describe('HolderResponsePipe', () => {
  let pipe: HolderResponsePipe;

  beforeEach(() => {
    pipe = new HolderResponsePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    const baseHolderResponse = {
      app_uuid: randomUUID(),
      tracking_id: trackingId,
      thread_id: randomUUID(),
      state: HolderResponseState.Done,
      verified: true
    };

    it('should return HolderAcceptance when proof_presentation is present', async () => {
      const input = {
        ...baseHolderResponse,
        proof_presentation: { something: 'or other' }
      };

      const result = await pipe.transform(input);

      expect(result).toBeInstanceOf(HolderAcceptance);
    });

    it('should return HolderRejection when error_msg is present', async () => {
      const input = {
        ...baseHolderResponse,
        error_msg: 'uh oh!'
      };

      const result = await pipe.transform(input);

      expect(result).toBeInstanceOf(HolderRejection);
    });

    it('should throw an error when not a valid Holder response', async () => {
      await expect(pipe.transform({})).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when Holder response is invalid', async () => {
      const input = {
        ...baseHolderResponse,
        error_msg: 42
      };

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });
  });
});
