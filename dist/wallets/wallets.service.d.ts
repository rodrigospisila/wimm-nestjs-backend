import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createWalletDto: CreateWalletDto): Promise<{
        name: string;
        id: number;
        initialBalance: number;
        currentBalance: number;
        userId: number;
    }>;
    findAll(userId: number): Promise<({
        transactions: {
            id: number;
            userId: number;
            date: Date;
            description: string;
            amount: number;
            type: import("@prisma/client").$Enums.TransactionType;
            walletId: number;
            categoryId: number;
            transferToWalletId: number | null;
        }[];
    } & {
        name: string;
        id: number;
        initialBalance: number;
        currentBalance: number;
        userId: number;
    })[]>;
    findOne(id: number, userId: number): Promise<{
        transactions: ({
            category: {
                name: string;
                id: number;
                userId: number;
                type: import("@prisma/client").$Enums.CategoryType;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
            };
        } & {
            id: number;
            userId: number;
            date: Date;
            description: string;
            amount: number;
            type: import("@prisma/client").$Enums.TransactionType;
            walletId: number;
            categoryId: number;
            transferToWalletId: number | null;
        })[];
    } & {
        name: string;
        id: number;
        initialBalance: number;
        currentBalance: number;
        userId: number;
    }>;
    update(id: number, userId: number, updateWalletDto: UpdateWalletDto): Promise<{
        name: string;
        id: number;
        initialBalance: number;
        currentBalance: number;
        userId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
    getSummary(userId: number): Promise<{
        totalBalance: number;
        walletsCount: number;
        wallets: {
            id: number;
            name: string;
            currentBalance: number;
        }[];
    }>;
}
