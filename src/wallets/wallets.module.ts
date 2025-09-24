import { Module } from '@nestjs/common';
import { WalletsV2Controller } from './wallets-v2.controller';
import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';

@Module({
  controllers: [WalletsV2Controller],
  providers: [WalletGroupsService, PaymentMethodsService],
  exports: [WalletGroupsService, PaymentMethodsService],
})
export class WalletsModule {}
