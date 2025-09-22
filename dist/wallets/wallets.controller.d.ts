import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    create(createWalletDto: CreateWalletDto, req: any): Promise<{
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
    findAll(req: any, type?: string): Promise<{
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
    getSummary(req: any): Promise<{
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
    getWalletTypes(): Promise<{
        types: {
            value: string;
            label: string;
            icon: string;
        }[];
    }>;
    getStatistics(req: any): Promise<{
        totalWallets: number;
        activeWallets: number;
        totalBalance: number;
        monthlyTransactions: number;
        averageBalance: number;
        highestBalance: number;
        lowestBalance: number;
        mostUsedWallet: any;
    }>;
    findOne(id: string, req: any): Promise<{
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
    getBalanceHistory(id: string, req: any, days?: string): Promise<{
        walletId: number;
        walletName: string;
        period: string;
        history: {
            date: Date;
            balance: number;
        }[];
    }>;
    update(id: string, updateWalletDto: UpdateWalletDto, req: any): Promise<{
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
    toggleActive(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
