import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletType } from '@prisma/client';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createWalletDto: CreateWalletDto) {
    const { name, initialBalance, type, description, color, icon } = createWalletDto;

    // Verificar se já existe uma carteira com o mesmo nome para o usuário
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { 
        userId, 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    if (existingWallet) {
      throw new BadRequestException('Já existe uma carteira com este nome');
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        name,
        initialBalance: initialBalance || 0,
        currentBalance: initialBalance || 0,
        type: type || WalletType.CHECKING_ACCOUNT,
        description,
        color: color || '#4CAF50',
        icon: icon || 'wallet',
        isActive: true,
        userId,
      },
    });

    return wallet;
  }

  async findAll(userId: number, type?: string) {
    const where: any = { userId, isActive: true };
    
    if (type && type !== 'ALL') {
      where.type = type as WalletType;
    }

    const wallets = await this.prisma.wallet.findMany({
      where,
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 3,
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return wallets.map(wallet => ({
      ...wallet,
      transactionsCount: wallet._count.transactions,
      lastTransactionDate: wallet.transactions[0]?.date || null,
    }));
  }

  async findOne(id: number, userId: number) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 20,
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    return {
      ...wallet,
      transactionsCount: wallet._count.transactions,
    };
  }

  async update(id: number, userId: number, updateWalletDto: UpdateWalletDto) {
    // Verificar se a carteira pertence ao usuário
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!existingWallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    // Verificar se o novo nome já existe (se estiver sendo alterado)
    if (updateWalletDto.name && updateWalletDto.name !== existingWallet.name) {
      const nameExists = await this.prisma.wallet.findFirst({
        where: { 
          userId, 
          name: {
            equals: updateWalletDto.name,
            mode: 'insensitive'
          },
          id: { not: id }
        },
      });

      if (nameExists) {
        throw new BadRequestException('Já existe uma carteira com este nome');
      }
    }

    const wallet = await this.prisma.wallet.update({
      where: { id },
      data: updateWalletDto,
    });

    return wallet;
  }

  async toggleActive(id: number, userId: number) {
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!existingWallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    const wallet = await this.prisma.wallet.update({
      where: { id },
      data: { isActive: !existingWallet.isActive },
    });

    return wallet;
  }

  async remove(id: number, userId: number) {
    // Verificar se a carteira pertence ao usuário
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!existingWallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    // Verificar se há transações associadas
    if (existingWallet._count.transactions > 0) {
      throw new BadRequestException(
        'Não é possível excluir uma carteira que possui transações. Desative-a em vez de excluir.'
      );
    }

    await this.prisma.wallet.delete({
      where: { id },
    });

    return { message: 'Carteira removida com sucesso' };
  }

  async getSummary(userId: number) {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId, isActive: true },
    });

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.currentBalance, 0);
    const walletsCount = wallets.length;

    // Agrupar por tipo
    const walletsByType = wallets.reduce((acc, wallet) => {
      const type = wallet.type;
      if (!acc[type]) {
        acc[type] = { count: 0, balance: 0 };
      }
      acc[type].count++;
      acc[type].balance += wallet.currentBalance;
      return acc;
    }, {} as Record<string, { count: number; balance: number }>);

    return {
      totalBalance,
      walletsCount,
      walletsByType,
      wallets: wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        type: wallet.type,
        currentBalance: wallet.currentBalance,
        color: wallet.color,
        icon: wallet.icon,
      })),
    };
  }

  async getStatistics(userId: number) {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
      include: {
        transactions: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
      },
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const statistics = {
      totalWallets: wallets.length,
      activeWallets: wallets.filter(w => w.isActive).length,
      totalBalance: wallets.reduce((sum, w) => sum + w.currentBalance, 0),
      monthlyTransactions: wallets.reduce((sum, w) => sum + w.transactions.length, 0),
      averageBalance: 0,
      highestBalance: 0,
      lowestBalance: 0,
      mostUsedWallet: null as any,
    };

    if (statistics.totalWallets > 0) {
      statistics.averageBalance = statistics.totalBalance / statistics.totalWallets;
      statistics.highestBalance = Math.max(...wallets.map(w => w.currentBalance));
      statistics.lowestBalance = Math.min(...wallets.map(w => w.currentBalance));
      
      // Carteira mais usada (com mais transações no mês)
      const walletUsage = wallets.map(w => ({
        wallet: w,
        transactionsCount: w.transactions.length,
      }));
      
      const mostUsed = walletUsage.reduce((prev, current) => 
        prev.transactionsCount > current.transactionsCount ? prev : current
      );
      
      statistics.mostUsedWallet = mostUsed.wallet;
    }

    return statistics;
  }

  async getBalanceHistory(id: number, userId: number, days: number = 30) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        walletId: id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Calcular saldo histórico
    let currentBalance = wallet.initialBalance;
    const history: Array<{ date: Date; balance: number }> = [];

    // Adicionar ponto inicial
    history.push({
      date: startDate,
      balance: currentBalance,
    });

    // Processar transações
    for (const transaction of transactions) {
      if (transaction.type === 'INCOME') {
        currentBalance += transaction.amount;
      } else {
        currentBalance -= transaction.amount;
      }

      history.push({
        date: transaction.date,
        balance: currentBalance,
      });
    }

    return {
      walletId: id,
      walletName: wallet.name,
      period: `${days} dias`,
      history,
    };
  }
}
