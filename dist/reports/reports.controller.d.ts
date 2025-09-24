import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(req: any, startDate?: string, endDate?: string): Promise<{
        summary: {
            totalBalance: number;
            totalIncome: number;
            totalExpense: number;
            groupsCount: number;
            paymentMethodsCount: number;
            categoriesCount: number;
        };
        topCategories: never[];
        recentTransactions: ({
            paymentMethod: {
                walletGroup: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    type: import("@prisma/client").$Enums.WalletGroupType;
                    description: string | null;
                    color: string;
                    icon: string;
                    userId: number;
                    isActive: boolean;
                    hasIntegratedPix: boolean;
                    hasWalletBalance: boolean;
                } | null;
            } & {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
                icon: string;
                userId: number;
                currentBalance: number;
                creditLimit: number | null;
                closingDay: number | null;
                dueDay: number | null;
                availableLimit: number | null;
                accountNumber: string | null;
                agency: string | null;
                bankCode: string | null;
                isActive: boolean;
                isPrimary: boolean;
                walletGroupId: number | null;
            };
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.CategoryType;
                description: string | null;
                color: string;
                icon: string;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
                userId: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            date: Date;
            amount: number;
            paymentMethodId: number;
            categoryId: number;
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
    getCategoriesReport(req: any, startDate?: string, endDate?: string, type?: 'INCOME' | 'EXPENSE'): Promise<{
        categories: never[];
        summary: {
            totalAmount: number;
            categoriesCount: number;
            transactionsCount: number;
        };
    }>;
    getTimeAnalysis(req: any, startDate?: string, endDate?: string, period?: 'daily' | 'weekly' | 'monthly'): Promise<{
        periods: never[];
        summary: {
            totalIncome: number;
            totalExpense: number;
            totalNet: number;
            totalTransactions: number;
            periodsCount: number;
        };
    }>;
    getInstallmentsReport(req: any, startDate?: string, endDate?: string, status?: 'ACTIVE' | 'COMPLETED' | 'OVERDUE'): Promise<{
        installments: {
            id: number;
            description: string;
            totalAmount: number;
            installmentCount: number;
            currentInstallment: number;
            isActive: boolean;
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.CategoryType;
                description: string | null;
                color: string;
                icon: string;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
                userId: number;
            };
            paymentMethod: {
                walletGroup: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    type: import("@prisma/client").$Enums.WalletGroupType;
                    description: string | null;
                    color: string;
                    icon: string;
                    userId: number;
                    isActive: boolean;
                    hasIntegratedPix: boolean;
                    hasWalletBalance: boolean;
                } | null;
            } & {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
                icon: string;
                userId: number;
                currentBalance: number;
                creditLimit: number | null;
                closingDay: number | null;
                dueDay: number | null;
                availableLimit: number | null;
                accountNumber: string | null;
                agency: string | null;
                bankCode: string | null;
                isActive: boolean;
                isPrimary: boolean;
                walletGroupId: number | null;
            };
            createdAt: Date;
        }[];
        summary: {
            totalInstallments: number;
            activeInstallments: number;
            completedInstallments: number;
            totalAmount: number;
        };
    }>;
}
