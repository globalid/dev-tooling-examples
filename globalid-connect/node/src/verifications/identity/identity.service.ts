import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class IdentityService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private httpService: HttpService
  ) {}

  private get redirectUri() {
    return this.configService.get<string>('IDENTITY_REDIRECT_URI');
  }

  async getIdentity(code: string) {
    const { access_token } = await this.authService.getTokens({ code, redirectUri: this.redirectUri });

    const response = this.httpService
      .get('https://api.global.id/v1/identity/me', { headers: { Authorization: `Bearer ${access_token}` } })
      .pipe(
        map((response) => {
          return response.data;
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );

    return lastValueFrom(response);
  }
}
