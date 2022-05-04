import { Module } from '@nestjs/common';

import { gidVerifierClientProvider } from './gid-verifier-client.provider';

@Module({
  providers: [gidVerifierClientProvider],
  exports: [gidVerifierClientProvider]
})
export class GidModule {}
