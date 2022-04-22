import { Test } from '@nestjs/testing';
import { TrackingIdValidationPipe } from './trackingid-validator';

describe('TrackingIdValidationPipe', () => {
  let trackingIdValidationPipe: TrackingIdValidationPipe;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [TrackingIdValidationPipe]
    }).compile();

    trackingIdValidationPipe = testModule.get(TrackingIdValidationPipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass through value with trackingId', () => {
    const hasTrackingId = { trackingId: '1234' };
    const data = trackingIdValidationPipe.transform(hasTrackingId);
    expect(data).toEqual(hasTrackingId);
  });

  it('should throw an exception if no trackingId provided', () => {
    const noTrackingId = { name: 'GlobaliD' };
    expect(() => trackingIdValidationPipe.transform(noTrackingId)).toThrow();
  });

  it('should throw on non string trackingId', () => {
    const obj = { trackingId: [] };
    expect(() => trackingIdValidationPipe.transform(obj)).toThrow();
  });
});
