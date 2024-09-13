import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs } from 'src/config';
import { Services } from 'src/enums';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Services.NATS_SERVICE,
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: Services.NATS_SERVICE,
        transport: Transport.NATS,
        options: { servers: envs.natsServers },
      },
    ]),
  ],
})
export class NatsModule {}
