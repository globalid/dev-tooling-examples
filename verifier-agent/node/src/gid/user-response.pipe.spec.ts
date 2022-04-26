import { UserResponsePipe } from './user-response.pipe';
import { BadRequestException } from '@nestjs/common';
import { UserAcceptance, UserRejection, UserResponseState } from './user-response';
import { randomUUID } from 'crypto';
import { trackingId, userAcceptance, userRejection } from '../../test/common';
import { instanceToPlain } from 'class-transformer';

describe('ConnectParamsPipe', () => {
  let pipe: UserResponsePipe;

  beforeEach(() => {
    pipe = new UserResponsePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform UserResponse to UserAcceptance when proof_presentation is present', async () => {
    const result = await pipe.transform(instanceToPlain(userAcceptance));

    expect(result).toBeInstanceOf(UserAcceptance);
  });

  it('should transform UserResponse to UserRejection when error_msg is present', async () => {
    const result = await pipe.transform(instanceToPlain(userRejection));

    expect(result).toBeInstanceOf(UserRejection);
  });

  it('should fail to transform UserResponse when neither proof_presentation nor error_msg is present', async () => {
    await expect(
      async () =>
        await pipe.transform({
          app_uuid: randomUUID(),
          tracking_id: trackingId,
          thread_id: randomUUID(),
          state: UserResponseState.Done,
          verified: true
        })
    ).rejects.toThrow(BadRequestException);
  });

  it('should validate transformation', async () => {
    await expect(pipe.transform({})).rejects.toThrow(BadRequestException);
  });

  it('should fail to transform UserAcceptance when a property fails class-validator', async () => {
    await expect(
      async () => await pipe.transform({ ...instanceToPlain(userAcceptance), app_uuid: 'not-a-uuid' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should fail to transform UserRejection when a property fails class-validator', async () => {
    await expect(
      async () => await pipe.transform({ ...instanceToPlain(userRejection), app_uuid: 'not-a-uuid' })
    ).rejects.toThrow(BadRequestException);
  });
});
