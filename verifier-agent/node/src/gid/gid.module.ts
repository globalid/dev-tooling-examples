import { Module } from '@nestjs/common';

import { gidVerifierClientProvider } from './gid-verifier-client.provider';

@Module({
  providers: [gidVerifierClientProvider]
})
export class GidModule {}
