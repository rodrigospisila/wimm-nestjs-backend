import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';

@Injectable()
export class WalletGroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createWalletGroupDto: CreateWalletGroupDto) {
    return this.prisma.walletGroup.create({
      data: {
        ...createWalletGroupDto,
        userId,
      },
      include: {
        paymentMethods: true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.walletGroup.findMany({
      where: { userId },
      include: {
        paymentMethods: {
          where: { isActive: true },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const walletGroup = await this.prisma.walletGroup.findFirst({
      where: { id, userId },
      include: {
        paymentMethods: {
          where: { isActive: true },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        },
      },
    });

    if (!walletGroup) {
      throw new NotFoundException('Grupo de carteira não encontrado');
    }

    return walletGroup;
  }

  async update(id: number, userId: number, updateData: Partial<CreateWalletGroupDto>) {
    const walletGroup = await this.findOne(id, userId);

    return this.prisma.walletGroup.update({
      where: { id },
      data: updateData,
      include: {
        paymentMethods: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const walletGroup = await this.findOne(id, userId);

    // Verificar se há métodos de pagamento ativos
    const activePaymentMethods = await this.prisma.paymentMethod.count({
      where: { walletGroupId: id, isActive: true },
    });

    if (activePaymentMethods > 0) {
      throw new BadRequestException(
        'Não é possível excluir um grupo de carteira que possui métodos de pagamento ativos'
      );
    }

    return this.prisma.walletGroup.delete({
      where: { id },
    });
  }

  async createDefaultWalletGroups(userId: number) {
    const defaultGroups = [
      {
        name: 'Nubank',
        type: string.DIGITAL_WALLET,
        description: 'Carteira digital Nubank',
        color: '#8A05BE',
        icon: 'nubank',
        hasIntegratedPix: true,
        hasWalletBalance: true,
      },
      {
        name: 'Mercado Pago',
        type: string.DIGITAL_WALLET,
        description: 'Carteira digital Mercado Pago',
        color: '#00B1EA',
        icon: 'mercado-pago',
        hasIntegratedPix: true,
        hasWalletBalance: true,
      },
      {
        name: 'PicPay',
        type: string.DIGITAL_WALLET,
        description: 'Carteira digital PicPay',
        color: '#11C76F',
        icon: 'picpay',
        hasIntegratedPix: true,
        hasWalletBalance: true,
      },
    ];

    const createdGroups: any[] = [];
    for (const group of defaultGroups) {
      const created = await this.create(userId, group);
      createdGroups.push(created as any);
    }

    return createdGroups;
  }
}
