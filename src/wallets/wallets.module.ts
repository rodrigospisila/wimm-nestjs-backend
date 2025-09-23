import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WalletsV2Controller } from './wallets-v2.controller';
import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';

@Module({
  controllers: [WalletsController, WalletsV2Controller],
  providers: [WalletsService, WalletGroupsService, PaymentMethodsService],
  exports: [WalletsService, WalletGroupsService, PaymentMethodsService],
})
export class WalletsModule {}
