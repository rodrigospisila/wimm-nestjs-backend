import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { InstallmentsService } from './installments.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, InstallmentsService, PrismaService],
  exports: [TransactionsService, InstallmentsService],
})
export class TransactionsModule {}
