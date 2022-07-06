import { Socket } from 'socket.io';

import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { trackingId } from '../../../test/common';
import { ClientGateway } from './client.gateway';
import { ClientService } from './client.service';

describe('ClientGateway', () => {
  let gateway: ClientGateway;
  let service: ClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({ providers: [ClientGateway] })
      .useMocker(createMock)
      .compile();

    gateway = module.get(ClientGateway);
    service = module.get(ClientService);
  });

  describe('register', () => {
    it('should register a client', async () => {
      const clientSocket = createMock<Socket>();
      const registerSpy = jest.spyOn(service, 'register');

      const result = gateway.register(clientSocket, trackingId);

      expect(result).toMatch(trackingId);
      expect(registerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deregister', () => {
    it('should deregister a client', async () => {
      const deregisterSpy = jest.spyOn(service, 'deregister');

      const result = gateway.deregister(trackingId);

      expect(result).toMatch(trackingId);
      expect(deregisterSpy).toHaveBeenCalledTimes(1);
    });
  });
});
