import axios from 'axios';

import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { EncryptedPii } from './encrypted-pii.interface';

@Injectable()
export class VaultService {
  constructor(private readonly authService: AuthService) {}

  async getEncryptedData(consentTokens: string[]): Promise<EncryptedPii[]> {
    const { access_token } = await this.authService.getTokens();
    const { data } = await axios.post<EncryptedPii[]>(
      'https://api.global.id/v1/vault/get-encrypted-data',
      {
        private_data_tokens: consentTokens
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    return data;
  }
}
