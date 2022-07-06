import { Socket } from 'socket.io';

import { UserAcceptance, UserRejection } from '@globalid/verifier-toolkit';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { trackingId } from '../../../test/common';
import { ClientRegistry } from './client.registry';
import { ClientService } from './client.service';
import { ServerEvent } from './server-event';

describe('ClientService', () => {
  let service: ClientService;
  let registry: ClientRegistry;
  let client: Socket;
  let findSpy: jest.SpyInstance<Socket, [trackingId: string]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [ClientService] })
      .useMocker(createMock)
      .compile();

    service = module.get(ClientService);
    registry = module.get(ClientRegistry);

    client = createMock<Socket>();
    findSpy = jest.spyOn(registry, 'find').mockReturnValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendUserAcceptance', () => {
    it('should send presentation-accepted event', () => {
      findSpy.mockReturnValueOnce(client);
      const acceptance = createMock<UserAcceptance>({ trackingId });

      service.sendUserAcceptance(acceptance);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(trackingId);
      expect(client.emit).toHaveBeenCalledTimes(1);
      expect(client.emit).toHaveBeenCalledWith(ServerEvent.PresentationAccepted, acceptance);
    });

    it('should not send when client is missing', () => {
      const acceptance = createMock<UserAcceptance>({ trackingId });

      service.sendUserAcceptance(acceptance);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(trackingId);
      expect(client.emit).not.toHaveBeenCalled();
    });
  });

  describe('sendAwaitingResponse', () => {
    it('should send awaiting-response event', () => {
      findSpy.mockReturnValueOnce(client);

      service.sendAwaitingResponse(trackingId);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(trackingId);
      expect(client.emit).toHaveBeenCalledTimes(1);
      expect(client.emit).toHaveBeenCalledWith(ServerEvent.AwaitingResponse, undefined);
    });

    it('should not send when client is missing', () => {
      service.sendAwaitingResponse(trackingId);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(trackingId);
      expect(client.emit).not.toHaveBeenCalled();
    });
  });

  describe('deregister', () => {
    it('should deregister client', () => {
      const deregisterSpy = jest.spyOn(registry, 'deregister');

      service.deregister(trackingId);

      expect(deregisterSpy).toHaveBeenCalledTimes(1);
      expect(deregisterSpy).toHaveBeenCalledWith(trackingId);
    });
  });

  describe('register', () => {
    it('should register client', () => {
      const registerSpy = jest.spyOn(registry, 'register');

      service.register(trackingId, client);

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(registerSpy).toHaveBeenCalledWith(trackingId, client);
    });
  });

  describe('sendUserRejection', () => {
    it('should send presentation-rejected event', () => {
      findSpy.mockReturnValueOnce(client);
      const rejection = createMock<UserRejection>({ trackingId });

      service.sendUserRejection(rejection);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(trackingId);
      expect(client.emit).toHaveBeenCalledTimes(1);
      expect(client.emit).toHaveBeenCalledWith(ServerEvent.PresentationRejected, rejection);
    });

    it('should not send when client is missing', () => {
      const rejection = createMock<UserRejection>({ trackingId });

      service.sendUserRejection(rejection);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(trackingId);
      expect(client.emit).not.toHaveBeenCalled();
    });
  });
});
