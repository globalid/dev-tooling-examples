import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';
import { Attestation } from './attestation.interface';

@Injectable()
export class AttestationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}
s
  private get redirectUri() {
    return this.configService.get<string>('ATTESTATION_REDIRECT_URI');
  }

  async get(code: string): Promise<Attestation[]> {
    const { access_token } = await this.authService.getTokens({
      code,
      redirectUri: this.redirectUri
    });
    const { data } = await axios.post<Attestation[]>(
      'https://api.global.id/v1/attestations',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    return data;
  }
}
