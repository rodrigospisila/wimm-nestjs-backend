import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { WalletGroupType } from '@prisma/client';

@Injectable()
export class WalletGroupsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.walletGroup.findMany({
      where: { userId, isActive: true },
      include: {
        paymentMethods: {
          where: { isActive: true },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' },
          ],
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(userId: number, id: number) {
    const group = await this.prisma.walletGroup.findFirst({
      where: { id, userId, isActive: true },
      include: {
        paymentMethods: {
          where: { isActive: true },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Grupo de carteira não encontrado');
    }

    return group;
  }

  async create(userId: number, createGroupDto: CreateWalletGroupDto) {
    // Verificar se já existe um grupo com o mesmo nome para o usuário
    const existingGroup = await this.prisma.walletGroup.findFirst({
      where: {
        userId,
        name: createGroupDto.name,
        isActive: true,
      },
    });

    if (existingGroup) {
      throw new BadRequestException('Já existe um grupo com este nome');
    }

    return this.prisma.walletGroup.create({
      data: {
        ...createGroupDto,
        userId,
      },
      include: {
        paymentMethods: true,
      },
    });
  }

  async update(userId: number, id: number, updateGroupDto: Partial<CreateWalletGroupDto>) {
    // Verificar se o grupo existe e pertence ao usuário
    const existingGroup = await this.findOne(userId, id);

    // Se está alterando o nome, verificar se não existe outro grupo com o mesmo nome
    if (updateGroupDto.name && updateGroupDto.name !== existingGroup.name) {
      const duplicateGroup = await this.prisma.walletGroup.findFirst({
        where: {
          userId,
          name: updateGroupDto.name,
          isActive: true,
          id: { not: id },
        },
      });

      if (duplicateGroup) {
        throw new BadRequestException('Já existe um grupo com este nome');
      }
    }

    return this.prisma.walletGroup.update({
      where: { id },
      data: updateGroupDto,
      include: {
        paymentMethods: {
          where: { isActive: true },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });
  }

  async remove(userId: number, id: number) {
    // Verificar se o grupo existe e pertence ao usuário
    await this.findOne(userId, id);

    // Verificar se há métodos de pagamento associados
    const paymentMethodsCount = await this.prisma.paymentMethod.count({
      where: { walletGroupId: id, isActive: true },
    });

    if (paymentMethodsCount > 0) {
      throw new BadRequestException(
        'Não é possível excluir um grupo que possui métodos de pagamento. Remova ou transfira os métodos primeiro.',
      );
    }

    // Soft delete
    return this.prisma.walletGroup.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCount(userId: number): Promise<number> {
    return this.prisma.walletGroup.count({
      where: { userId, isActive: true },
    });
  }

  async getTypes() {
    const types = Object.values(WalletGroupType).map(type => ({
      value: type,
      label: this.getTypeLabel(type),
      description: this.getTypeDescription(type),
    }));

    return { types };
  }

  async createDefaults(userId: number) {
    const defaultGroups = [
      {
        name: 'Nubank',
        type: WalletGroupType.DIGITAL_WALLET,
        description: 'Carteira digital Nubank',
        color: '#8A05BE',
        icon: 'card',
        hasIntegratedPix: true,
        hasWalletBalance: true,
      },
      {
        name: 'Mercado Pago',
        type: WalletGroupType.DIGITAL_WALLET,
        description: 'Carteira digital Mercado Pago',
        color: '#00AAFF',
        icon: 'wallet',
        hasIntegratedPix: true,
        hasWalletBalance: true,
      },
      {
        name: 'PicPay',
        type: WalletGroupType.DIGITAL_WALLET,
        description: 'Carteira digital PicPay',
        color: '#21C25E',
        icon: 'phone-portrait',
        hasIntegratedPix: true,
        hasWalletBalance: true,
      },
      {
        name: 'Itaú',
        type: WalletGroupType.TRADITIONAL_BANK,
        description: 'Banco Itaú',
        color: '#FF6600',
        icon: 'business',
        hasIntegratedPix: true,
        hasWalletBalance: false,
      },
      {
        name: 'Bradesco',
        type: WalletGroupType.TRADITIONAL_BANK,
        description: 'Banco Bradesco',
        color: '#E30613',
        icon: 'business',
        hasIntegratedPix: true,
        hasWalletBalance: false,
      },
    ];

    const createdGroups: any[] = [];

    for (const groupData of defaultGroups) {
      try {
        // Verificar se já existe
        const existing = await this.prisma.walletGroup.findFirst({
          where: {
            userId,
            name: groupData.name,
            isActive: true,
          },
        });

        if (!existing) {
          const created = await this.prisma.walletGroup.create({
            data: {
              ...groupData,
              userId,
            },
          });
          createdGroups.push(created);

          // Criar métodos de pagamento padrão para o grupo
          await this.createDefaultPaymentMethods(userId, created.id, created.type);
        }
      } catch (error) {
        console.error(`Erro ao criar grupo ${groupData.name}:`, error);
      }
    }

    return {
      message: `${createdGroups.length} grupos padrão criados`,
      groups: createdGroups,
    };
  }

  private getTypeLabel(type: WalletGroupType): string {
    const labels = {
      [WalletGroupType.DIGITAL_WALLET]: 'Carteira Digital',
      [WalletGroupType.TRADITIONAL_BANK]: 'Banco Tradicional',
      [WalletGroupType.INVESTMENT]: 'Investimentos',
      [WalletGroupType.OTHER]: 'Outros',
    };
    return labels[type] || type;
  }

  private getTypeDescription(type: WalletGroupType): string {
    const descriptions = {
      [WalletGroupType.DIGITAL_WALLET]: 'Nubank, Mercado Pago, PicPay, etc.',
      [WalletGroupType.TRADITIONAL_BANK]: 'Itaú, Bradesco, Santander, etc.',
      [WalletGroupType.INVESTMENT]: 'XP, Rico, Clear, etc.',
      [WalletGroupType.OTHER]: 'Outras instituições financeiras',
    };
    return descriptions[type] || '';
  }

  private async createDefaultPaymentMethods(userId: number, walletGroupId: number, groupType: WalletGroupType) {
    const defaultMethods: any[] = [];

    if (groupType === WalletGroupType.DIGITAL_WALLET) {
      // Carteiras digitais têm cartão de crédito, débito e saldo
      defaultMethods.push(
        {
          name: 'Cartão de Crédito',
          type: 'CREDIT_CARD',
          currentBalance: 0,
          creditLimit: 1000,
          availableLimit: 1000,
          closingDay: 5,
          dueDay: 15,
          isPrimary: true,
          color: '#4CAF50',
          icon: 'credit-card',
        },
        {
          name: 'Cartão de Débito',
          type: 'DEBIT_CARD',
          currentBalance: 0,
          isPrimary: false,
          color: '#2196F3',
          icon: 'card',
        },
        {
          name: 'Saldo da Carteira',
          type: 'WALLET_BALANCE',
          currentBalance: 0,
          isPrimary: false,
          color: '#FF9800',
          icon: 'wallet',
        }
      );
    } else if (groupType === WalletGroupType.TRADITIONAL_BANK) {
      // Bancos tradicionais têm conta corrente e poupança
      defaultMethods.push(
        {
          name: 'Conta Corrente',
          type: 'CHECKING_ACCOUNT',
          currentBalance: 0,
          isPrimary: true,
          color: '#607D8B',
          icon: 'business',
        },
        {
          name: 'Poupança',
          type: 'SAVINGS_ACCOUNT',
          currentBalance: 0,
          isPrimary: false,
          color: '#4CAF50',
          icon: 'piggy-bank',
        }
      );
    }

    // Criar os métodos de pagamento
    for (const methodData of defaultMethods) {
      try {
        await this.prisma.paymentMethod.create({
          data: {
            ...methodData,
            userId,
            walletGroupId,
            isActive: true,
          },
        });
      } catch (error) {
        console.error(`Erro ao criar método de pagamento ${methodData.name}:`, error);
      }
    }
  }
}
