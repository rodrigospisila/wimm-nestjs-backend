import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createWalletDto: CreateWalletDto): Promise<any>;
    findAll(userId: number, type?: string): Promise<any>;
    findOne(id: number, userId: number): Promise<any>;
    update(id: number, userId: number, updateWalletDto: UpdateWalletDto): Promise<any>;
    toggleActive(id: number, userId: number): Promise<any>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
    getSummary(userId: number): Promise<{
        totalBalance: any;
        walletsCount: any;
        walletsByType: any;
        wallets: any;
    }>;
    getStatistics(userId: number): Promise<{
        totalWallets: any;
        activeWallets: any;
        totalBalance: any;
        monthlyTransactions: any;
        averageBalance: number;
        highestBalance: number;
        lowestBalance: number;
        mostUsedWallet: any;
    }>;
    getBalanceHistory(id: number, userId: number, days?: number): Promise<{
        walletId: number;
        walletName: any;
        period: string;
        history: {
            date: Date;
            balance: number;
        }[];
    }>;
}
