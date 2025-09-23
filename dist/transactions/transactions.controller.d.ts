import { TransactionsService } from './transactions.service';
import { InstallmentsService } from './installments.service';
import { InstallmentsProcessorService } from './installments-processor.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateInstallmentTransactionDto } from './dto/create-installment-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly installmentsService;
    private readonly installmentsProcessorService;
    constructor(transactionsService: TransactionsService, installmentsService: InstallmentsService, installmentsProcessorService: InstallmentsProcessorService);
    create(req: any, createTransactionDto: CreateTransactionDto): Promise<{
        wallet: {
            name: string;
            id: number;
            color: string;
            icon: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
    } & {
        id: number;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string;
        userId: number;
        date: Date;
        amount: number;
        walletId: number;
        categoryId: number;
        transferToWalletId: number | null;
    }>;
    findAll(req: any, type?: string, categoryId?: string, walletId?: string, startDate?: string, endDate?: string, limit?: string, offset?: string): Promise<({
        wallet: {
            name: string;
            id: number;
            color: string;
            icon: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
    } & {
        id: number;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string;
        userId: number;
        date: Date;
        amount: number;
        walletId: number;
        categoryId: number;
        transferToWalletId: number | null;
    })[]>;
    getStatistics(req: any, startDate?: string, endDate?: string, categoryId?: string, walletId?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
        averageTransaction: number;
    }>;
    getMonthlyReport(req: any, year: number, month: number): Promise<{
        period: string;
        statistics: {
            totalIncome: number;
            totalExpense: number;
            balance: number;
            transactionCount: number;
            averageTransaction: number;
        };
        transactions: ({
            wallet: {
                name: string;
                id: number;
                color: string;
                icon: string;
            };
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                color: string;
                icon: string;
            };
        } & {
            id: number;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            date: Date;
            amount: number;
            walletId: number;
            categoryId: number;
            transferToWalletId: number | null;
        })[];
        byCategory: unknown[];
        byWallet: unknown[];
    }>;
    createInstallment(req: any, createInstallmentDto: CreateInstallmentTransactionDto): Promise<{
        installment: ({
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                color: string;
                icon: string;
            };
            creditCard: {
                name: string;
                id: number;
                userId: number;
                limit: number;
                dueDay: number;
                closingDay: number;
                bankCode: string | null;
            } | null;
            transactions: {
                id: number;
                description: string;
                date: Date;
                amount: number;
                categoryId: number;
                creditCardId: number;
                installmentId: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            categoryId: number;
            notes: string | null;
            tags: string | null;
            startDate: Date;
            totalAmount: number;
            installmentCount: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
            creditCardId: number | null;
            currentInstallment: number;
        }) | null;
        transactions: any[];
        summary: {
            totalAmount: number;
            installmentCount: number;
            installmentAmount: number;
            lastInstallmentAmount: number;
            installmentType: import("./dto/create-installment-transaction.dto").InstallmentType;
        };
    }>;
    findAllInstallments(req: any, categoryId?: string, walletId?: string, creditCardId?: string, status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED', limit?: string, offset?: string): Promise<{
        status: string;
        progress: number;
        paidInstallments: number;
        remainingInstallments: number;
        nextPaymentDate: Date | null;
        nextPaymentAmount: number | null;
        totalPaid: number;
        totalRemaining: number;
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        creditCard: {
            name: string;
            id: number;
            limit: number;
            dueDay: number;
            closingDay: number;
        } | null;
        transactions: {
            id: number;
            description: string;
            date: Date;
            amount: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        creditCardId: number | null;
        currentInstallment: number;
    }[]>;
    getInstallmentStatistics(req: any, startDate?: string, endDate?: string, categoryId?: string): Promise<{
        totalInstallments: number;
        activeInstallments: number;
        completedInstallments: number;
        totalAmount: number;
        upcomingPayments: ({
            category: {
                name: string;
                id: number;
                color: string;
                icon: string;
            };
        } & {
            id: number;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            date: Date;
            amount: number;
            walletId: number;
            categoryId: number;
            transferToWalletId: number | null;
        })[];
    }>;
    findOneInstallment(req: any, id: number): Promise<{
        status: string;
        progress: number;
        paidInstallments: number;
        remainingInstallments: number;
        totalPaid: number;
        totalRemaining: number;
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        creditCard: {
            name: string;
            id: number;
            limit: number;
            dueDay: number;
            closingDay: number;
        } | null;
        transactions: {
            id: number;
            description: string;
            date: Date;
            amount: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        creditCardId: number | null;
        currentInstallment: number;
    }>;
    cancelInstallment(req: any, id: number): Promise<{
        message: string;
    }>;
    getUpcomingPayments(req: any, days?: string, limit?: string): Promise<({
        wallet: {
            name: string;
            id: number;
            color: string;
            icon: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
    } & {
        id: number;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string;
        userId: number;
        date: Date;
        amount: number;
        walletId: number;
        categoryId: number;
        transferToWalletId: number | null;
    })[]>;
    processInstallments(req: any): Promise<{
        message: string;
    }>;
    getUpcomingInstallments(req: any, days?: string): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        };
        creditCard: {
            name: string;
            id: number;
            userId: number;
            limit: number;
            dueDay: number;
            closingDay: number;
            bankCode: string | null;
        } | null;
        transactions: {
            id: number;
            description: string;
            date: Date;
            amount: number;
            categoryId: number;
            creditCardId: number;
            installmentId: number | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        creditCardId: number | null;
        currentInstallment: number;
    })[]>;
    getInstallmentsMonthlyReport(year: number, month: number): Promise<any>;
    processAllInstallments(): Promise<{
        message: string;
    }>;
    findOne(req: any, id: number): Promise<{
        wallet: {
            name: string;
            id: number;
            color: string;
            icon: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
    } & {
        id: number;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string;
        userId: number;
        date: Date;
        amount: number;
        walletId: number;
        categoryId: number;
        transferToWalletId: number | null;
    }>;
    update(req: any, id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
        wallet: {
            name: string;
            id: number;
            color: string;
            icon: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
    } & {
        id: number;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string;
        userId: number;
        date: Date;
        amount: number;
        walletId: number;
        categoryId: number;
        transferToWalletId: number | null;
    }>;
    remove(req: any, id: number): Promise<{
        message: string;
    }>;
}
