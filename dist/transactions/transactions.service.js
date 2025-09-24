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
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByUser(userId, filters = {}, pagination = { page: 1, limit: 50 }) {
        const where = { userId };
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
    async findOne(userId, id) {
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
            throw new common_1.NotFoundException('Transação não encontrada');
        }
        return transaction;
    }
    async create(userId, createTransactionDto) {
        const category = await this.prisma.category.findFirst({
            where: { id: createTransactionDto.categoryId, userId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoria não encontrada');
        }
        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: { id: createTransactionDto.paymentMethodId, userId },
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Método de pagamento não encontrado');
        }
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
        await this.updatePaymentMethodBalance(paymentMethod.id, createTransactionDto.amount);
        return transaction;
    }
    async update(userId, id, updateTransactionDto) {
        const existingTransaction = await this.findOne(userId, id);
        if (updateTransactionDto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: updateTransactionDto.categoryId, userId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Categoria não encontrada');
            }
        }
        if (updateTransactionDto.paymentMethodId) {
            const paymentMethod = await this.prisma.paymentMethod.findFirst({
                where: { id: updateTransactionDto.paymentMethodId, userId },
            });
            if (!paymentMethod) {
                throw new common_1.NotFoundException('Método de pagamento não encontrado');
            }
        }
        if (updateTransactionDto.amount !== undefined && updateTransactionDto.amount !== existingTransaction.amount) {
            const difference = updateTransactionDto.amount - existingTransaction.amount;
            await this.updatePaymentMethodBalance(existingTransaction.paymentMethodId, difference);
        }
        if (updateTransactionDto.paymentMethodId && updateTransactionDto.paymentMethodId !== existingTransaction.paymentMethodId) {
            await this.updatePaymentMethodBalance(existingTransaction.paymentMethodId, -existingTransaction.amount);
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
    async remove(userId, id) {
        const transaction = await this.findOne(userId, id);
        await this.updatePaymentMethodBalance(transaction.paymentMethodId, -transaction.amount);
        return this.prisma.transaction.delete({
            where: { id },
        });
    }
    async getSummary(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        const [totalIncome, totalExpense, transactionCount, topCategories,] = await Promise.all([
            this.prisma.transaction.aggregate({
                where: { ...where, type: client_1.TransactionType.INCOME },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { ...where, type: client_1.TransactionType.EXPENSE },
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
    async getRecent(userId, limit = 10) {
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
    async createTransfer(userId, transferData) {
        const [fromMethod, toMethod] = await Promise.all([
            this.prisma.paymentMethod.findFirst({
                where: { id: transferData.fromPaymentMethodId, userId },
            }),
            this.prisma.paymentMethod.findFirst({
                where: { id: transferData.toPaymentMethodId, userId },
            }),
        ]);
        if (!fromMethod) {
            throw new common_1.NotFoundException('Método de pagamento de origem não encontrado');
        }
        if (!toMethod) {
            throw new common_1.NotFoundException('Método de pagamento de destino não encontrado');
        }
        if (fromMethod.currentBalance < transferData.amount) {
            throw new common_1.BadRequestException('Saldo insuficiente no método de origem');
        }
        let transferCategory = await this.prisma.category.findFirst({
            where: { userId, name: 'Transferência' },
        });
        if (!transferCategory) {
            transferCategory = await this.prisma.category.create({
                data: {
                    name: 'Transferência',
                    type: client_1.TransactionType.EXPENSE,
                    color: '#6C5CE7',
                    icon: 'swap-horizontal',
                    userId,
                },
            });
        }
        const transferDate = transferData.date ? new Date(transferData.date) : new Date();
        const outTransaction = await this.prisma.transaction.create({
            data: {
                description: `${transferData.description} (Saída)`,
                amount: -Math.abs(transferData.amount),
                date: transferDate,
                type: client_1.TransactionType.EXPENSE,
                categoryId: transferCategory.id,
                paymentMethodId: transferData.fromPaymentMethodId,
                userId,
            },
        });
        const inTransaction = await this.prisma.transaction.create({
            data: {
                description: `${transferData.description} (Entrada)`,
                amount: Math.abs(transferData.amount),
                date: transferDate,
                type: client_1.TransactionType.INCOME,
                categoryId: transferCategory.id,
                paymentMethodId: transferData.toPaymentMethodId,
                userId,
            },
        });
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
    async updatePaymentMethodBalance(paymentMethodId, amount) {
        await this.prisma.paymentMethod.update({
            where: { id: paymentMethodId },
            data: {
                currentBalance: {
                    increment: amount,
                },
            },
        });
    }
    async getTopCategories(userId, startDate, endDate, limit = 5) {
        const where = { userId };
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map