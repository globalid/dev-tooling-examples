import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';
import { Attestation } from './attestation.interface';

@Injectable()
export class AttestationsService {
  constructor(private readonly authService: AuthService) {}

  async getAttestations(): Promise<Attestation[]> {
    const { access_token } = await this.authService.getTokens();
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
