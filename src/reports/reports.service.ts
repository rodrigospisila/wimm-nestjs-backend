import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: number, startDate: Date, endDate: Date) {
    // Buscar saldo total dos métodos de pagamento
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where: { 
        OR: [
          { walletGroup: { userId } },
          { AND: [{ walletGroupId: null }, { userId }] }
        ]
      },
      select: { currentBalance: true, creditLimit: true },
    });

    const totalBalance = paymentMethods.reduce((sum, method) => sum + method.currentBalance, 0);

    // Buscar transações do período
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: true,
        paymentMethod: {
          include: {
            walletGroup: true,
          },
        },
      },
    });

    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));

    // Estatísticas gerais
    const [groupsCount, paymentMethodsCount, categoriesCount] = await Promise.all([
      this.prisma.walletGroup.count({ where: { userId } }),
      this.prisma.paymentMethod.count({
        where: {
          OR: [
            { walletGroup: { userId } },
            { AND: [{ walletGroupId: null }, { userId }] }
          ]
        }
      }),
      this.prisma.category.count({ where: { userId } }),
    ]);

    return {
      summary: {
        totalBalance,
        totalIncome,
        totalExpense,
        groupsCount,
        paymentMethodsCount,
        categoriesCount,
      },
      topCategories: [],
      recentTransactions: transactions.slice(0, 10),
    };
  }

  async getCategoriesReport(userId: number, startDate: Date, endDate: Date, type?: string) {
    const whereClause: any = {
      userId,
      date: { gte: startDate, lte: endDate },
    };

    if (type && type !== 'ALL') {
      whereClause.type = type;
    }

    const transactions = await this.prisma.transaction.findMany({
      where: whereClause,
      include: {
        category: true,
        paymentMethod: {
          include: {
            walletGroup: true,
          },
        },
      },
    });

    return {
      categories: [],
      summary: {
        totalAmount: 0,
        categoriesCount: 0,
        transactionsCount: transactions.length,
      },
    };
  }

  async getTimeAnalysis(userId: number, startDate: Date, endDate: Date, period: string = 'daily') {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: true,
        paymentMethod: {
          include: {
            walletGroup: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return {
      periods: [],
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        totalNet: 0,
        totalTransactions: transactions.length,
        periodsCount: 0,
      },
    };
  }

  async getInstallmentsReport(userId: number, status?: string) {
    const whereClause: any = { userId };

    if (status) {
      switch (status) {
        case 'active':
          whereClause.isActive = true;
          break;
        case 'completed':
          whereClause.isActive = false;
          break;
      }
    }

    const installments = await this.prisma.installment.findMany({
      where: whereClause,
      include: {
        category: true,
        paymentMethod: {
          include: {
            walletGroup: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      installments: installments.map(installment => ({
        id: installment.id,
        description: installment.description,
        totalAmount: installment.totalAmount,
        installmentCount: installment.installmentCount,
        currentInstallment: installment.currentInstallment,
        isActive: installment.isActive,
        category: installment.category,
        paymentMethod: installment.paymentMethod,
        createdAt: installment.createdAt,
      })),
      summary: {
        totalInstallments: installments.length,
        activeInstallments: installments.filter(i => i.isActive).length,
        completedInstallments: installments.filter(i => !i.isActive).length,
        totalAmount: installments.reduce((sum, i) => sum + i.totalAmount, 0),
      },
    };
  }
}
