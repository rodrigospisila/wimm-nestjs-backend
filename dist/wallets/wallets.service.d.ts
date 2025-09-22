import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createWalletDto: CreateWalletDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        initialBalance: number;
        type: import("@prisma/client").$Enums.WalletType;
        description: string | null;
        color: string;
        icon: string;
        currentBalance: number;
        isActive: boolean;
        userId: number;
    }>;
    findAll(userId: number, type?: string): Promise<{
        transactionsCount: number;
        lastTransactionDate: Date;
        transactions: ({
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                userId: number;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
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
        _count: {
            transactions: number;
        };
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        initialBalance: number;
        type: import("@prisma/client").$Enums.WalletType;
        description: string | null;
        color: string;
        icon: string;
        currentBalance: number;
        isActive: boolean;
        userId: number;
    }[]>;
    findOne(id: number, userId: number): Promise<{
        transactionsCount: number;
        transactions: ({
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                userId: number;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
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
        _count: {
            transactions: number;
        };
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        initialBalance: number;
        type: import("@prisma/client").$Enums.WalletType;
        description: string | null;
        color: string;
        icon: string;
        currentBalance: number;
        isActive: boolean;
        userId: number;
    }>;
    update(id: number, userId: number, updateWalletDto: UpdateWalletDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        initialBalance: number;
        type: import("@prisma/client").$Enums.WalletType;
        description: string | null;
        color: string;
        icon: string;
        currentBalance: number;
        isActive: boolean;
        userId: number;
    }>;
    toggleActive(id: number, userId: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        initialBalance: number;
        type: import("@prisma/client").$Enums.WalletType;
        description: string | null;
        color: string;
        icon: string;
        currentBalance: number;
        isActive: boolean;
        userId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
    getSummary(userId: number): Promise<{
        totalBalance: number;
        walletsCount: number;
        walletsByType: Record<string, {
            count: number;
            balance: number;
        }>;
        wallets: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.WalletType;
            currentBalance: number;
            color: string;
            icon: string;
        }[];
    }>;
    getStatistics(userId: number): Promise<{
        totalWallets: number;
        activeWallets: number;
        totalBalance: number;
        monthlyTransactions: number;
        averageBalance: number;
        highestBalance: number;
        lowestBalance: number;
        mostUsedWallet: any;
    }>;
    getBalanceHistory(id: number, userId: number, days?: number): Promise<{
        walletId: number;
        walletName: string;
        period: string;
        history: {
            date: Date;
            balance: number;
        }[];
    }>;
}
