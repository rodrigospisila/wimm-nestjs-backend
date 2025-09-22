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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTransactionDto) {
        const { categoryId, walletId, amount, type, date, ...transactionData } = createTransactionDto;
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: userId,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoria não encontrada');
        }
        const wallet = await this.prisma.wallet.findFirst({
            where: {
                id: walletId,
                userId: userId,
            },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Carteira não encontrada');
        }
        if (category.type !== type) {
            throw new common_1.BadRequestException(`Tipo de transação (${type}) não é compatível com o tipo da categoria (${category.type})`);
        }
        const transactionDate = date ? new Date(date) : new Date();
        return this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.create({
                data: {
                    ...transactionData,
                    amount,
                    type,
                    date: transactionDate,
                    userId,
                    categoryId,
                    walletId,
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
                    wallet: {
                        select: {
                            id: true,
                            name: true,
                            color: true,
                            icon: true,
                        },
                    },
                },
            });
            const balanceChange = type === 'INCOME' ? amount : -amount;
            await prisma.wallet.update({
                where: { id: walletId },
                data: {
                    currentBalance: {
                        increment: balanceChange,
                    },
                },
            });
            return transaction;
        });
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.type && filters.type !== 'ALL') {
            where.type = filters.type;
        }
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.walletId) {
            where.walletId = filters.walletId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate) {
                where.date.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.date.lte = new Date(filters.endDate);
            }
        }
        const transactions = await this.prisma.transaction.findMany({
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
                wallet: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
            take: filters?.limit,
            skip: filters?.offset,
        });
        return transactions;
    }
    async findOne(userId, id) {
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                userId,
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
                wallet: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transação não encontrada');
        }
        return transaction;
    }
    async update(userId, id, updateTransactionDto) {
        const existingTransaction = await this.findOne(userId, id);
        const { categoryId, walletId, amount, type, date, ...transactionData } = updateTransactionDto;
        if (categoryId && categoryId !== existingTransaction.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: categoryId,
                    userId: userId,
                },
            });
            if (!category) {
                throw new common_1.NotFoundException('Categoria não encontrada');
            }
            const newType = type || existingTransaction.type;
            if (category.type !== newType) {
                throw new common_1.BadRequestException(`Tipo de transação (${newType}) não é compatível com o tipo da categoria (${category.type})`);
            }
        }
        if (walletId && walletId !== existingTransaction.walletId) {
            const wallet = await this.prisma.wallet.findFirst({
                where: {
                    id: walletId,
                    userId: userId,
                },
            });
            if (!wallet) {
                throw new common_1.NotFoundException('Carteira não encontrada');
            }
        }
        return this.prisma.$transaction(async (prisma) => {
            const originalBalanceChange = existingTransaction.type === 'INCOME'
                ? -existingTransaction.amount
                : existingTransaction.amount;
            await prisma.wallet.update({
                where: { id: existingTransaction.walletId },
                data: {
                    currentBalance: {
                        increment: originalBalanceChange,
                    },
                },
            });
            const updatedTransaction = await prisma.transaction.update({
                where: { id },
                data: {
                    ...transactionData,
                    ...(amount !== undefined && { amount }),
                    ...(type !== undefined && { type }),
                    ...(date !== undefined && { date: new Date(date) }),
                    ...(categoryId !== undefined && { categoryId }),
                    ...(walletId !== undefined && { walletId }),
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
                    wallet: {
                        select: {
                            id: true,
                            name: true,
                            color: true,
                            icon: true,
                        },
                    },
                },
            });
            const newAmount = amount !== undefined ? amount : existingTransaction.amount;
            const newType = type !== undefined ? type : existingTransaction.type;
            const newWalletId = walletId !== undefined ? walletId : existingTransaction.walletId;
            const newBalanceChange = newType === 'INCOME' ? newAmount : -newAmount;
            await prisma.wallet.update({
                where: { id: newWalletId },
                data: {
                    currentBalance: {
                        increment: newBalanceChange,
                    },
                },
            });
            return updatedTransaction;
        });
    }
    async remove(userId, id) {
        const transaction = await this.findOne(userId, id);
        return this.prisma.$transaction(async (prisma) => {
            const balanceChange = transaction.type === 'INCOME'
                ? -transaction.amount
                : transaction.amount;
            await prisma.wallet.update({
                where: { id: transaction.walletId },
                data: {
                    currentBalance: {
                        increment: balanceChange,
                    },
                },
            });
            await prisma.transaction.delete({
                where: { id },
            });
            return { message: 'Transação removida com sucesso' };
        });
    }
    async getStatistics(userId, filters) {
        const where = { userId };
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.walletId) {
            where.walletId = filters.walletId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate) {
                where.date.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.date.lte = new Date(filters.endDate);
            }
        }
        const [totalIncome, totalExpense, transactionCount, avgTransaction] = await Promise.all([
            this.prisma.transaction.aggregate({
                where: { ...where, type: 'INCOME' },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { ...where, type: 'EXPENSE' },
                _sum: { amount: true },
            }),
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.aggregate({
                where,
                _avg: { amount: true },
            }),
        ]);
        const income = totalIncome._sum.amount || 0;
        const expense = totalExpense._sum.amount || 0;
        const balance = income - expense;
        return {
            totalIncome: income,
            totalExpense: expense,
            balance,
            transactionCount,
            averageTransaction: avgTransaction._avg.amount || 0,
        };
    }
    async getMonthlyReport(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        const transactions = await this.findAll(userId, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        const statistics = await this.getStatistics(userId, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        const byCategory = transactions.reduce((acc, transaction) => {
            const categoryName = transaction.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = {
                    categoryId: transaction.category.id,
                    categoryName,
                    categoryColor: transaction.category.color,
                    totalAmount: 0,
                    transactionCount: 0,
                    type: transaction.category.type,
                };
            }
            acc[categoryName].totalAmount += transaction.amount;
            acc[categoryName].transactionCount += 1;
            return acc;
        }, {});
        const byWallet = transactions.reduce((acc, transaction) => {
            const walletName = transaction.wallet.name;
            if (!acc[walletName]) {
                acc[walletName] = {
                    walletId: transaction.wallet.id,
                    walletName,
                    walletColor: transaction.wallet.color,
                    totalAmount: 0,
                    transactionCount: 0,
                };
            }
            const amount = transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
            acc[walletName].totalAmount += amount;
            acc[walletName].transactionCount += 1;
            return acc;
        }, {});
        return {
            period: `${year}-${month.toString().padStart(2, '0')}`,
            statistics,
            transactions,
            byCategory: Object.values(byCategory),
            byWallet: Object.values(byWallet),
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map