import { TrackingId } from '../types';
import { PresentationRequestGateway } from './presentation-request.gateway';
import { VerifiablePresentation } from './presentation-request.types';

describe('PresentationRequestGateway', () => {
  const trackingId: TrackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';
  let gateway: PresentationRequestGateway;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      send: jest.fn()
    };
  });

  describe('register', () => {
    it('should register a client successfully', async () => {
      gateway = new PresentationRequestGateway();

      const data = gateway.register(mockClient, { trackingId });

      expect(data.event).toBe('client-registered');
      expect(data.data).toBe('client successfully registered');
    });

    it('should return an error when trying to register a 2nd client with the same trackingId', async () => {
      gateway = new PresentationRequestGateway();

      gateway.register(mockClient, { trackingId });
      const data = gateway.register(mockClient, { trackingId });

      expect(data.event).toBe('client-register-error');
      expect(data.data).toBe(`trackingId "${trackingId}" already exists`);
    });

    it('should return an error if no trackingId provided', async () => {
      gateway = new PresentationRequestGateway();

      const data = gateway.register(mockClient, { trackingId: null });

      expect(data.event).toBe('client-register-error');
      expect(data.data).toBe('trackingId required');
    });
  });

  describe('acceptPresentation', () => {
    it('should send acceptPresentation message successfully', async () => {
      gateway = new PresentationRequestGateway();
      const verifiablePresentation: VerifiablePresentation = {
        id: '1234',
        accept: true
      };

      gateway.register(mockClient, { trackingId });
      gateway.acceptPresentation(trackingId, verifiablePresentation);

      expect(mockClient.send).toHaveBeenCalledTimes(1);
      expect(mockClient.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: 'presentation-accepted',
          data: JSON.stringify(verifiablePresentation)
        })
      );
    });

    it("should throw an exception when sending confirmation for trackingId that doesn't exist", async () => {
      gateway = new PresentationRequestGateway();
      const verifiablePresentation: VerifiablePresentation = {
        id: '1234',
        accept: true
      };

      gateway.register(mockClient, { trackingId });
      expect(() => gateway.acceptPresentation('1234', verifiablePresentation)).toThrow();
      expect(mockClient.send).toHaveBeenCalledTimes(0);
    });
  });

  describe('rejectPresentaion', () => {
    it('should send rejectPresentation message successfully', async () => {
      gateway = new PresentationRequestGateway();
      gateway.register(mockClient, { trackingId });

      gateway.rejectPresentation(trackingId, 'user rejected');

      expect(mockClient.send).toHaveBeenCalledTimes(1);
      expect(mockClient.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: 'presentation-rejected',
          data: JSON.stringify('user rejected')
        })
      );
    });

    it("should throw an exception when rejecting presentation for trackingId that doesn't exist", async () => {
      gateway = new PresentationRequestGateway();
      gateway.register(mockClient, { trackingId });

      expect(() => gateway.rejectPresentation('1234', 'user rejected')).toThrow(
        'no client socket found for trackingId 1234'
      );
      expect(mockClient.send).toHaveBeenCalledTimes(0);
    });
  });
});
