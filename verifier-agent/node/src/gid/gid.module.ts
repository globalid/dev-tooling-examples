import { Module } from '@nestjs/common';
import { GidVerifierClientFactory } from './gid-verifier-client.factory';

@Module({
  providers: [GidVerifierClientFactory]
})
export class GidModule {}
