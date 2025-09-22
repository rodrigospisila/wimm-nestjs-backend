import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
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
