import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [PrismaModule, AuthModule, WalletsModule, CategoriesModule, TransactionsModule, ReportsModule, BudgetsModule],
})
export class AppModule {}
