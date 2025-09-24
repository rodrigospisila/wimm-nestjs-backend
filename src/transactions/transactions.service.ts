import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
  paymentMethodId?: number;
  type?: TransactionType;
}

interface Pagination {
  page: number;
  limit: number;
}

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number, filters: TransactionFilters = {}, pagination: Pagination = { page: 1, limit: 50 }) {
    const where: any = { userId };

    if (filters.startDate && filters.endDate) {
      where.date = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.paymentMethodId) {
      where.paymentMethodId = filters.paymentMethodId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
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
          installment: {
            select: {
              id: true,
              
              
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: pagination.limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async findOne(userId: number, id: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
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
        installment: {
          select: {
            id: true,
            
            
            totalAmount: true,
            
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    // Verificar se a categoria existe
    const category = await this.prisma.category.findFirst({
      where: { id: createTransactionDto.categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se o método de pagamento existe
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: createTransactionDto.paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    // Criar a transação
    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
        date: createTransactionDto.date ? new Date(createTransactionDto.date) : new Date(),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
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
      },
    });

    // Atualizar saldo do método de pagamento
    await this.updatePaymentMethodBalance(paymentMethod.id, createTransactionDto.amount);

    return transaction;
  }

  async update(userId: number, id: number, updateTransactionDto: UpdateTransactionDto) {
    // Verificar se a transação existe
    const existingTransaction = await this.findOne(userId, id);

    // Verificar se a nova categoria existe (se fornecida)
    if (updateTransactionDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: updateTransactionDto.categoryId, userId },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    // Verificar se o novo método de pagamento existe (se fornecido)
    if (updateTransactionDto.paymentMethodId) {
      const paymentMethod = await this.prisma.paymentMethod.findFirst({
        where: { id: updateTransactionDto.paymentMethodId, userId },
      });

      if (!paymentMethod) {
        throw new NotFoundException('Método de pagamento não encontrado');
      }
    }

    // Se o valor mudou, ajustar saldos
    if (updateTransactionDto.amount !== undefined && updateTransactionDto.amount !== existingTransaction.amount) {
      const difference = updateTransactionDto.amount - existingTransaction.amount;
      await this.updatePaymentMethodBalance(existingTransaction.paymentMethodId, difference);
    }

    // Se o método de pagamento mudou, ajustar saldos
    if (updateTransactionDto.paymentMethodId && updateTransactionDto.paymentMethodId !== existingTransaction.paymentMethodId) {
      // Reverter no método antigo
      await this.updatePaymentMethodBalance(existingTransaction.paymentMethodId, -existingTransaction.amount);
      // Aplicar no método novo
      await this.updatePaymentMethodBalance(updateTransactionDto.paymentMethodId, updateTransactionDto.amount || existingTransaction.amount);
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
        date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
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
      },
    });

    return updatedTransaction;
  }

  async remove(userId: number, id: number) {
    // Verificar se a transação existe
    const transaction = await this.findOne(userId, id);

    // Reverter o saldo do método de pagamento
    await this.updatePaymentMethodBalance(transaction.paymentMethodId, -transaction.amount);

    // Remover a transação
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async getSummary(userId: number, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [
      totalIncome,
      totalExpense,
      transactionCount,
      topCategories,
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
      this.getTopCategories(userId, startDate, endDate, 5),
    ]);

    const income = totalIncome._sum.amount || 0;
    const expense = Math.abs(totalExpense._sum.amount || 0);
    const balance = income - expense;

    return {
      totalIncome: income,
      totalExpense: expense,
      balance,
      transactionCount,
      topCategories,
    };
  }

  async getRecent(userId: number, limit: number = 10) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async createTransfer(userId: number, transferData: {
    description: string;
    amount: number;
    fromPaymentMethodId: number;
    toPaymentMethodId: number;
    date?: string;
  }) {
    // Verificar se os métodos de pagamento existem
    const [fromMethod, toMethod] = await Promise.all([
      this.prisma.paymentMethod.findFirst({
        where: { id: transferData.fromPaymentMethodId, userId },
      }),
      this.prisma.paymentMethod.findFirst({
        where: { id: transferData.toPaymentMethodId, userId },
      }),
    ]);

    if (!fromMethod) {
      throw new NotFoundException('Método de pagamento de origem não encontrado');
    }

    if (!toMethod) {
      throw new NotFoundException('Método de pagamento de destino não encontrado');
    }

    // Verificar se há saldo suficiente
    if (fromMethod.currentBalance < transferData.amount) {
      throw new BadRequestException('Saldo insuficiente no método de origem');
    }

    // Criar categoria de transferência se não existir
    let transferCategory = await this.prisma.category.findFirst({
      where: { userId, name: 'Transferência' },
    });

    if (!transferCategory) {
      transferCategory = await this.prisma.category.create({
        data: {
          name: 'Transferência',
          type: TransactionType.EXPENSE, // Será usado para ambas
          color: '#6C5CE7',
          icon: 'swap-horizontal',
          userId,
        },
      });
    }

    const transferDate = transferData.date ? new Date(transferData.date) : new Date();

    // Criar transação de saída
    const outTransaction = await this.prisma.transaction.create({
      data: {
        description: `${transferData.description} (Saída)`,
        amount: -Math.abs(transferData.amount),
        date: transferDate,
        type: TransactionType.EXPENSE,
        categoryId: transferCategory.id,
        paymentMethodId: transferData.fromPaymentMethodId,
        userId,
      },
    });

    // Criar transação de entrada
    const inTransaction = await this.prisma.transaction.create({
      data: {
        description: `${transferData.description} (Entrada)`,
        amount: Math.abs(transferData.amount),
        date: transferDate,
        type: TransactionType.INCOME,
        categoryId: transferCategory.id,
        paymentMethodId: transferData.toPaymentMethodId,
        userId,
      },
    });

    // Atualizar saldos
    await Promise.all([
      this.updatePaymentMethodBalance(transferData.fromPaymentMethodId, -Math.abs(transferData.amount)),
      this.updatePaymentMethodBalance(transferData.toPaymentMethodId, Math.abs(transferData.amount)),
    ]);

    return {
      outTransaction,
      inTransaction,
      message: 'Transferência realizada com sucesso',
    };
  }

  private async updatePaymentMethodBalance(paymentMethodId: number, amount: number) {
    await this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        currentBalance: {
          increment: amount,
        },
      },
    });
  }

  private async getTopCategories(userId: number, startDate?: Date, endDate?: Date, limit: number = 5) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const categories = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: limit,
    });

    // Buscar informações das categorias
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
}
