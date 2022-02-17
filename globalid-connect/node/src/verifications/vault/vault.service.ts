import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { EncryptedPii } from './encrypted-pii.interface';

@Injectable()
export class VaultService {
  constructor(private readonly httpService: HttpService) {}

  async getAttachment(privateFileToken: string, accessToken: string): Promise<Buffer> {
    const response$ = this.httpService.get<Buffer>(
      `https://api.global.id/v1/vault/attachment/${privateFileToken}/client`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'arraybuffer'
      }
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getEncryptedData(consentTokens: string[], accessToken: string): Promise<EncryptedPii[]> {
    const response$ = this.httpService.post<EncryptedPii[]>(
      'https://api.global.id/v1/vault/get-encrypted-data',
      { private_data_tokens: consentTokens },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
