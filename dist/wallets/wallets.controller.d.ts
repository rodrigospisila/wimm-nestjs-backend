import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    create(req: any, createWalletDto: CreateWalletDto): Promise<{
        name: string;
        id: number;
        initialBalance: number;
        currentBalance: number;
        userId: number;
    }>;
    findAll(req: any): Promise<({
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
    getSummary(req: any): Promise<{
        totalBalance: number;
        walletsCount: number;
        wallets: {
            id: number;
            name: string;
            currentBalance: number;
        }[];
    }>;
    findOne(id: number, req: any): Promise<{
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
    update(id: number, req: any, updateWalletDto: UpdateWalletDto): Promise<{
        name: string;
        id: number;
        initialBalance: number;
        currentBalance: number;
        userId: number;
    }>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
