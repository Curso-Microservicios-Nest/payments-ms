import { Module } from '@nestjs/common';

import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
