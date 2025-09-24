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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardData(userId, startDate, endDate) {
        const paymentMethods = await this.prisma.paymentMethod.findMany({
            where: {
                OR: [
                    { walletGroup: { userId } },
                    { AND: [{ walletGroupId: null }, { userId }] }
                ]
            },
            select: { currentBalance: true, creditLimit: true },
        });
        const totalBalance = paymentMethods.reduce((sum, method) => sum + method.currentBalance, 0);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: startDate, lte: endDate },
            },
            include: {
                category: true,
                paymentMethod: {
                    include: {
                        walletGroup: true,
                    },
                },
            },
        });
        const totalIncome = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = Math.abs(transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0));
        const [groupsCount, paymentMethodsCount, categoriesCount] = await Promise.all([
            this.prisma.walletGroup.count({ where: { userId } }),
            this.prisma.paymentMethod.count({
                where: {
                    OR: [
                        { walletGroup: { userId } },
                        { AND: [{ walletGroupId: null }, { userId }] }
                    ]
                }
            }),
            this.prisma.category.count({ where: { userId } }),
        ]);
        return {
            summary: {
                totalBalance,
                totalIncome,
                totalExpense,
                groupsCount,
                paymentMethodsCount,
                categoriesCount,
            },
            topCategories: [],
            recentTransactions: transactions.slice(0, 10),
        };
    }
    async getCategoriesReport(userId, startDate, endDate, type) {
        const whereClause = {
            userId,
            date: { gte: startDate, lte: endDate },
        };
        if (type && type !== 'ALL') {
            whereClause.type = type;
        }
        const transactions = await this.prisma.transaction.findMany({
            where: whereClause,
            include: {
                category: true,
                paymentMethod: {
                    include: {
                        walletGroup: true,
                    },
                },
            },
        });
        return {
            categories: [],
            summary: {
                totalAmount: 0,
                categoriesCount: 0,
                transactionsCount: transactions.length,
            },
        };
    }
    async getTimeAnalysis(userId, startDate, endDate, period = 'daily') {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: startDate, lte: endDate },
            },
            include: {
                category: true,
                paymentMethod: {
                    include: {
                        walletGroup: true,
                    },
                },
            },
            orderBy: { date: 'asc' },
        });
        return {
            periods: [],
            summary: {
                totalIncome: 0,
                totalExpense: 0,
                totalNet: 0,
                totalTransactions: transactions.length,
                periodsCount: 0,
            },
        };
    }
    async getInstallmentsReport(userId, status) {
        const whereClause = { userId };
        if (status) {
            switch (status) {
                case 'active':
                    whereClause.isActive = true;
                    break;
                case 'completed':
                    whereClause.isActive = false;
                    break;
            }
        }
        const installments = await this.prisma.installment.findMany({
            where: whereClause,
            include: {
                category: true,
                paymentMethod: {
                    include: {
                        walletGroup: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            installments: installments.map(installment => ({
                id: installment.id,
                description: installment.description,
                totalAmount: installment.totalAmount,
                installmentCount: installment.installmentCount,
                currentInstallment: installment.currentInstallment,
                isActive: installment.isActive,
                category: installment.category,
                paymentMethod: installment.paymentMethod,
                createdAt: installment.createdAt,
            })),
            summary: {
                totalInstallments: installments.length,
                activeInstallments: installments.filter(i => i.isActive).length,
                completedInstallments: installments.filter(i => !i.isActive).length,
                totalAmount: installments.reduce((sum, i) => sum + i.totalAmount, 0),
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map