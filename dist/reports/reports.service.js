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
        const wallets = await this.prisma.wallet.findMany({
            where: { userId, isActive: true },
            select: { currentBalance: true },
        });
        const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.currentBalance, 0);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                category: {
                    select: { name: true, color: true, icon: true },
                },
            },
        });
        const monthlyIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const monthlyBalance = monthlyIncome - monthlyExpenses;
        const walletsCount = wallets.length;
        const transactionsCount = transactions.length;
        const categoriesCount = await this.prisma.category.count({
            where: { userId },
        });
        const pendingInstallments = await this.prisma.installment.count({
            where: {
                category: {
                    userId,
                },
                isActive: true,
            },
        });
        const categoryStats = await this.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                type: 'EXPENSE',
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                amount: true,
            },
            _count: {
                id: true,
            },
        });
        const totalExpenseAmount = categoryStats.reduce((sum, stat) => sum + Math.abs(stat._sum.amount || 0), 0);
        const topCategoriesData = (await Promise.all(categoryStats
            .sort((a, b) => Math.abs(b._sum.amount || 0) - Math.abs(a._sum.amount || 0))
            .slice(0, 5)
            .map(async (stat) => {
            const category = await this.prisma.category.findUnique({
                where: { id: stat.categoryId },
                select: { id: true, name: true, color: true, icon: true },
            });
            if (!category)
                return null;
            const amount = Math.abs(stat._sum.amount || 0);
            const percentage = totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0;
            return {
                id: category.id,
                name: category.name,
                amount,
                percentage,
                color: category.color,
                icon: category.icon,
            };
        }))).filter(Boolean);
        const recentTransactions = await this.prisma.transaction.findMany({
            where: { userId },
            include: {
                category: {
                    select: { name: true, color: true, icon: true },
                },
            },
            orderBy: { date: 'desc' },
            take: 10,
        });
        return {
            totalBalance,
            monthlyIncome,
            monthlyExpenses,
            monthlyBalance,
            walletsCount,
            transactionsCount,
            categoriesCount,
            pendingInstallments,
            topCategories: topCategoriesData,
            recentTransactions: recentTransactions.map(t => ({
                id: t.id,
                description: t.description,
                amount: t.amount,
                type: t.type,
                date: t.date.toISOString(),
                category: {
                    name: t.category.name,
                    color: t.category.color,
                    icon: t.category.icon,
                },
            })),
        };
    }
    async getCategoriesReport(userId, startDate, endDate, type) {
        const whereClause = {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (type) {
            whereClause.type = type;
        }
        const categories = await this.prisma.category.findMany({
            where: {
                userId,
                ...(type && { type }),
            },
            include: {
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
                _count: {
                    select: {
                        transactions: {
                            where: {
                                date: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                        },
                    },
                },
            },
        });
        const categoriesWithStats = await Promise.all(categories.map(async (category) => {
            const categoryTransactions = await this.prisma.transaction.findMany({
                where: {
                    ...whereClause,
                    categoryId: category.id,
                },
            });
            const totalAmount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const transactionCount = categoryTransactions.length;
            const averageTransaction = transactionCount > 0 ? totalAmount / transactionCount : 0;
            const subCategoriesWithStats = await Promise.all(category.subCategories.map(async (subCategory) => {
                const subTransactions = await this.prisma.transaction.findMany({
                    where: {
                        ...whereClause,
                        categoryId: subCategory.id,
                    },
                });
                const subTotalAmount = subTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                const subTransactionCount = subTransactions.length;
                return {
                    id: subCategory.id,
                    name: subCategory.name,
                    color: subCategory.color,
                    icon: subCategory.icon,
                    totalAmount: subTotalAmount,
                    transactionCount: subTransactionCount,
                    percentage: totalAmount > 0 ? (subTotalAmount / totalAmount) * 100 : 0,
                };
            }));
            return {
                id: category.id,
                name: category.name,
                type: category.type,
                color: category.color,
                icon: category.icon,
                totalAmount,
                transactionCount,
                averageTransaction,
                percentage: 0,
                subCategories: subCategoriesWithStats,
            };
        }));
        const totalAmount = categoriesWithStats.reduce((sum, cat) => sum + cat.totalAmount, 0);
        const categoriesWithPercentages = categoriesWithStats.map(category => ({
            ...category,
            percentage: totalAmount > 0 ? (category.totalAmount / totalAmount) * 100 : 0,
        }));
        return categoriesWithPercentages
            .filter(cat => cat.totalAmount > 0)
            .sort((a, b) => b.totalAmount - a.totalAmount);
    }
    async getTimeAnalysis(userId, startDate, endDate, period) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const groupedData = new Map();
        transactions.forEach(transaction => {
            let periodKey;
            const transactionDate = new Date(transaction.date);
            switch (period) {
                case 'daily':
                    periodKey = transactionDate.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    const weekStart = new Date(transactionDate);
                    weekStart.setDate(transactionDate.getDate() - transactionDate.getDay());
                    periodKey = weekStart.toISOString().split('T')[0];
                    break;
                case 'monthly':
                    periodKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
                    break;
            }
            if (!groupedData.has(periodKey)) {
                groupedData.set(periodKey, {
                    period: periodKey,
                    income: 0,
                    expenses: 0,
                    balance: 0,
                    transactionCount: 0,
                    date: transactionDate.toISOString(),
                });
            }
            const group = groupedData.get(periodKey);
            group.transactionCount++;
            if (transaction.type === 'INCOME') {
                group.income += transaction.amount;
            }
            else {
                group.expenses += Math.abs(transaction.amount);
            }
            group.balance = group.income - group.expenses;
        });
        const periods = Array.from(groupedData.values()).sort((a, b) => a.date.localeCompare(b.date));
        const totalIncome = periods.reduce((sum, p) => sum + p.income, 0);
        const totalExpenses = periods.reduce((sum, p) => sum + p.expenses, 0);
        const totalBalance = totalIncome - totalExpenses;
        const averageDaily = periods.length > 0 ? totalBalance / periods.length : 0;
        const bestDay = periods.reduce((best, current) => current.balance > (best?.balance || -Infinity) ? current : best, null);
        const worstDay = periods.reduce((worst, current) => current.balance < (worst?.balance || Infinity) ? current : worst, null);
        return {
            periods,
            summary: {
                totalIncome,
                totalExpenses,
                totalBalance,
                averageDaily,
                bestDay,
                worstDay,
            },
        };
    }
    async getInstallmentsReport(userId, startDate, endDate, status) {
        const installments = await this.prisma.installment.findMany({
            where: {
                category: {
                    userId,
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate,
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
                creditCard: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                transactions: {
                    orderBy: { date: 'asc' },
                },
            },
        });
        const processedInstallments = installments.map(installment => {
            const paidInstallments = installment.currentInstallment;
            const remainingInstallments = installment.installmentCount - paidInstallments;
            let currentStatus;
            if (paidInstallments >= installment.installmentCount) {
                currentStatus = 'COMPLETED';
            }
            else if (installment.isActive) {
                currentStatus = 'ACTIVE';
            }
            else {
                currentStatus = 'OVERDUE';
            }
            const paidAmount = installment.transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const remainingAmount = installment.totalAmount - paidAmount;
            const nextDueDate = new Date(installment.startDate);
            nextDueDate.setMonth(nextDueDate.getMonth() + paidInstallments + 1);
            const installmentsList = Array.from({ length: installment.installmentCount }, (_, index) => {
                const installmentNumber = index + 1;
                const dueDate = new Date(installment.startDate);
                dueDate.setMonth(dueDate.getMonth() + index);
                const installmentAmount = installment.totalAmount / installment.installmentCount;
                let installmentStatus;
                if (installmentNumber <= paidInstallments) {
                    installmentStatus = 'PAID';
                }
                else if (installmentNumber === paidInstallments + 1 && !installment.isActive) {
                    installmentStatus = 'OVERDUE';
                }
                else {
                    installmentStatus = 'PENDING';
                }
                return {
                    id: installment.id * 1000 + installmentNumber,
                    installmentNumber,
                    amount: installmentAmount,
                    dueDate: dueDate.toISOString(),
                    status: installmentStatus,
                };
            });
            return {
                id: installment.id,
                description: installment.description,
                totalAmount: installment.totalAmount,
                installmentCount: installment.installmentCount,
                paidInstallments,
                remainingAmount,
                nextDueDate: currentStatus === 'ACTIVE' ? nextDueDate.toISOString() : null,
                status: currentStatus,
                installmentType: installment.installmentType,
                category: installment.category,
                wallet: installment.creditCard ? {
                    id: installment.creditCard.id,
                    name: installment.creditCard.name,
                    color: '#FF5722',
                    icon: 'card',
                } : null,
                installments: installmentsList,
            };
        });
        const filteredInstallments = status
            ? processedInstallments.filter(i => i.status === status)
            : processedInstallments;
        const totalActive = processedInstallments.filter(i => i.status === 'ACTIVE').length;
        const totalCompleted = processedInstallments.filter(i => i.status === 'COMPLETED').length;
        const totalOverdue = processedInstallments.filter(i => i.status === 'OVERDUE').length;
        const totalPendingAmount = processedInstallments.reduce((sum, i) => sum + i.remainingAmount, 0);
        const totalPaidAmount = processedInstallments.reduce((sum, i) => sum + (i.totalAmount - i.remainingAmount), 0);
        const nextPayments = processedInstallments
            .filter(i => i.nextDueDate && i.status === 'ACTIVE')
            .map(i => {
            const nextInstallment = i.installments.find(inst => inst.status === 'PENDING' || inst.status === 'OVERDUE');
            return {
                id: i.id,
                description: i.description,
                amount: nextInstallment?.amount || 0,
                dueDate: i.nextDueDate,
                installmentNumber: nextInstallment?.installmentNumber || 0,
                totalInstallments: i.installmentCount,
            };
        })
            .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())
            .slice(0, 10);
        return {
            installments: filteredInstallments,
            summary: {
                totalActive,
                totalCompleted,
                totalOverdue,
                totalPendingAmount,
                totalPaidAmount,
                nextPayments,
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