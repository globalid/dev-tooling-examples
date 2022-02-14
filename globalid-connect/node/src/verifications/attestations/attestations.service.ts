import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Attestation } from './attestation.interface';

@Injectable()
export class AttestationsService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
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

    const response = lastValueFrom<Attestation[]>(
      this.httpService
        .get<Attestation[]>('https://api.global.id/v1/attestations', {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError(e => {
            throw new HttpException(e.response.data, e.response.status);
          })
        )
    );

    return response;
  }
}