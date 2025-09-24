import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodType } from '@prisma/client';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number, walletGroupId?: number) {
    const where: any = { userId, isActive: true };
    
    if (walletGroupId !== undefined) {
      where.walletGroupId = walletGroupId;
    }

    return this.prisma.paymentMethod.findMany({
      where,
      include: {
        walletGroup: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findIndependentByUser(userId: number) {
    return this.prisma.paymentMethod.findMany({
      where: {
        userId,
        walletGroupId: null,
        isActive: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findOne(userId: number, id: number) {
    const method = await this.prisma.paymentMethod.findFirst({
      where: { id, userId, isActive: true },
      include: {
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

    if (!method) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    return method;
  }

  async create(userId: number, createMethodDto: CreatePaymentMethodDto) {
    // Verificar se o grupo existe (se fornecido)
    if (createMethodDto.walletGroupId) {
      const group = await this.prisma.walletGroup.findFirst({
        where: {
          id: createMethodDto.walletGroupId,
          userId,
          isActive: true,
        },
      });

      if (!group) {
        throw new NotFoundException('Grupo de carteira não encontrado');
      }
    }

    // Calcular availableLimit para cartões de crédito
    let availableLimit: number | undefined = undefined;
    if (createMethodDto.type === PaymentMethodType.CREDIT_CARD && createMethodDto.creditLimit) {
      availableLimit = createMethodDto.creditLimit;
    }

    const method = await this.prisma.paymentMethod.create({
      data: {
        ...createMethodDto,
        userId,
        availableLimit,
      },
      include: {
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

    // Se é o primeiro método do grupo ou foi marcado como principal, definir como principal
    if (createMethodDto.isPrimary || createMethodDto.walletGroupId) {
      await this.updatePrimaryStatus(userId, method.id, createMethodDto.walletGroupId);
    }

    return method;
  }

  async update(userId: number, id: number, updateMethodDto: Partial<CreatePaymentMethodDto>) {
    // Verificar se o método existe e pertence ao usuário
    const existingMethod = await this.findOne(userId, id);

    // Verificar se o novo grupo existe (se fornecido)
    if (updateMethodDto.walletGroupId && updateMethodDto.walletGroupId !== existingMethod.walletGroupId) {
      const group = await this.prisma.walletGroup.findFirst({
        where: {
          id: updateMethodDto.walletGroupId,
          userId,
          isActive: true,
        },
      });

      if (!group) {
        throw new NotFoundException('Grupo de carteira não encontrado');
      }
    }

    // Recalcular availableLimit se necessário
    let updateData: any = { ...updateMethodDto };
    if (updateMethodDto.creditLimit !== undefined && existingMethod.type === PaymentMethodType.CREDIT_CARD) {
      const usedCredit = (existingMethod.creditLimit || 0) - (existingMethod.availableLimit || 0);
      updateData.availableLimit = updateMethodDto.creditLimit - usedCredit;
    }

    const updatedMethod = await this.prisma.paymentMethod.update({
      where: { id },
      data: updateData,
      include: {
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

    // Se foi marcado como principal, atualizar status
    if (updateMethodDto.isPrimary) {
      await this.updatePrimaryStatus(userId, id, updatedMethod.walletGroupId || undefined);
    }

    return updatedMethod;
  }

  async remove(userId: number, id: number) {
    // Verificar se o método existe e pertence ao usuário
    await this.findOne(userId, id);

    // Verificar se há transações associadas
    const transactionsCount = await this.prisma.transaction.count({
      where: { paymentMethodId: id },
    });

    if (transactionsCount > 0) {
      throw new BadRequestException(
        'Não é possível excluir um método de pagamento que possui transações associadas.',
      );
    }

    // Soft delete
    return this.prisma.paymentMethod.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async setPrimary(userId: number, id: number) {
    const method = await this.findOne(userId, id);
    return this.updatePrimaryStatus(userId, id, method.walletGroupId || undefined);
  }

  async getCount(userId: number): Promise<number> {
    return this.prisma.paymentMethod.count({
      where: { userId, isActive: true },
    });
  }

  async getTotalBalance(userId: number): Promise<number> {
    const result = await this.prisma.paymentMethod.aggregate({
      where: { userId, isActive: true },
      _sum: { currentBalance: true },
    });

    return result._sum.currentBalance || 0;
  }

  async getTotalCreditLimit(userId: number): Promise<number> {
    const result = await this.prisma.paymentMethod.aggregate({
      where: {
        userId,
        isActive: true,
        type: PaymentMethodType.CREDIT_CARD,
      },
      _sum: { creditLimit: true },
    });

    return result._sum.creditLimit || 0;
  }

  async getTotalAvailableCredit(userId: number): Promise<number> {
    const result = await this.prisma.paymentMethod.aggregate({
      where: {
        userId,
        isActive: true,
        type: PaymentMethodType.CREDIT_CARD,
      },
      _sum: { availableLimit: true },
    });

    return result._sum.availableLimit || 0;
  }

  async getTypes() {
    const types = Object.values(PaymentMethodType).map(type => ({
      value: type,
      label: this.getTypeLabel(type),
      description: this.getTypeDescription(type),
      icon: this.getTypeIcon(type),
    }));

    return { types };
  }

  private async updatePrimaryStatus(userId: number, methodId: number, walletGroupId?: number) {
    // Remover status principal de outros métodos do mesmo grupo
    if (walletGroupId) {
      await this.prisma.paymentMethod.updateMany({
        where: {
          userId,
          walletGroupId,
          id: { not: methodId },
        },
        data: { isPrimary: false },
      });
    } else {
      // Para métodos independentes, remover status principal de outros independentes
      await this.prisma.paymentMethod.updateMany({
        where: {
          userId,
          walletGroupId: null,
          id: { not: methodId },
        },
        data: { isPrimary: false },
      });
    }

    // Definir o método atual como principal
    return this.prisma.paymentMethod.update({
      where: { id: methodId },
      data: { isPrimary: true },
      include: {
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
  }

  private getTypeLabel(type: PaymentMethodType): string {
    const labels = {
      [PaymentMethodType.CREDIT_CARD]: 'Cartão de Crédito',
      [PaymentMethodType.DEBIT_CARD]: 'Cartão de Débito',
      [PaymentMethodType.WALLET_BALANCE]: 'Saldo da Carteira',
      [PaymentMethodType.PIX]: 'PIX',
      [PaymentMethodType.CHECKING_ACCOUNT]: 'Conta Corrente',
      [PaymentMethodType.SAVINGS_ACCOUNT]: 'Poupança',
      [PaymentMethodType.CASH]: 'Dinheiro',
      [PaymentMethodType.INVESTMENT]: 'Investimentos',
      [PaymentMethodType.OTHER]: 'Outros',
    };
    return labels[type] || type;
  }

  private getTypeDescription(type: PaymentMethodType): string {
    const descriptions = {
      [PaymentMethodType.CREDIT_CARD]: 'Compras parceladas e à prazo',
      [PaymentMethodType.DEBIT_CARD]: 'Débito direto na conta',
      [PaymentMethodType.WALLET_BALANCE]: 'Saldo disponível na carteira digital',
      [PaymentMethodType.PIX]: 'Transferências instantâneas',
      [PaymentMethodType.CHECKING_ACCOUNT]: 'Conta corrente bancária',
      [PaymentMethodType.SAVINGS_ACCOUNT]: 'Conta poupança',
      [PaymentMethodType.CASH]: 'Dinheiro em espécie',
      [PaymentMethodType.INVESTMENT]: 'Aplicações financeiras',
      [PaymentMethodType.OTHER]: 'Outros métodos de pagamento',
    };
    return descriptions[type] || '';
  }

  private getTypeIcon(type: PaymentMethodType): string {
    const icons = {
      [PaymentMethodType.CREDIT_CARD]: 'card',
      [PaymentMethodType.DEBIT_CARD]: 'card-outline',
      [PaymentMethodType.WALLET_BALANCE]: 'wallet',
      [PaymentMethodType.PIX]: 'flash',
      [PaymentMethodType.CHECKING_ACCOUNT]: 'business',
      [PaymentMethodType.SAVINGS_ACCOUNT]: 'piggy-bank',
      [PaymentMethodType.CASH]: 'cash',
      [PaymentMethodType.INVESTMENT]: 'trending-up',
      [PaymentMethodType.OTHER]: 'ellipsis-horizontal',
    };
    return icons[type] || 'card';
  }
}
