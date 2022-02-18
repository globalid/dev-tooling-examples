import { AES, RSA } from 'globalid-crypto-library';
import * as jwt from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';
import { EncryptedPii } from '../vault/encrypted-pii.interface';
import { VaultService } from '../vault/vault.service';
import { MissingIdTokenError } from './missing-id-token.error';
import { Pii } from './pii.interface';

@Injectable()
export class PiiService {
  private readonly privateKey: RSA.PrivateKey;

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

  private get redirectUri() {
    return this.configService.get<string>('PII_REDIRECT_URI');
  }

  async get(code: string): Promise<Pii[]> {
    const idToken = await this.getIdToken(code);
    const consentTokens = this.extractConsentTokens(idToken);
    const { access_token: accessToken } = await this.authService.getTokens();
    const encryptedPii = await this.vaultService.getEncryptedData(consentTokens, accessToken);
    const pii = encryptedPii.map((data) => this.decryptPii(data, accessToken));
    return Promise.all(pii);
  }

  private async getIdToken(code: string): Promise<string> {
    const tokens = await this.authService.getTokens({ code, redirectUri: this.redirectUri });
    if (tokens.id_token == null) {
      throw new MissingIdTokenError();
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

  private async decryptPii(encryptedPii: EncryptedPii, accessToken: string): Promise<Pii> {
    const password = RSA.decrypt(this.privateKey, encryptedPii.encrypted_data_password);
    const json = AES.decrypt(encryptedPii.encrypted_data, password);
    const pii = JSON.parse(json) as Pii;
    if (pii.has_attachment) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const contents = await this.vaultService.getAttachment(encryptedPii.private_file_token!, accessToken);
      const attachment = AES.decryptBuffer(contents, password);
      pii.attachment = attachment.toString('base64');
    }
    return pii;
  }
}
