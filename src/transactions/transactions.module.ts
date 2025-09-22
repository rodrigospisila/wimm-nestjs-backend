import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { InstallmentsService } from './installments.service';
import { InstallmentsProcessorService } from './installments-processor.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, InstallmentsService, InstallmentsProcessorService],
  exports: [TransactionsService, InstallmentsService, InstallmentsProcessorService],
})
export class TransactionsModule {}
