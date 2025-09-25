import { Module } from '@nestjs/common';
import { WalletsV2Controller } from './wallets-v2.controller';
import { WalletsController } from './wallets.controller';
import { CreditCardBillsController } from './credit-card-bills.controller';
import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
import { CreditCardBillsService } from './credit-card-bills.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WalletsV2Controller, WalletsController, CreditCardBillsController],
  providers: [WalletGroupsService, PaymentMethodsService, CreditCardBillsService, PrismaService],
  exports: [WalletGroupsService, PaymentMethodsService, CreditCardBillsService],
})
export class WalletsModule {}
