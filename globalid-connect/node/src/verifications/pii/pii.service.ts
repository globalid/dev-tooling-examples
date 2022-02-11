import { AES, RSA } from 'globalid-crypto-library';
import * as jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../../auth/auth.service';
import { EncryptedPii } from '../vault/encrypted-pii.interface';
import { VaultService } from '../vault/vault.service';
import { Pii } from './pii.interface';

@Injectable()
export class PiiService {
  privateKey: RSA.PrivateKey;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly vaultService: VaultService
  ) {
    this.privateKey = {
      key: configService.get<string>('PRIVATE_KEY'),
      passphrase: configService.get<string>('PRIVATE_KEY_PASSPHRASE')
    };
  }

  async get(code: string): Promise<Record<string, any>> {
    const idToken = await this.getIdToken(code);
    const consentTokens = this.extractConsentTokens(idToken);
    const encryptedPii = await this.vaultService.getEncryptedData(consentTokens);
    const pii = encryptedPii.map((data) => this.decryptPii(data));
    return this.objectify(pii);
  }

  private async getIdToken(code: string): Promise<string> {
    const tokens = await this.authService.getTokens({
      code,
      redirectUri: this.configService.get<string>('REDIRECT_URI')
    });
    if (tokens.id_token == null) {
      throw Error('could not get ID token');
    }
    return tokens.id_token;
  }

  private extractConsentTokens(idToken: string) {
    const decodedIdToken = jwt.decode(idToken);
    return Object.entries(decodedIdToken)
      .filter(([name]) => name.startsWith('idp.globalid.net/claims/'))
      .flatMap(([, consentTokens]) => this.decryptConsentTokens(consentTokens));
  }

  private decryptConsentTokens(consentTokens: Record<string, string[]>): string[] {
    return Object.values(consentTokens).flatMap((tokens) => tokens.map((token) => RSA.decrypt(this.privateKey, token)));
  }

  private decryptPii(encryptedPii: EncryptedPii): Pii {
    const password = RSA.decrypt(this.privateKey, encryptedPii.encrypted_data_password);
    const json = AES.decrypt(encryptedPii.encrypted_data, password);
    return JSON.parse(json);
  }

  private objectify(pii: Pii[]): Record<string, any> {
    const entries = pii.map((pii) => [pii.type, pii.value]);
    return Object.fromEntries(entries);
  }
}
