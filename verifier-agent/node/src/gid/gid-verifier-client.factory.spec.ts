import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { GidVerifierClientFactory } from './gid-verifier-client.factory';
import * as verifierToolkit from '@globalid/verifier-toolkit';
import { clientId, clientSecret } from '../../test/common';
import { GidVerifierClient } from '@globalid/verifier-toolkit';

describe('GidVerifierClientFactory', () => {
  let factory: GidVerifierClientFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [GidVerifierClientFactory]
    }).compile();

    factory = module.get(GidVerifierClientFactory);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('create', () => {
    it('should return a GidVerifierClient instance', async () => {
      const mockedGidVerifierClient = createMock<GidVerifierClient>();
      const getSpy = jest.spyOn(configService, 'get').mockReturnValueOnce(clientId).mockReturnValueOnce(clientSecret);
      const createSpy = jest
        .spyOn(verifierToolkit, 'createGidVerifierClient')
        .mockReturnValueOnce(mockedGidVerifierClient);
      const gidVerifierClient: GidVerifierClient = factory.create();

      expect(gidVerifierClient).toBeDefined();
      expect(gidVerifierClient).toBe(mockedGidVerifierClient);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith({ clientId, clientSecret });
      expect(getSpy).toHaveBeenNthCalledWith(1, 'CLIENT_ID');
      expect(getSpy).toHaveBeenNthCalledWith(2, 'CLIENT_SECRET');
    });
  });
});
