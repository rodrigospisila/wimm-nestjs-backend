import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodType } from '@prisma/client';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createPaymentMethodDto: CreatePaymentMethodDto) {
    // Validações específicas para cartão de crédito
    if (createPaymentMethodDto.type === PaymentMethodType.CREDIT_CARD) {
      if (!createPaymentMethodDto.creditLimit || createPaymentMethodDto.creditLimit <= 0) {
        throw new BadRequestException('Limite do cartão de crédito é obrigatório e deve ser maior que zero');
      }
      
      if (!createPaymentMethodDto.closingDay || createPaymentMethodDto.closingDay < 1 || createPaymentMethodDto.closingDay > 28) {
        throw new BadRequestException('Dia de fechamento deve estar entre 1 e 28');
      }
      
      if (!createPaymentMethodDto.dueDay || createPaymentMethodDto.dueDay < 1 || createPaymentMethodDto.dueDay > 31) {
        throw new BadRequestException('Dia de vencimento deve estar entre 1 e 31');
      }
      
      if (createPaymentMethodDto.dueDay <= createPaymentMethodDto.closingDay) {
        throw new BadRequestException('Dia de vencimento deve ser posterior ao dia de fechamento');
      }
    }

    // Se for definido como primário, remover primário dos outros métodos do mesmo grupo
    if (createPaymentMethodDto.isPrimary && createPaymentMethodDto.walletGroupId) {
      await this.prisma.paymentMethod.updateMany({
        where: {
          walletGroupId: createPaymentMethodDto.walletGroupId,
          userId,
        },
        data: { isPrimary: false },
      });
    }

    const availableLimit = createPaymentMethodDto.type === PaymentMethodType.CREDIT_CARD 
      ? createPaymentMethodDto.creditLimit 
      : null;

    return this.prisma.paymentMethod.create({
      data: {
        ...createPaymentMethodDto,
        availableLimit,
        userId,
      },
      include: {
        walletGroup: true,
      },
    });
  }

  async findAll(userId: number, walletGroupId?: number) {
    const where: any = { userId, isActive: true };
    
    if (walletGroupId !== undefined) {
      where.walletGroupId = walletGroupId;
    }

    return this.prisma.paymentMethod.findMany({
      where,
      include: {
        walletGroup: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ],
    });
  }

  async findOne(id: number, userId: number) {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id, userId },
      include: {
        walletGroup: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
          },
        },
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    return paymentMethod;
  }

  async update(id: number, userId: number, updateData: Partial<CreatePaymentMethodDto>) {
    const paymentMethod = await this.findOne(id, userId);

    // Validações para cartão de crédito
    if (paymentMethod.type === PaymentMethodType.CREDIT_CARD || updateData.type === PaymentMethodType.CREDIT_CARD) {
      if (updateData.closingDay && (updateData.closingDay < 1 || updateData.closingDay > 28)) {
        throw new BadRequestException('Dia de fechamento deve estar entre 1 e 28');
      }
      
      if (updateData.dueDay && (updateData.dueDay < 1 || updateData.dueDay > 31)) {
        throw new BadRequestException('Dia de vencimento deve estar entre 1 e 31');
      }
      
      const closingDay = updateData.closingDay || paymentMethod.closingDay;
      const dueDay = updateData.dueDay || paymentMethod.dueDay;
      
      if (closingDay && dueDay && dueDay <= closingDay) {
        throw new BadRequestException('Dia de vencimento deve ser posterior ao dia de fechamento');
      }
    }

    // Se for definido como primário, remover primário dos outros métodos do mesmo grupo
    if (updateData.isPrimary && paymentMethod.walletGroupId) {
      await this.prisma.paymentMethod.updateMany({
        where: {
          walletGroupId: paymentMethod.walletGroupId,
          userId,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    // Recalcular limite disponível se necessário
    let availableLimit = paymentMethod.availableLimit;
    if (updateData.creditLimit !== undefined) {
      const usedLimit = (paymentMethod.creditLimit || 0) - (paymentMethod.availableLimit || 0);
      availableLimit = updateData.creditLimit - usedLimit;
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        ...updateData,
        availableLimit,
      },
      include: {
        walletGroup: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const paymentMethod = await this.findOne(id, userId);

    // Verificar se há transações associadas
    const transactionCount = await this.prisma.transaction.count({
      where: { paymentMethodId: id },
    });

    if (transactionCount > 0) {
      // Apenas desativar se houver transações
      return this.prisma.paymentMethod.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      // Excluir completamente se não houver transações
      return this.prisma.paymentMethod.delete({
        where: { id },
      });
    }
  }

  async updateBalance(id: number, userId: number, amount: number, operation: 'add' | 'subtract') {
    const paymentMethod = await this.findOne(id, userId);

    const newBalance = operation === 'add' 
      ? paymentMethod.currentBalance + amount
      : paymentMethod.currentBalance - amount;

    // Para cartão de crédito, atualizar limite disponível
    let availableLimit = paymentMethod.availableLimit;
    if (paymentMethod.type === PaymentMethodType.CREDIT_CARD) {
      availableLimit = operation === 'add'
        ? (paymentMethod.availableLimit || 0) + amount
        : (paymentMethod.availableLimit || 0) - amount;
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        currentBalance: newBalance,
        availableLimit,
      },
    });
  }

  async getByType(userId: number, type: PaymentMethodType) {
    return this.prisma.paymentMethod.findMany({
      where: {
        userId,
        type,
        isActive: true,
      },
      include: {
        walletGroup: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ],
    });
  }
}
