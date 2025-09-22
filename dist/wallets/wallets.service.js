"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WalletsService = class WalletsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createWalletDto) {
        const { name, initialBalance, type, description, color, icon } = createWalletDto;
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
            throw new common_1.BadRequestException('Já existe uma carteira com este nome');
        }
        const wallet = await this.prisma.wallet.create({
            data: {
                name,
                initialBalance: initialBalance || 0,
                currentBalance: initialBalance || 0,
                type: type || client_1.WalletType.CHECKING_ACCOUNT,
                description,
                color: color || '#4CAF50',
                icon: icon || 'wallet',
                isActive: true,
                userId,
            },
        });
        return wallet;
    }
    async findAll(userId, type) {
        const where = { userId, isActive: true };
        if (type && type !== 'ALL') {
            where.type = type;
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Carteira não encontrada');
        }
        return {
            ...wallet,
            transactionsCount: wallet._count.transactions,
        };
    }
    async update(id, userId, updateWalletDto) {
        const existingWallet = await this.prisma.wallet.findFirst({
            where: { id, userId },
        });
        if (!existingWallet) {
            throw new common_1.NotFoundException('Carteira não encontrada');
        }
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
                throw new common_1.BadRequestException('Já existe uma carteira com este nome');
            }
        }
        const wallet = await this.prisma.wallet.update({
            where: { id },
            data: updateWalletDto,
        });
        return wallet;
    }
    async toggleActive(id, userId) {
        const existingWallet = await this.prisma.wallet.findFirst({
            where: { id, userId },
        });
        if (!existingWallet) {
            throw new common_1.NotFoundException('Carteira não encontrada');
        }
        const wallet = await this.prisma.wallet.update({
            where: { id },
            data: { isActive: !existingWallet.isActive },
        });
        return wallet;
    }
    async remove(id, userId) {
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
            throw new common_1.NotFoundException('Carteira não encontrada');
        }
        if (existingWallet._count.transactions > 0) {
            throw new common_1.BadRequestException('Não é possível excluir uma carteira que possui transações. Desative-a em vez de excluir.');
        }
        await this.prisma.wallet.delete({
            where: { id },
        });
        return { message: 'Carteira removida com sucesso' };
    }
    async getSummary(userId) {
        const wallets = await this.prisma.wallet.findMany({
            where: { userId, isActive: true },
        });
        const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.currentBalance, 0);
        const walletsCount = wallets.length;
        const walletsByType = wallets.reduce((acc, wallet) => {
            const type = wallet.type;
            if (!acc[type]) {
                acc[type] = { count: 0, balance: 0 };
            }
            acc[type].count++;
            acc[type].balance += wallet.currentBalance;
            return acc;
        }, {});
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
    async getStatistics(userId) {
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
            mostUsedWallet: null,
        };
        if (statistics.totalWallets > 0) {
            statistics.averageBalance = statistics.totalBalance / statistics.totalWallets;
            statistics.highestBalance = Math.max(...wallets.map(w => w.currentBalance));
            statistics.lowestBalance = Math.min(...wallets.map(w => w.currentBalance));
            const walletUsage = wallets.map(w => ({
                wallet: w,
                transactionsCount: w.transactions.length,
            }));
            const mostUsed = walletUsage.reduce((prev, current) => prev.transactionsCount > current.transactionsCount ? prev : current);
            statistics.mostUsedWallet = mostUsed.wallet;
        }
        return statistics;
    }
    async getBalanceHistory(id, userId, days = 30) {
        const wallet = await this.prisma.wallet.findFirst({
            where: { id, userId },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Carteira não encontrada');
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
        let currentBalance = wallet.initialBalance;
        const history = [];
        history.push({
            date: startDate,
            balance: currentBalance,
        });
        for (const transaction of transactions) {
            if (transaction.type === 'INCOME') {
                currentBalance += transaction.amount;
            }
            else {
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
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map