import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Attestation } from './attestation.interface';

@Injectable()
export class AttestationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}
  
  private get redirectUri() {
    return this.configService.get<string>('ATTESTATION_REDIRECT_URI');
  }

  async getAttestations(code: string): Promise<Attestation[]> {
    const { access_token } = await this.authService.getTokens({
      code,
      redirectUri: this.redirectUri
    });

    const response$ = this.httpService
      .get<Attestation[]>('https://api.global.id/v1/attestations', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
