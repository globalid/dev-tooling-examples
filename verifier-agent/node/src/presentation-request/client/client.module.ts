import { Module } from '@nestjs/common';

import { ClientGateway } from './client.gateway';
import { ClientRegistry } from './client.registry';
import { ClientService } from './client.service';

@Module({
  providers: [ClientGateway, ClientService, ClientRegistry],
  exports: [ClientService]
})
export class ClientModule {}
