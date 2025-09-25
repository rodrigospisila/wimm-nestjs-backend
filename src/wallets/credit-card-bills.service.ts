import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethodType, TransactionType } from '@prisma/client';

interface CreditCardBill {
  id: number;
  name: string;
  creditLimit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  currentBill: {
    month: number;
    year: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    dueDate: Date;
    status: 'OPEN' | 'CLOSED' | 'PAID' | 'OVERDUE';
    transactions: Array<{
      id: number;
      description: string;
      amount: number;
      date: Date;
      category: {
        name: string;
        color: string;
        icon: string;
      };
      installmentInfo?: {
        currentInstallment: number;
        totalInstallments: number;
      };
    }>;
  };
  previousBills: Array<{
    month: number;
    year: number;
    totalAmount: number;
    paidAmount: number;
    status: 'PAID' | 'OVERDUE';
    dueDate: Date;
  }>;
}

@Injectable()
export class CreditCardBillsService {
  constructor(private prisma: PrismaService) {}

  async getCreditCards(userId: number): Promise<any[]> {
    const creditCards = await this.prisma.paymentMethod.findMany({
      where: {
        userId,
        type: PaymentMethodType.CREDIT_CARD,
        isActive: true,
      },
      include: {
        walletGroup: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return creditCards;
  }

  async getCreditCardBill(userId: number, paymentMethodId: number, month?: number, year?: number): Promise<any> {
    const creditCard = await this.prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
        type: PaymentMethodType.CREDIT_CARD,
      },
      include: {
        walletGroup: true,
      },
    });

    if (!creditCard) {
      throw new Error('Cartão de crédito não encontrado');
    }

    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    // Calcular período da fatura
    const billPeriod = this.calculateBillPeriod(targetMonth, targetYear, creditCard.closingDay || 1);

    // Buscar transações do período
    const transactions = await this.prisma.transaction.findMany({
      where: {
        paymentMethodId,
        date: {
          gte: billPeriod.startDate,
          lte: billPeriod.endDate,
        },
        type: TransactionType.EXPENSE,
      },
      include: {
        category: true,
        installment: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calcular totais
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const paidAmount = 0; // TODO: Implementar lógica de pagamento
    const remainingAmount = totalAmount - paidAmount;

    // Determinar status da fatura
    const dueDate = new Date(targetYear, targetMonth - 1, creditCard.dueDay || 10);
    const status = this.getBillStatus(dueDate, remainingAmount);

    // Buscar faturas anteriores
    const previousBills = await this.getPreviousBills(paymentMethodId, targetMonth, targetYear);

    return {
      id: creditCard.id,
      name: creditCard.name,
      creditLimit: creditCard.creditLimit || 0,
      availableLimit: creditCard.availableLimit || 0,
      closingDay: creditCard.closingDay || 1,
      dueDay: creditCard.dueDay || 10,
      currentBill: {
        month: targetMonth,
        year: targetYear,
        totalAmount,
        paidAmount,
        remainingAmount,
        dueDate,
        status,
        transactions: transactions.map(t => ({
          id: t.id,
          description: t.description,
          amount: Math.abs(t.amount),
          date: t.date,
          category: {
            name: t.category?.name || 'Categoria',
            color: t.category?.color || '#666',
            icon: t.category?.icon || 'shopping-cart',
          },
          installmentInfo: t.installment ? {
            currentInstallment: t.installmentNumber || 1,
            totalInstallments: t.installment.installmentCount,
          } : undefined,
        })),
      },
      previousBills,
    };
  }

  async getAllCreditCardBills(userId: number): Promise<any[]> {
    const creditCards = await this.getCreditCards(userId);
    const bills: any[] = [];

    for (const card of creditCards) {
      try {
        const bill = await this.getCreditCardBill(userId, card.id);
        bills.push(bill);
      } catch (error) {
        console.error(`Erro ao buscar fatura do cartão ${card.id}:`, error);
      }
    }

    return bills;
  }

  private calculateBillPeriod(month: number, year: number, closingDay: number) {
    // Período da fatura: do fechamento anterior até o fechamento atual
    const currentClosing = new Date(year, month - 1, closingDay);
    const previousClosing = new Date(year, month - 2, closingDay);

    // Se o fechamento atual já passou, considerar o próximo mês
    const now = new Date();
    if (currentClosing < now) {
      const nextClosing = new Date(year, month, closingDay);
      return {
        startDate: currentClosing,
        endDate: nextClosing,
      };
    }

    return {
      startDate: previousClosing,
      endDate: currentClosing,
    };
  }

  private getBillStatus(dueDate: Date, remainingAmount: number): 'OPEN' | 'CLOSED' | 'PAID' | 'OVERDUE' {
    const now = new Date();
    
    if (remainingAmount === 0) {
      return 'PAID';
    }
    
    if (dueDate < now) {
      return 'OVERDUE';
    }
    
    // Se falta mais de 7 dias para vencer, está aberta
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue > 7) {
      return 'OPEN';
    }
    
    return 'CLOSED';
  }

  private async getPreviousBills(paymentMethodId: number, currentMonth: number, currentYear: number) {
    const bills: any[] = [];
    
    // Buscar últimos 6 meses
    for (let i = 1; i <= 6; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      
      try {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            paymentMethodId,
            date: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
            type: TransactionType.EXPENSE,
          },
        });
        
        const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        if (totalAmount > 0) {
          bills.push({
            month,
            year,
            totalAmount,
            paidAmount: totalAmount, // Assumir que faturas antigas estão pagas
            status: 'PAID' as const,
            dueDate: new Date(year, month - 1, 10), // Assumir vencimento no dia 10
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar fatura ${month}/${year}:`, error);
      }
    }
    
    return bills;
  }

  async updateAvailableLimit(paymentMethodId: number): Promise<void> {
    const creditCard = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!creditCard || creditCard.type !== PaymentMethodType.CREDIT_CARD) {
      return;
    }

    // Calcular saldo utilizado (transações não pagas)
    const usedAmount = await this.prisma.transaction.aggregate({
      where: {
        paymentMethodId,
        type: TransactionType.EXPENSE,
        // TODO: Adicionar filtro para transações não pagas
      },
      _sum: {
        amount: true,
      },
    });

    const usedLimit = Math.abs(usedAmount._sum.amount || 0);
    const availableLimit = (creditCard.creditLimit || 0) - usedLimit;

    await this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        availableLimit: Math.max(0, availableLimit),
      },
    });
  }
}
