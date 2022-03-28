import { Attestation, ConsentCommand, GidApiClientFactory, Identity, Pii } from '@globalid/api-client';
import { createGidApiClientMock } from '@globalid/api-client/testing';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { code, decoupledId } from '../../test/common';
import { NonceService } from './nonce.service';
import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  let service: VerificationsService;
  let configService: ConfigService;
  let gidApiClientFactory: GidApiClientFactory;
  let nonceService: NonceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [VerificationsService] })
      .useMocker(createMock)
      .compile();

    service = module.get(VerificationsService);
    configService = module.get(ConfigService);
    gidApiClientFactory = module.get(GidApiClientFactory);
    nonceService = module.get(NonceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connect', () => {
    const attestations = createMock<Attestation[]>();
    const identity = createMock<Identity>();

    it('should return user data', async () => {
      const client = createGidApiClientMock(false);
      client.attestations.get.mockResolvedValueOnce(attestations);
      client.identity.get.mockResolvedValueOnce(identity);
      const createSpy = jest.spyOn(gidApiClientFactory, 'create').mockResolvedValueOnce(client);

      const result = await service.connect(code);

      expect(result).toStrictEqual({ attestations, identity, pii: undefined });
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(code);
      expect(client.attestations.get).toHaveBeenCalledTimes(1);
      expect(client.identity.get).toHaveBeenCalledTimes(1);
    });

    it('should return user data with PII', async () => {
      const pii = createMock<Pii[]>();
      const client = createGidApiClientMock();
      client.attestations.get.mockResolvedValueOnce(attestations);
      client.identity.get.mockResolvedValueOnce(identity);
      client.pii.get.mockResolvedValueOnce(pii);
      const createSpy = jest.spyOn(gidApiClientFactory, 'create').mockResolvedValueOnce(client);

      const result = await service.connect(code);

      expect(result).toStrictEqual({ attestations, identity, pii });
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(code);
      expect(client.attestations.get).toHaveBeenCalledTimes(1);
      expect(client.identity.get).toHaveBeenCalledTimes(1);
      expect(client.pii.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDelayedVerificationsStatus', () => {
    it('should call consent.getCommand()', async () => {
      const consentCommand = createMock<ConsentCommand>();
      const client = createGidApiClientMock();
      client.consent.getCommand.mockResolvedValueOnce(consentCommand);
      const createSpy = jest.spyOn(gidApiClientFactory, 'create').mockResolvedValueOnce(client);

      const result = await service.getDelayedVerificationsStatus(code, decoupledId);

      expect(result).toBe(consentCommand);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(code);
      expect(client.consent.getCommand).toHaveBeenCalledTimes(1);
      expect(client.consent.getCommand).toHaveBeenCalledWith(decoupledId);
    });
  });

  describe('makeConnectUrl', () => {
    it('should return Connect URL', async () => {
      const connectUrl = 'https://connect.global.id/?scope=public';
      const getSpy = jest.spyOn(configService, 'get').mockReturnValueOnce(connectUrl);

      const result = service.makeConnectUrl();

      expect(result).toBe(connectUrl);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith('CONNECT_URL');
    });

    it('should return Connect URL with nonce when scope is OpenID', async () => {
      const connectUrl = 'https://connect.global.id/?scope=openid';
      const getSpy = jest.spyOn(configService, 'get').mockReturnValueOnce(connectUrl);
      const nonce = 'foo';
      const generateSpy = jest.spyOn(nonceService, 'generate').mockReturnValueOnce(nonce);

      const result = service.makeConnectUrl();

      expect(result).toBe(`${connectUrl}&nonce=${nonce}`);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith('CONNECT_URL');
      expect(generateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
