import { GidApiClientFactory } from '@globalid/api-client';
import { createGidApiClientMock } from '@globalid/api-client/testing';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { code, mockConfigService } from '../../test/common';
import { gidApiClientFactoryProvider } from './client/gid-api-client.factory';
import { NonceService } from './nonce.service';
import { VerificationsService } from './verifications.service';

const connectUrl = 'https://connect.global.id/?scope=openid';
const configServiceMock = mockConfigService({
  CONNECT_URL: connectUrl
});

describe('VerificationsService', () => {
  let service: VerificationsService;
  let nonceService: NonceService;
  let gidClientApiFactory: GidApiClientFactory;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        NonceService,
        VerificationsService,
        gidApiClientFactoryProvider
      ]
    }).compile();

    service = module.get(VerificationsService);
    nonceService = module.get(NonceService);
    gidClientApiFactory = module.get(GidApiClientFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    it('should return a Connect URL', async () => {
      const nonce = 'foo';
      const generateSpy = jest.spyOn(nonceService, 'generate').mockReturnValueOnce(nonce);

      const result = service.makeConnectUrl();

      expect(result).toBe(`${connectUrl}&nonce=${nonce}`);
      expect(generateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an object of connected services when the PiiService is provided', async () => {
      const gacMock = createGidApiClientMock();
      const gidClientApiFactoryCreateSpy = jest.spyOn(gidClientApiFactory, 'create').mockResolvedValueOnce(gacMock);

      await service.connect(code);

      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledWith(code);
    });

    it('should return an object of connected services when the PiiService is not provided', async () => {
      const gacMock = createGidApiClientMock(false);
      const gidClientApiFactoryCreateSpy = jest.spyOn(gidClientApiFactory, 'create').mockResolvedValueOnce(gacMock);

      await service.connect(code);

      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledWith(code);
    });
  });
});
