import { Socket } from 'socket.io';

import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { trackingId } from '../../../test/common';
import { ClientRegistry } from './client.registry';

describe('ClientSocketRegistry', () => {
  let registry: ClientRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientRegistry]
    }).compile();

    registry = module.get(ClientRegistry);
  });

  it('should be defined', () => {
    expect(registry).toBeDefined();
  });

  describe('deregister', () => {
    it('should return true when tracking ID is registered', () => {
      const client = createMock<Socket>();
      registry.register(trackingId, client);

      const result = registry.deregister(trackingId);

      expect(result).toBe(true);
      expect(registry.find(trackingId)).toBeUndefined();
    });

    it('should return false when tracking ID is not registered', () => {
      const result = registry.deregister(trackingId);

      expect(result).toBe(false);
    });
  });

  describe('find', () => {
    it('should return socket when tracking ID is registered', () => {
      const client = createMock<Socket>();
      registry.register(trackingId, client);

      const result = registry.find(trackingId);

      expect(result).toBe(client);
    });

    it('should return undefined when tracking ID is not registered', () => {
      const result = registry.find(trackingId);

      expect(result).toBeUndefined();
    });
  });

  describe('register', () => {
    it('should register client', () => {
      const client = createMock<Socket>();

      registry.register(trackingId, client);

      expect(registry.find(trackingId)).toBe(client);
    });

    it('should overwrite existing client', () => {
      const client1 = createMock<Socket>();
      registry.register(trackingId, client1);
      const client2 = createMock<Socket>();

      registry.register(trackingId, client2);

      expect(registry.find(trackingId)).toBe(client2);
    });
  });
});
