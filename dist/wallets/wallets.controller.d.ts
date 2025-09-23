import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    create(createWalletDto: CreateWalletDto, req: any): Promise<any>;
    findAll(req: any, type?: string): Promise<any>;
    getSummary(req: any): Promise<{
        totalBalance: any;
        walletsCount: any;
        walletsByType: any;
        wallets: any;
    }>;
    getWalletTypes(): Promise<{
        types: {
            value: string;
            label: string;
            icon: string;
        }[];
    }>;
    getStatistics(req: any): Promise<{
        totalWallets: any;
        activeWallets: any;
        totalBalance: any;
        monthlyTransactions: any;
        averageBalance: number;
        highestBalance: number;
        lowestBalance: number;
        mostUsedWallet: any;
    }>;
    findOne(id: string, req: any): Promise<any>;
    getBalanceHistory(id: string, req: any, days?: string): Promise<{
        walletId: number;
        walletName: any;
        period: string;
        history: {
            date: Date;
            balance: number;
        }[];
    }>;
    update(id: string, updateWalletDto: UpdateWalletDto, req: any): Promise<any>;
    toggleActive(id: string, req: any): Promise<any>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
