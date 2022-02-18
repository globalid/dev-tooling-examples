import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';
import { Identity } from './identity.interface';

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

    const response$ = this.httpService.get<Identity>('https://api.global.id/v1/identities/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const response = await lastValueFrom(response$);
    return response.data;
  }
}
