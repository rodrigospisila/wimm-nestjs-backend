import { Module } from '@nestjs/common';
import { WalletsV2Controller } from './wallets-v2.controller';
import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WalletsV2Controller],
  providers: [WalletGroupsService, PaymentMethodsService, PrismaService],
  exports: [WalletGroupsService, PaymentMethodsService],
})
export class WalletsModule {}
