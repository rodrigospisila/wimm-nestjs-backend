import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(req: any, startDate?: string, endDate?: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalIncome: number;
            totalExpense: number;
            balance: number;
            transactionCount: number;
        };
        topCategories: {
            categoryId: number;
            name: string;
            color: string;
            icon: string;
            type: import("@prisma/client").$Enums.CategoryType;
            amount: number;
            transactionCount: number;
        }[];
        recentTransactions: ({
            paymentMethod: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
            };
            category: {
                name: string;
                id: number;
                color: string;
                icon: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            amount: number;
            date: Date;
            subcategoryId: number | null;
            creditCardBillId: number | null;
            installmentId: number | null;
            installmentNumber: number | null;
            transferToMethodId: number | null;
            notes: string | null;
            tags: string | null;
            isRecurring: boolean;
        })[];
        paymentMethodsUsage: {
            paymentMethodId: number;
            name: string;
            type: string;
            color: string;
            amount: number;
            transactionCount: number;
        }[];
    }>;
    getOverview(req: any): Promise<{
        totalBalance: number;
        monthlyIncome: number;
        monthlyExpense: number;
        monthlyBalance: number;
        activeWallets: number;
        activeInstallments: number;
        categoriesCount: number;
    }>;
    getCategoryReport(req: any, startDate?: string, endDate?: string, type?: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        categories: {
            categoryId: number;
            name: string;
            color: string;
            icon: string;
            type: import("@prisma/client").$Enums.CategoryType;
            parentCategory: {
                name: string;
                id: number;
                color: string;
                icon: string;
            } | null | undefined;
            amount: number;
            transactionCount: number;
            percentage: number;
        }[];
        total: number;
    }>;
    getTimeAnalysis(req: any, period?: string, type?: string): Promise<{
        period: string;
        data: any[];
    }>;
    getInstallmentReport(req: any): Promise<{
        summary: {
            activeCount: number;
            totalActiveAmount: number;
            upcomingPaymentsCount: number;
            upcomingPaymentsAmount: number;
            completedCount: number;
        };
        activeInstallments: ({
            paymentMethod: {
                walletGroup: {
                    name: string;
                    id: number;
                    color: string;
                    icon: string;
                } | null;
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
            };
            category: {
                name: string;
                id: number;
                color: string;
                icon: string;
            };
            transactions: {
                id: number;
                amount: number;
                date: Date;
                installmentNumber: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            totalAmount: number;
            startDate: Date;
            installmentCount: number;
            currentInstallment: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
        })[];
        upcomingPayments: ({
            paymentMethod: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
            };
            category: {
                name: string;
                id: number;
                color: string;
                icon: string;
            };
            installment: {
                id: number;
                description: string;
                installmentCount: number;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            amount: number;
            date: Date;
            subcategoryId: number | null;
            creditCardBillId: number | null;
            installmentId: number | null;
            installmentNumber: number | null;
            transferToMethodId: number | null;
            notes: string | null;
            tags: string | null;
            isRecurring: boolean;
        })[];
    }>;
    getPaymentMethodReport(req: any, startDate?: string, endDate?: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        paymentMethods: {
            paymentMethodId: number;
            name: string;
            type: string;
            color: string;
            currentBalance: number;
            walletGroup: {
                name: string;
                id: number;
                color: string;
                icon: string;
            } | null | undefined;
            amount: number;
            transactionCount: number;
        }[];
    }>;
    getBalanceEvolution(req: any, months?: string): Promise<{
        months: number;
        data: any[];
    }>;
    getMonthlySummary(req: any, year?: string, month?: string): Promise<{
        period: {
            year: number;
            month: number;
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalIncome: number;
            totalExpense: number;
            balance: number;
            transactionCount: number;
        };
        categorySummary: {
            categoryId: number;
            name: string;
            color: string;
            icon: string;
            type: import("@prisma/client").$Enums.CategoryType;
            amount: number;
            transactionCount: number;
        }[];
        paymentMethodSummary: {
            paymentMethodId: number;
            name: string;
            type: string;
            color: string;
            amount: number;
            transactionCount: number;
        }[];
        dailyData: any[];
    }>;
}
