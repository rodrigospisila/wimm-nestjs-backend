import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createTransactionDto: CreateTransactionDto): Promise<{
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
    findAll(userId: number, filters?: {
        type?: string;
        categoryId?: number;
        walletId?: number;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }): Promise<({
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
    findOne(userId: number, id: number): Promise<{
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
    update(userId: number, id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
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
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
    getStatistics(userId: number, filters?: {
        startDate?: string;
        endDate?: string;
        categoryId?: number;
        walletId?: number;
    }): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
        averageTransaction: number;
    }>;
    getMonthlyReport(userId: number, year: number, month: number): Promise<{
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
}
