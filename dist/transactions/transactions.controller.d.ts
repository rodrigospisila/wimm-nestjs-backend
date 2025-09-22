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
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        category: {
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
    } & {
        description: string;
        amount: number;
        date: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        transferToWalletId: number | null;
        id: number;
        walletId: number;
        categoryId: number;
        userId: number;
    }>;
    findAll(req: any, type?: string, categoryId?: string, walletId?: string, startDate?: string, endDate?: string, limit?: string, offset?: string): Promise<({
        wallet: {
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        category: {
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
    } & {
        description: string;
        amount: number;
        date: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        transferToWalletId: number | null;
        id: number;
        walletId: number;
        categoryId: number;
        userId: number;
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
                id: number;
                name: string;
                color: string;
                icon: string;
            };
            category: {
                type: import("@prisma/client").$Enums.CategoryType;
                id: number;
                name: string;
                color: string;
                icon: string;
            };
        } & {
            description: string;
            amount: number;
            date: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            transferToWalletId: number | null;
            id: number;
            walletId: number;
            categoryId: number;
            userId: number;
        })[];
        byCategory: unknown[];
        byWallet: unknown[];
    }>;
    findOne(req: any, id: number): Promise<{
        wallet: {
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        category: {
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
    } & {
        description: string;
        amount: number;
        date: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        transferToWalletId: number | null;
        id: number;
        walletId: number;
        categoryId: number;
        userId: number;
    }>;
    update(req: any, id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
        wallet: {
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        category: {
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
    } & {
        description: string;
        amount: number;
        date: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        transferToWalletId: number | null;
        id: number;
        walletId: number;
        categoryId: number;
        userId: number;
    }>;
    remove(req: any, id: number): Promise<{
        message: string;
    }>;
    createInstallment(req: any, createInstallmentDto: CreateInstallmentTransactionDto): Promise<{
        installment: ({
            category: {
                type: import("@prisma/client").$Enums.CategoryType;
                id: number;
                name: string;
                color: string;
                icon: string;
            };
            creditCard: {
                id: number;
                userId: number;
                name: string;
                limit: number;
                dueDay: number;
                closingDay: number;
                bankCode: string | null;
            } | null;
            transactions: {
                description: string;
                amount: number;
                date: Date;
                id: number;
                categoryId: number;
                creditCardId: number;
                installmentId: number | null;
            }[];
        } & {
            description: string;
            id: number;
            categoryId: number;
            notes: string | null;
            tags: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            startDate: Date;
            totalAmount: number;
            installmentCount: number;
            currentInstallment: number;
            creditCardId: number | null;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
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
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        creditCard: {
            id: number;
            name: string;
            limit: number;
            dueDay: number;
            closingDay: number;
        } | null;
        transactions: {
            description: string;
            amount: number;
            date: Date;
            id: number;
        }[];
        description: string;
        id: number;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        creditCardId: number | null;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    }[]>;
    getInstallmentStatistics(req: any, startDate?: string, endDate?: string, categoryId?: string): Promise<{
        totalInstallments: number;
        activeInstallments: number;
        completedInstallments: number;
        totalAmount: number;
        upcomingPayments: ({
            category: {
                id: number;
                name: string;
                color: string;
                icon: string;
            };
        } & {
            description: string;
            amount: number;
            date: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            transferToWalletId: number | null;
            id: number;
            walletId: number;
            categoryId: number;
            userId: number;
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
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        creditCard: {
            id: number;
            name: string;
            limit: number;
            dueDay: number;
            closingDay: number;
        } | null;
        transactions: {
            description: string;
            amount: number;
            date: Date;
            id: number;
        }[];
        description: string;
        id: number;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        creditCardId: number | null;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    }>;
    cancelInstallment(req: any, id: number): Promise<{
        message: string;
    }>;
    getUpcomingPayments(req: any, days?: string, limit?: string): Promise<({
        wallet: {
            id: number;
            name: string;
            color: string;
            icon: string;
        };
        category: {
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            name: string;
            color: string;
            icon: string;
        };
    } & {
        description: string;
        amount: number;
        date: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        transferToWalletId: number | null;
        id: number;
        walletId: number;
        categoryId: number;
        userId: number;
    })[]>;
    processInstallments(req: any): Promise<{
        message: string;
    }>;
    getUpcomingInstallments(req: any, days?: string): Promise<({
        category: {
            description: string | null;
            type: import("@prisma/client").$Enums.CategoryType;
            id: number;
            userId: number;
            name: string;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
        creditCard: {
            id: number;
            userId: number;
            name: string;
            limit: number;
            dueDay: number;
            closingDay: number;
            bankCode: string | null;
        } | null;
        transactions: {
            description: string;
            amount: number;
            date: Date;
            id: number;
            categoryId: number;
            creditCardId: number;
            installmentId: number | null;
        }[];
    } & {
        description: string;
        id: number;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        creditCardId: number | null;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    })[]>;
    getInstallmentsMonthlyReport(year: number, month: number): Promise<any>;
    processAllInstallments(): Promise<{
        message: string;
    }>;
}
