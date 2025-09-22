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
exports.InstallmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_installment_transaction_dto_1 = require("./dto/create-installment-transaction.dto");
let InstallmentsService = class InstallmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInstallmentTransaction(userId, createInstallmentDto) {
        const { categoryId, walletId, creditCardId, totalAmount, installmentCount, installmentType, startDate, dueDay, ...transactionData } = createInstallmentDto;
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
        if (installmentType === create_installment_transaction_dto_1.InstallmentType.CREDIT_CARD && creditCardId) {
            const creditCard = await this.prisma.creditCard.findFirst({
                where: {
                    id: creditCardId,
                    userId: userId,
                },
            });
            if (!creditCard) {
                throw new common_1.NotFoundException('Cartão de crédito não encontrado');
            }
        }
        const installmentAmount = Math.round((totalAmount / installmentCount) * 100) / 100;
        const lastInstallmentAmount = totalAmount - (installmentAmount * (installmentCount - 1));
        const baseDate = startDate ? new Date(startDate) : new Date();
        if (!startDate) {
            baseDate.setMonth(baseDate.getMonth() + 1);
            baseDate.setDate(1);
        }
        return this.prisma.$transaction(async (prisma) => {
            const installment = await prisma.installment.create({
                data: {
                    description: transactionData.description,
                    totalAmount,
                    installmentCount,
                    currentInstallment: 0,
                    categoryId,
                    startDate: baseDate,
                    ...(creditCardId && { creditCardId }),
                },
            });
            const transactions = [];
            for (let i = 1; i <= installmentCount; i++) {
                const installmentDate = new Date(baseDate);
                installmentDate.setMonth(baseDate.getMonth() + (i - 1));
                if (installmentType === create_installment_transaction_dto_1.InstallmentType.CREDIT_CARD && dueDay) {
                    installmentDate.setDate(dueDay);
                }
                const amount = i === installmentCount ? lastInstallmentAmount : installmentAmount;
                if (installmentType === create_installment_transaction_dto_1.InstallmentType.CREDIT_CARD && creditCardId) {
                    const cardTransaction = await prisma.cardTransaction.create({
                        data: {
                            description: `${transactionData.description} (${i}/${installmentCount})`,
                            amount,
                            date: installmentDate,
                            creditCardId,
                            categoryId,
                            installmentId: installment.id,
                        },
                    });
                    transactions.push(cardTransaction);
                }
                else {
                    const transaction = await prisma.transaction.create({
                        data: {
                            description: `${transactionData.description} (${i}/${installmentCount})`,
                            amount,
                            date: installmentDate,
                            type: 'EXPENSE',
                            userId,
                            categoryId,
                            walletId,
                        },
                    });
                    if (i === 1 && installmentType === create_installment_transaction_dto_1.InstallmentType.FIXED) {
                        await prisma.wallet.update({
                            where: { id: walletId },
                            data: {
                                currentBalance: {
                                    decrement: amount,
                                },
                            },
                        });
                    }
                    transactions.push(transaction);
                }
            }
            return {
                installment: await prisma.installment.findUnique({
                    where: { id: installment.id },
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
                        creditCard: creditCardId ? {
                            select: {
                                id: true,
                                name: true,
                                limit: true,
                                closingDay: true,
                                dueDay: true,
                            },
                        } : false,
                        transactions: installmentType !== create_installment_transaction_dto_1.InstallmentType.CREDIT_CARD,
                    },
                }),
                transactions,
                summary: {
                    totalAmount,
                    installmentCount,
                    installmentAmount,
                    lastInstallmentAmount,
                    installmentType,
                },
            };
        });
    }
    async findAllInstallments(userId, filters) {
        const where = {};
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        else {
            where.category = {
                userId: userId,
            };
        }
        if (filters?.creditCardId) {
            where.creditCardId = filters.creditCardId;
        }
        const installments = await this.prisma.installment.findMany({
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
                creditCard: {
                    select: {
                        id: true,
                        name: true,
                        limit: true,
                        closingDay: true,
                        dueDay: true,
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        description: true,
                        amount: true,
                        date: true,
                    },
                    orderBy: {
                        date: 'asc',
                    },
                },
            },
            orderBy: {
                startDate: 'desc',
            },
            take: filters?.limit,
            skip: filters?.offset,
        });
        return installments.map(installment => {
            const now = new Date();
            const paidTransactions = installment.transactions.filter(t => t.date <= now);
            const remainingTransactions = installment.transactions.filter(t => t.date > now);
            const status = remainingTransactions.length === 0 ? 'COMPLETED' : 'ACTIVE';
            const progress = (paidTransactions.length / installment.installmentCount) * 100;
            const nextPaymentDate = remainingTransactions.length > 0 ? remainingTransactions[0].date : null;
            const nextPaymentAmount = remainingTransactions.length > 0 ? remainingTransactions[0].amount : null;
            return {
                ...installment,
                status,
                progress: Math.round(progress),
                paidInstallments: paidTransactions.length,
                remainingInstallments: remainingTransactions.length,
                nextPaymentDate,
                nextPaymentAmount,
                totalPaid: paidTransactions.reduce((sum, t) => sum + t.amount, 0),
                totalRemaining: remainingTransactions.reduce((sum, t) => sum + t.amount, 0),
            };
        });
    }
    async findOneInstallment(userId, id) {
        const installment = await this.prisma.installment.findFirst({
            where: {
                id,
                category: {
                    userId: userId,
                },
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
                creditCard: {
                    select: {
                        id: true,
                        name: true,
                        limit: true,
                        closingDay: true,
                        dueDay: true,
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        description: true,
                        amount: true,
                        date: true,
                    },
                    orderBy: {
                        date: 'asc',
                    },
                },
            },
        });
        if (!installment) {
            throw new common_1.NotFoundException('Parcela não encontrada');
        }
        const now = new Date();
        const paidTransactions = installment.transactions.filter(t => t.date <= now);
        const remainingTransactions = installment.transactions.filter(t => t.date > now);
        const status = remainingTransactions.length === 0 ? 'COMPLETED' : 'ACTIVE';
        const progress = (paidTransactions.length / installment.installmentCount) * 100;
        return {
            ...installment,
            status,
            progress: Math.round(progress),
            paidInstallments: paidTransactions.length,
            remainingInstallments: remainingTransactions.length,
            totalPaid: paidTransactions.reduce((sum, t) => sum + t.amount, 0),
            totalRemaining: remainingTransactions.reduce((sum, t) => sum + t.amount, 0),
        };
    }
    async cancelInstallment(userId, id) {
        const installment = await this.findOneInstallment(userId, id);
        if (installment.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Não é possível cancelar uma parcela já concluída');
        }
        return this.prisma.$transaction(async (prisma) => {
            const futureTransactions = installment.transactions.filter(t => t.date > new Date());
            for (const transaction of futureTransactions) {
                await prisma.transaction.delete({
                    where: { id: transaction.id },
                });
            }
            await prisma.installment.update({
                where: { id },
                data: {
                    currentInstallment: installment.paidInstallments,
                    installmentCount: installment.paidInstallments,
                },
            });
            return { message: 'Parcela cancelada com sucesso' };
        });
    }
    async getInstallmentStatistics(userId, filters) {
        const where = {
            category: {
                userId: userId,
            },
        };
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.startDate = {};
            if (filters.startDate) {
                where.startDate.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.startDate.lte = new Date(filters.endDate);
            }
        }
        const [totalInstallments, activeInstallments, completedInstallments, totalAmount] = await Promise.all([
            this.prisma.installment.count({ where }),
            this.prisma.installment.count({
                where: {
                    ...where,
                    transactions: {
                        some: {
                            date: {
                                gt: new Date(),
                            },
                        },
                    },
                },
            }),
            this.prisma.installment.count({
                where: {
                    ...where,
                    transactions: {
                        none: {
                            date: {
                                gt: new Date(),
                            },
                        },
                    },
                },
            }),
            this.prisma.installment.aggregate({
                where,
                _sum: { totalAmount: true },
            }),
        ]);
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        const upcomingPayments = await this.prisma.transaction.findMany({
            where: {
                date: {
                    gte: new Date(),
                    lte: nextMonth,
                },
                userId: userId,
                description: {
                    contains: '/',
                },
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
            take: 10,
        });
        return {
            totalInstallments,
            activeInstallments,
            completedInstallments,
            totalAmount: totalAmount._sum.totalAmount || 0,
            upcomingPayments,
        };
    }
};
exports.InstallmentsService = InstallmentsService;
exports.InstallmentsService = InstallmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstallmentsService);
//# sourceMappingURL=installments.service.js.map