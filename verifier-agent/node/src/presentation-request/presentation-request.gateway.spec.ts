import { Test } from '@nestjs/testing';
import { trackingId } from '../../test/common';
import { PresentationRequestGateway } from './presentation-request.gateway';
import { VerifiablePresentation } from './presentation-request.types';

describe('PresentationRequestGateway', () => {
  let gateway: PresentationRequestGateway;
  let mockClient;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [PresentationRequestGateway]
    }).compile();

    mockClient = {
      send: jest.fn()
    };

    gateway = testModule.get(PresentationRequestGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a client successfully', async () => {
      const data = gateway.register(mockClient, { trackingId });

      expect(data.event).toBe('client-registered');
      expect(data.data).toBe('client successfully registered');
    });

    it('should still register 2nd client with the same trackingId', async () => {
      gateway.register(mockClient, { trackingId });
      const data = gateway.register(mockClient, { trackingId });

      expect(data.event).toBe('client-registered');
      expect(data.data).toBe('client successfully registered');
    });
  });

  describe('unregister', () => {
    it('should unregister a client successfully', async () => {
      gateway.register(mockClient, { trackingId });
      const data = gateway.unregister(trackingId);

      expect(data.event).toBe('client-unregistered');
      expect(data.data).toBe('client successfully unregistered');
    });

    it('should throw exception trying to send data after unregister', () => {
      gateway.register(mockClient, { trackingId });
      gateway.unregister(trackingId);

      expect(() => gateway.rejectPresentation(trackingId, 'rejected')).toThrow();
      expect(mockClient.send).toHaveBeenCalledTimes(0);
    });
  });

  describe('acceptPresentation', () => {
    it('should send acceptPresentation message successfully', async () => {
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
      gateway.register(mockClient, { trackingId });

      expect(() => gateway.rejectPresentation('1234', 'user rejected')).toThrow(
        'no client socket found for trackingId 1234'
      );
      expect(mockClient.send).toHaveBeenCalledTimes(0);
    });
  });
});
