import { Module } from '@nestjs/common'
import { AuthClient } from './auth.service'
import { IAuthClient } from './auth.interface'

@Module({})
export class GidModule {
  private authClient: IAuthClient

  constructor() {
    this.authClient = new AuthClient('' /* config.clientId */, '' /* config.clientSecret */)
  }
}
