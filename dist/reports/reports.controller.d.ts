import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(req: any, startDate?: string, endDate?: string): Promise<{
        totalBalance: number;
        monthlyIncome: number;
        monthlyExpenses: number;
        monthlyBalance: number;
        walletsCount: number;
        transactionsCount: number;
        categoriesCount: number;
        pendingInstallments: number;
        topCategories: ({
            id: number;
            name: string;
            amount: number;
            percentage: number;
            color: string;
            icon: string;
        } | null)[];
        recentTransactions: {
            id: number;
            description: string;
            amount: number;
            type: import("@prisma/client").$Enums.TransactionType;
            date: string;
            category: {
                name: string;
                color: string;
                icon: string;
            };
        }[];
    }>;
    getCategoriesReport(req: any, startDate?: string, endDate?: string, type?: 'INCOME' | 'EXPENSE'): Promise<{
        percentage: number;
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string;
        icon: string;
        totalAmount: number;
        transactionCount: number;
        averageTransaction: number;
        subCategories: {
            id: number;
            name: string;
            color: string;
            icon: string;
            totalAmount: number;
            transactionCount: number;
            percentage: number;
        }[];
    }[]>;
    getTimeAnalysis(req: any, startDate?: string, endDate?: string, period?: 'daily' | 'weekly' | 'monthly'): Promise<{
        periods: any[];
        summary: {
            totalIncome: any;
            totalExpenses: any;
            totalBalance: number;
            averageDaily: number;
            bestDay: any;
            worstDay: any;
        };
    }>;
    getInstallmentsReport(req: any, startDate?: string, endDate?: string, status?: 'ACTIVE' | 'COMPLETED' | 'OVERDUE'): Promise<{
        installments: {
            id: number;
            description: string;
            totalAmount: number;
            installmentCount: number;
            paidInstallments: number;
            remainingAmount: number;
            nextDueDate: string | null;
            status: "ACTIVE" | "COMPLETED" | "OVERDUE";
            installmentType: import("@prisma/client").$Enums.InstallmentType;
            category: {
                name: string;
                id: number;
                color: string;
                icon: string;
            };
            wallet: {
                id: number;
                name: string;
                color: string;
                icon: string;
            } | null;
            installments: {
                id: number;
                installmentNumber: number;
                amount: number;
                dueDate: string;
                status: "OVERDUE" | "PENDING" | "PAID";
            }[];
        }[];
        summary: {
            totalActive: number;
            totalCompleted: number;
            totalOverdue: number;
            totalPendingAmount: number;
            totalPaidAmount: number;
            nextPayments: {
                id: number;
                description: string;
                amount: number;
                dueDate: string | null;
                installmentNumber: number;
                totalInstallments: number;
            }[];
        };
    }>;
}
