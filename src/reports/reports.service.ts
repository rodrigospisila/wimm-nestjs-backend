import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: number, startDate?: Date, endDate?: Date) {
    const now = new Date();
    const defaultStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const where: any = {
      userId,
      date: {
        gte: defaultStart,
        lte: defaultEnd,
      },
    };

    const [
      totalIncome,
      totalExpense,
      transactionCount,
      topCategories,
      recentTransactions,
      paymentMethodsUsage,
    ] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({ where }),
      this.getTopCategories(userId, defaultStart, defaultEnd, 5),
      this.getRecentTransactions(userId, 10),
      this.getPaymentMethodsUsage(userId, defaultStart, defaultEnd),
    ]);

    const income = totalIncome._sum.amount || 0;
    const expense = Math.abs(totalExpense._sum.amount || 0);
    const balance = income - expense;

    return {
      period: {
        startDate: defaultStart,
        endDate: defaultEnd,
      },
      summary: {
        totalIncome: income,
        totalExpense: expense,
        balance,
        transactionCount,
      },
      topCategories,
      recentTransactions,
      paymentMethodsUsage,
    };
  }

  async getOverview(userId: number) {
    const [
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      activeWallets,
      activeInstallments,
      categoriesCount,
    ] = await Promise.all([
      this.getTotalBalance(userId),
      this.getMonthlyIncome(userId),
      this.getMonthlyExpense(userId),
      this.getActiveWalletsCount(userId),
      this.getActiveInstallmentsCount(userId),
      this.getCategoriesCount(userId),
    ]);

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance: monthlyIncome - monthlyExpense,
      activeWallets,
      activeInstallments,
      categoriesCount,
    };
  }

  async getCategoryReport(userId: number, startDate?: Date, endDate?: Date, type?: string) {
    const now = new Date();
    const defaultStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const where: any = {
      userId,
      date: {
        gte: defaultStart,
        lte: defaultEnd,
      },
    };

    if (type) {
      where.type = type as TransactionType;
    }

    const categoriesData = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    // Buscar informações das categorias
    const categoryIds = categoriesData.map(cat => cat.categoryId);
    const categoryDetails = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
        type: true,
        parentCategory: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    const categories = categoriesData.map(cat => {
      const details = categoryDetails.find(detail => detail.id === cat.categoryId);
      return {
        categoryId: cat.categoryId,
        name: details?.name || 'Categoria não encontrada',
        color: details?.color || '#666',
        icon: details?.icon || 'help',
        type: details?.type || 'EXPENSE',
        parentCategory: details?.parentCategory,
        amount: Math.abs(cat._sum.amount || 0),
        transactionCount: cat._count._all,
        percentage: 0, // Será calculado abaixo
      };
    });

    // Calcular percentuais
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    categories.forEach(cat => {
      cat.percentage = total > 0 ? (cat.amount / total) * 100 : 0;
    });

    return {
      period: {
        startDate: defaultStart,
        endDate: defaultEnd,
      },
      categories,
      total,
    };
  }

  async getTimeAnalysis(userId: number, period: string = 'monthly', type?: string) {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // 12 semanas
        groupBy = 'week';
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear() - 5, 0, 1); // 5 anos
        groupBy = 'year';
        break;
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1); // 12 meses
        groupBy = 'month';
    }

    const where: any = {
      userId,
      date: {
        gte: startDate,
        lte: now,
      },
    };

    if (type) {
      where.type = type as TransactionType;
    }

    // Buscar transações agrupadas por período
    const transactions = await this.prisma.transaction.findMany({
      where,
      select: {
        amount: true,
        date: true,
        type: true,
      },
      orderBy: { date: 'asc' },
    });

    // Agrupar dados por período
    const groupedData = new Map();

    transactions.forEach(transaction => {
      let key: string;
      const date = new Date(transaction.date);

      switch (groupBy) {
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          period: key,
          income: 0,
          expense: 0,
          balance: 0,
          transactionCount: 0,
        });
      }

      const data = groupedData.get(key);
      const amount = Math.abs(transaction.amount);

      if (transaction.type === TransactionType.INCOME) {
        data.income += amount;
      } else {
        data.expense += amount;
      }

      data.balance = data.income - data.expense;
      data.transactionCount++;
    });

    return {
      period: groupBy,
      data: Array.from(groupedData.values()),
    };
  }

  async getInstallmentReport(userId: number) {
    const [activeInstallments, upcomingPayments, completedInstallments] = await Promise.all([
      this.prisma.installment.findMany({
        where: { userId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
            },
          },
          paymentMethod: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              walletGroup: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                  icon: true,
                },
              },
            },
          },
          transactions: {
            select: {
              id: true,
              amount: true,
              date: true,
              installmentNumber: true,
            },
            orderBy: { installmentNumber: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.getUpcomingInstallmentPayments(userId),
      this.getCompletedInstallments(userId),
    ]);

    const summary = {
      activeCount: activeInstallments.length,
      totalActiveAmount: activeInstallments.reduce((sum, inst) => sum + inst.totalAmount, 0),
      upcomingPaymentsCount: upcomingPayments.length,
      upcomingPaymentsAmount: upcomingPayments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0),
      completedCount: completedInstallments,
    };

    return {
      summary,
      activeInstallments,
      upcomingPayments,
    };
  }

  async getPaymentMethodReport(userId: number, startDate?: Date, endDate?: Date) {
    const now = new Date();
    const defaultStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const where: any = {
      userId,
      date: {
        gte: defaultStart,
        lte: defaultEnd,
      },
    };

    const paymentMethodsData = await this.prisma.transaction.groupBy({
      by: ['paymentMethodId'],
      where,
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    // Buscar informações dos métodos de pagamento
    const paymentMethodIds = paymentMethodsData.map(pm => pm.paymentMethodId);
    const paymentMethodDetails = await this.prisma.paymentMethod.findMany({
      where: { id: { in: paymentMethodIds } },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        currentBalance: true,
        walletGroup: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    const paymentMethods = paymentMethodsData.map(pm => {
      const details = paymentMethodDetails.find(detail => detail.id === pm.paymentMethodId);
      return {
        paymentMethodId: pm.paymentMethodId,
        name: details?.name || 'Método não encontrado',
        type: details?.type || 'UNKNOWN',
        color: details?.color || '#666',
        currentBalance: details?.currentBalance || 0,
        walletGroup: details?.walletGroup,
        amount: Math.abs(pm._sum.amount || 0),
        transactionCount: pm._count._all,
      };
    });

    return {
      period: {
        startDate: defaultStart,
        endDate: defaultEnd,
      },
      paymentMethods,
    };
  }

  async getBalanceEvolution(userId: number, months: number = 12) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
        type: true,
      },
      orderBy: { date: 'asc' },
    });

    // Agrupar por mês
    const monthlyData = new Map();
    let runningBalance = 0;

    // Inicializar meses
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyData.set(key, {
        period: key,
        income: 0,
        expense: 0,
        balance: runningBalance,
      });
    }

    // Processar transações
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (monthlyData.has(key)) {
        const data = monthlyData.get(key);
        const amount = Math.abs(transaction.amount);

        if (transaction.type === TransactionType.INCOME) {
          data.income += amount;
          runningBalance += amount;
        } else {
          data.expense += amount;
          runningBalance -= amount;
        }

        data.balance = runningBalance;
      }
    });

    return {
      months,
      data: Array.from(monthlyData.values()),
    };
  }

  async getMonthlySummary(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const where: any = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [
      totalIncome,
      totalExpense,
      transactionCount,
      categorySummary,
      paymentMethodSummary,
      dailyData,
    ] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
      this.prisma.transaction.count({ where }),
      this.getTopCategories(userId, startDate, endDate, 10),
      this.getPaymentMethodsUsage(userId, startDate, endDate),
      this.getDailyData(userId, year, month),
    ]);

    const income = totalIncome._sum.amount || 0;
    const expense = Math.abs(totalExpense._sum.amount || 0);

    return {
      period: {
        year,
        month,
        startDate,
        endDate,
      },
      summary: {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        transactionCount,
      },
      categorySummary,
      paymentMethodSummary,
      dailyData,
    };
  }

  // Métodos auxiliares privados
  private async getTotalBalance(userId: number): Promise<number> {
    const result = await this.prisma.paymentMethod.aggregate({
      where: { userId },
      _sum: { currentBalance: true },
    });
    return result._sum.currentBalance || 0;
  }

  private async getMonthlyIncome(userId: number): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.INCOME,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  }

  private async getMonthlyExpense(userId: number): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    });

    return Math.abs(result._sum.amount || 0);
  }

  private async getActiveWalletsCount(userId: number): Promise<number> {
    return this.prisma.paymentMethod.count({
      where: { userId },
    });
  }

  private async getActiveInstallmentsCount(userId: number): Promise<number> {
    return this.prisma.installment.count({
      where: { userId },
    });
  }

  private async getCategoriesCount(userId: number): Promise<number> {
    return this.prisma.category.count({
      where: { userId },
    });
  }

  private async getTopCategories(userId: number, startDate: Date, endDate: Date, limit: number = 5) {
    const categories = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: limit,
    });

    const categoryIds = categories.map(cat => cat.categoryId);
    const categoryDetails = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
        type: true,
      },
    });

    return categories.map(cat => {
      const details = categoryDetails.find(detail => detail.id === cat.categoryId);
      return {
        categoryId: cat.categoryId,
        name: details?.name || 'Categoria não encontrada',
        color: details?.color || '#666',
        icon: details?.icon || 'help',
        type: details?.type || 'EXPENSE',
        amount: Math.abs(cat._sum.amount || 0),
        transactionCount: cat._count._all,
      };
    });
  }

  private async getRecentTransactions(userId: number, limit: number = 10) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        paymentMethod: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private async getPaymentMethodsUsage(userId: number, startDate: Date, endDate: Date) {
    const paymentMethods = await this.prisma.transaction.groupBy({
      by: ['paymentMethodId'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
      _count: { _all: true },
    });

    const paymentMethodIds = paymentMethods.map(pm => pm.paymentMethodId);
    const paymentMethodDetails = await this.prisma.paymentMethod.findMany({
      where: { id: { in: paymentMethodIds } },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
      },
    });

    return paymentMethods.map(pm => {
      const details = paymentMethodDetails.find(detail => detail.id === pm.paymentMethodId);
      return {
        paymentMethodId: pm.paymentMethodId,
        name: details?.name || 'Método não encontrado',
        type: details?.type || 'UNKNOWN',
        color: details?.color || '#666',
        amount: Math.abs(pm._sum.amount || 0),
        transactionCount: pm._count._all,
      };
    });
  }

  private async getUpcomingInstallmentPayments(userId: number) {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.prisma.transaction.findMany({
      where: {
        userId,
        installmentId: { not: null },
        date: {
          gte: now,
          lte: endOfMonth,
        },
      },
      include: {
        installment: {
          select: {
            id: true,
            description: true,
            installmentCount: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        paymentMethod: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  private async getCompletedInstallments(userId: number): Promise<number> {
    return this.prisma.installment.count({
      where: {
        userId,
        // Assumindo que um parcelamento está completo quando currentInstallment >= installmentCount
      },
    });
  }

  private async getDailyData(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
        type: true,
      },
      orderBy: { date: 'asc' },
    });

    // Agrupar por dia
    const dailyData = new Map();

    // Inicializar todos os dias do mês
    const daysInMonth = endDate.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const key = day.toString().padStart(2, '0');
      dailyData.set(key, {
        day,
        income: 0,
        expense: 0,
        balance: 0,
        transactionCount: 0,
      });
    }

    // Processar transações
    transactions.forEach(transaction => {
      const day = new Date(transaction.date).getDate();
      const key = day.toString().padStart(2, '0');

      if (dailyData.has(key)) {
        const data = dailyData.get(key);
        const amount = Math.abs(transaction.amount);

        if (transaction.type === TransactionType.INCOME) {
          data.income += amount;
        } else {
          data.expense += amount;
        }

        data.balance = data.income - data.expense;
        data.transactionCount++;
      }
    });

    return Array.from(dailyData.values());
  }
}
