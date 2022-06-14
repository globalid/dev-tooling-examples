import { randomUUID } from 'crypto';

import { UserAcceptance, UserRejection, UserResponseState } from '@globalid/verifier-toolkit';
import { BadRequestException } from '@nestjs/common';

import { trackingId } from '../../test/common';
import { UserResponsePipe } from './user-response.pipe';

describe('UserResponsePipe', () => {
  let pipe: UserResponsePipe;

  beforeEach(() => {
    pipe = new UserResponsePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    const baseUserResponse = {
      app_uuid: randomUUID(),
      tracking_id: trackingId,
      thread_id: randomUUID(),
      state: UserResponseState.Done,
      verified: true
    };

    it('should return UserAcceptance when proof_presentation is present', async () => {
      const input = {
        ...baseUserResponse,
        proof_presentation: { something: 'or other' }
      };

      const result = await pipe.transform(input);

      expect(result).toBeInstanceOf(UserAcceptance);
    });

    it('should return UserRejection when error_msg is present', async () => {
      const input = {
        ...baseUserResponse,
        error_msg: 'uh oh!'
      };

      const result = await pipe.transform(input);

      expect(result).toBeInstanceOf(UserRejection);
    });

    it('should throw an error when not a valid user response', async () => {
      await expect(pipe.transform({})).rejects.toThrow(BadRequestException);
    });

    it('should throw an error when user response is invalid', async () => {
      const input = {
        ...baseUserResponse,
        error_msg: 42
      };

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });
  });
});
