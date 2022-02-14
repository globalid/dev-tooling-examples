import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { Identity } from './identity.interface';

@Injectable()
export class IdentityService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  private get redirectUri() {
    return this.configService.get<string>('IDENTITY_REDIRECT_URI');
  }

  async get(code: string): Promise<Identity> {
    const { access_token } = await this.authService.getTokens({ code, redirectUri: this.redirectUri });

    const response = lastValueFrom<Identity>(
      this.httpService
        .get<Identity>('https://api.global.id/v1/identities/me', { headers: { Authorization: `Bearer ${access_token}` } })
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
