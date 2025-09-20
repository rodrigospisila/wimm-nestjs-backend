import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createWalletDto: CreateWalletDto) {
    const { name, initialBalance } = createWalletDto;

    const wallet = await this.prisma.wallet.create({
      data: {
        name,
        initialBalance,
        currentBalance: initialBalance,
        userId,
      },
    });

    return wallet;
  }

  async findAll(userId: number) {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    return wallets;
  }

  async findOne(id: number, userId: number) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          include: {
            category: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async update(id: number, userId: number, updateWalletDto: UpdateWalletDto) {
    // Verificar se a carteira pertence ao usuário
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!existingWallet) {
      throw new NotFoundException('Wallet not found');
    }

    const wallet = await this.prisma.wallet.update({
      where: { id },
      data: updateWalletDto,
    });

    return wallet;
  }

  async remove(id: number, userId: number) {
    // Verificar se a carteira pertence ao usuário
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!existingWallet) {
      throw new NotFoundException('Wallet not found');
    }

    await this.prisma.wallet.delete({
      where: { id },
    });

    return { message: 'Wallet deleted successfully' };
  }

  async getSummary(userId: number) {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
    });

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.currentBalance, 0);
    const walletsCount = wallets.length;

    return {
      totalBalance,
      walletsCount,
      wallets: wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        currentBalance: wallet.currentBalance,
      })),
    };
  }
}
