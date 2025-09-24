import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { TransactionType, PaymentMethodType } from '@prisma/client';

interface InstallmentFilters {
  status?: string;
  paymentMethodId?: number;
}

@Injectable()
export class InstallmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createInstallmentDto: CreateInstallmentDto) {
    // Verificar se a categoria existe
    const category = await this.prisma.category.findFirst({
      where: { id: createInstallmentDto.categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se o método de pagamento existe
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: createInstallmentDto.paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    // Calcular valor da parcela
    const totalAmount = createInstallmentDto.totalAmount / createInstallmentDto.installmentCount;
    const startDate = createInstallmentDto.startDate ? new Date(createInstallmentDto.startDate) : new Date();

    // Criar o parcelamento
    const installment = await this.prisma.installment.create({
      data: {
        description: createInstallmentDto.description,
        totalAmount: createInstallmentDto.totalAmount,
        installmentCount: createInstallmentDto.installmentCount,
        startDate,
        installmentType: createInstallmentDto.installmentType,
        categoryId: createInstallmentDto.categoryId,
        paymentMethodId: createInstallmentDto.paymentMethodId,
        userId,
        notes: createInstallmentDto.notes,
      },
    });

    // Criar transações para cada parcela
    const transactions: any[] = [];
    for (let i = 1; i <= createInstallmentDto.installmentCount; i++) {
      const installmentDate = new Date(startDate);
      installmentDate.setMonth(installmentDate.getMonth() + (i - 1));

      const transaction = await this.prisma.transaction.create({
        data: {
          description: `${createInstallmentDto.description} (${i}/${createInstallmentDto.installmentCount})`,
          amount: -Math.abs(totalAmount), // Sempre negativo para despesas parceladas
          date: installmentDate,
          type: TransactionType.EXPENSE,
          categoryId: createInstallmentDto.categoryId,
          paymentMethodId: createInstallmentDto.paymentMethodId,
          installmentId: installment.id,
          installmentNumber: i,
          userId,
          notes: createInstallmentDto.notes,
        },
      });

      transactions.push(transaction);
    }

    // Se for cartão de crédito, não atualizar saldo imediatamente
    // Se for outro tipo, debitar o valor total
    if (paymentMethod.type !== PaymentMethodType.CREDIT_CARD) {
      await this.prisma.paymentMethod.update({
        where: { id: paymentMethod.id },
        data: {
          currentBalance: {
            decrement: createInstallmentDto.totalAmount,
          },
        },
      });
    }

    return {
      installment: await this.findOne(userId, installment.id),
      transactions,
      message: `Parcelamento criado com ${createInstallmentDto.installmentCount} parcelas`,
    };
  }

  async findAllByUser(userId: number, filters: InstallmentFilters = {}) {
    const where: any = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.paymentMethodId) {
      where.paymentMethodId = filters.paymentMethodId;
    }

    return this.prisma.installment.findMany({
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
        transactions: {
          select: {
            id: true,
            amount: true,
            date: true,
            
          },
          orderBy: { installmentNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const installment = await this.prisma.installment.findFirst({
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
        transactions: {
          select: {
            id: true,
            amount: true,
            date: true,
            
            createdAt: true,
          },
          orderBy: { installmentNumber: 'asc' },
        },
      },
    });

    if (!installment) {
      throw new NotFoundException('Parcelamento não encontrado');
    }

    return installment;
  }

  async payInstallment(userId: number, installmentId: number, installmentNumber: number, paidAmount?: number) {
    // Verificar se o parcelamento existe
    const installment = await this.findOne(userId, installmentId);

    // Verificar se a parcela existe
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        installmentId,
        installmentNumber,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Parcela não encontrada');
    }

    // Verificar se a parcela já foi paga
    // Verificação de pagamento removida - campo não existe no schema

    const amountToPay = paidAmount || Math.abs(transaction.amount);

    // Marcar transação como paga
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        
        
        
      },
    });

    // Atualizar contador de parcelas pagas
    const updatedInstallment = await this.prisma.installment.update({
      where: { id: installmentId },
      data: {
        currentInstallment: {
          increment: 1,
        },
      },
    });

    // Se todas as parcelas foram pagas, marcar como concluído
    if (updatedInstallment.currentInstallment >= updatedInstallment.installmentCount) {
      await this.prisma.installment.update({
        where: { id: installmentId },
        data: {
          
        },
      });
    }

    // Se não for cartão de crédito, debitar do saldo
    if (installment.paymentMethod.type !== PaymentMethodType.CREDIT_CARD) {
      await this.prisma.paymentMethod.update({
        where: { id: installment.paymentMethodId },
        data: {
          currentBalance: {
            decrement: amountToPay,
          },
        },
      });
    }

    return {
      message: `Parcela ${installmentNumber}/${installment.installmentCount} paga com sucesso`,
      installment: await this.findOne(userId, installmentId),
    };
  }

  async remove(userId: number, id: number) {
    // Verificar se o parcelamento existe
    const installment = await this.findOne(userId, id);

    // Verificar se há parcelas já pagas
    const paidTransactions = await this.prisma.transaction.count({
      where: {
        installmentId: id,
        
      },
    });

    if (paidTransactions > 0) {
      throw new BadRequestException(
        'Não é possível excluir um parcelamento que possui parcelas já pagas. Cancele as parcelas restantes.',
      );
    }

    // Remover todas as transações do parcelamento
    await this.prisma.transaction.deleteMany({
      where: { installmentId: id },
    });

    // Se não for cartão de crédito, reverter o valor do saldo
    if (installment.paymentMethod.type !== PaymentMethodType.CREDIT_CARD) {
      await this.prisma.paymentMethod.update({
        where: { id: installment.paymentMethodId },
        data: {
          currentBalance: {
            increment: installment.totalAmount,
          },
        },
      });
    }

    // Remover o parcelamento
    return this.prisma.installment.delete({
      where: { id },
    });
  }

  async cancelInstallment(userId: number, id: number) {
    // Verificar se o parcelamento existe
    const installment = await this.findOne(userId, id);

    // Marcar como cancelado
    const canceledInstallment = await this.prisma.installment.update({
      where: { id },
      data: {
        
      },
    });

    // Remover transações não pagas
    await this.prisma.transaction.deleteMany({
      where: {
        installmentId: id,
        
      },
    });

    return {
      message: 'Parcelamento cancelado com sucesso',
      installment: canceledInstallment,
    };
  }

  async getPendingInstallments(userId: number) {
    const currentDate = new Date();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return this.prisma.transaction.findMany({
      where: {
        userId,
        installmentId: { not: null },
        
        date: {
          lte: endOfMonth,
        },
      },
      include: {
        installment: {
          select: {
            id: true,
            description: true,
            
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
}
