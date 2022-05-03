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

    it('should log an error when trying to send data after unregister', () => {
      gateway.register(mockClient, { trackingId });
      gateway.unregister(trackingId);
      const spy = jest.spyOn(console, 'error')

      gateway.rejectPresentation(trackingId, 'rejected')

      expect(spy).toHaveBeenCalledWith(`no client socket found for trackingId ${trackingId}`)
      expect(mockClient.send).toHaveBeenCalledTimes(0);

      spy.mockClear();
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

    it("should log an error when sending confirmation for trackingId that doesn't exist", async () => {
      const verifiablePresentation: VerifiablePresentation = {
        id: '1234',
        accept: true
      };
      const spy = jest.spyOn(console, 'error')

      gateway.register(mockClient, { trackingId });
      gateway.acceptPresentation('1234', verifiablePresentation)

      expect(spy).toHaveBeenCalledWith('no client socket found for trackingId 1234')
      expect(mockClient.send).toHaveBeenCalledTimes(0);

      spy.mockClear();
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

    it("should log an error when rejecting presentation for trackingId that doesn't exist", async () => {
      gateway.register(mockClient, { trackingId });
      const spy = jest.spyOn(console, 'error')

      gateway.rejectPresentation('1234', 'user rejected')

      expect(spy).toHaveBeenCalledWith('no client socket found for trackingId 1234')
      expect(mockClient.send).toHaveBeenCalledTimes(0);

      spy.mockClear();
    });
  });

  describe('await response', () => {
    it('should send an await response event', () => {
      gateway.register(mockClient, { trackingId });

      gateway.awaitResponse(trackingId);

      expect(mockClient.send).toHaveBeenCalledTimes(1);
      expect(mockClient.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: 'awaiting-response'
        })
      );
    })
  })
});
