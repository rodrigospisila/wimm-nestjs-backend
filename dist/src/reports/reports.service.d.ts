import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardData(userId: number, startDate: Date, endDate: Date): Promise<{
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
                    createdAt: Date;
                    id: number;
                    type: import("@prisma/client").$Enums.WalletGroupType;
                    name: string;
                    updatedAt: Date;
                    description: string | null;
                    color: string;
                    icon: string;
                    userId: number;
                    isActive: boolean;
                    hasIntegratedPix: boolean;
                    hasWalletBalance: boolean;
                } | null;
            } & {
                createdAt: Date;
                isPrimary: boolean;
                id: number;
                walletGroupId: number | null;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                name: string;
                updatedAt: Date;
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
            };
            category: {
                createdAt: Date;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                name: string;
                updatedAt: Date;
                description: string | null;
                color: string;
                icon: string;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
                userId: number;
            };
        } & {
            createdAt: Date;
            id: number;
            type: import("@prisma/client").$Enums.TransactionType;
            amount: number;
            updatedAt: Date;
            description: string;
            userId: number;
            date: Date;
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
    getCategoriesReport(userId: number, startDate: Date, endDate: Date, type?: string): Promise<{
        categories: never[];
        summary: {
            totalAmount: number;
            categoriesCount: number;
            transactionsCount: number;
        };
    }>;
    getTimeAnalysis(userId: number, startDate: Date, endDate: Date, period?: string): Promise<{
        periods: never[];
        summary: {
            totalIncome: number;
            totalExpense: number;
            totalNet: number;
            totalTransactions: number;
            periodsCount: number;
        };
    }>;
    getInstallmentsReport(userId: number, status?: string): Promise<{
        installments: {
            id: number;
            description: string;
            totalAmount: number;
            installmentCount: number;
            currentInstallment: number;
            isActive: boolean;
            category: {
                createdAt: Date;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                name: string;
                updatedAt: Date;
                description: string | null;
                color: string;
                icon: string;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
                userId: number;
            };
            paymentMethod: {
                walletGroup: {
                    createdAt: Date;
                    id: number;
                    type: import("@prisma/client").$Enums.WalletGroupType;
                    name: string;
                    updatedAt: Date;
                    description: string | null;
                    color: string;
                    icon: string;
                    userId: number;
                    isActive: boolean;
                    hasIntegratedPix: boolean;
                    hasWalletBalance: boolean;
                } | null;
            } & {
                createdAt: Date;
                isPrimary: boolean;
                id: number;
                walletGroupId: number | null;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                name: string;
                updatedAt: Date;
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
