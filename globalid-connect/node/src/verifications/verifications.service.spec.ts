import { Test, TestingModule } from '@nestjs/testing';
import { VerificationsService } from './verifications.service';
import { code } from '../../test/common';
import { gidApiClientFactoryProvider } from './client/gid-api-client.factory';
import { ConfigService } from '@nestjs/config';
import { GidApiClient, GidApiClientFactory } from '@globalid/api-client';
import { createMock } from '@golevelup/ts-jest';
import { AttestationsClient } from '@globalid/api-client/dist/attestations';
import { IdentityClient } from '@globalid/api-client/dist/identity';
import { PiiService } from '@globalid/api-client/dist/pii';
import { NonceService } from './nonce.service';

describe('VerificationsService', () => {
  let service: VerificationsService;
  let gidClientApiFactory: GidApiClientFactory;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, NonceService, VerificationsService, gidApiClientFactoryProvider]
    }).compile();

    service = module.get(VerificationsService);
    gidClientApiFactory = module.get(GidApiClientFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    it('should return an object of connected services when the PiiService is provided', async () => {
      const gac = new GidApiClient(
        createMock<AttestationsClient>(),
        createMock<IdentityClient>(),
        createMock<PiiService>()
      );
      const gidClientApiFactoryCreateSpy = jest.spyOn(gidClientApiFactory, 'create').mockResolvedValueOnce(gac);

      await service.connect(code);

      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledWith(code);
    });

    it('should return an object of connected services when the PiiService is not provided', async () => {
      const gac = new GidApiClient(createMock<AttestationsClient>(), createMock<IdentityClient>(), null);
      const gidClientApiFactoryCreateSpy = jest.spyOn(gidClientApiFactory, 'create').mockResolvedValueOnce(gac);

      await service.connect(code);

      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledTimes(1);
      expect(gidClientApiFactoryCreateSpy).toHaveBeenCalledWith(code);
    });
  });
});
