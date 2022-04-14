import { Module } from '@nestjs/common'
import { AuthClient } from './auth.service'

@Module({
  providers: [ AuthClient ],
})
export class GidModule {
  constructor(private authClient: AuthClient) {}
}
