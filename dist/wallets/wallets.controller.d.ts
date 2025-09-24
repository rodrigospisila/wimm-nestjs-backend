import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
export declare class WalletsController {
    private readonly walletGroupsService;
    private readonly paymentMethodsService;
    constructor(walletGroupsService: WalletGroupsService, paymentMethodsService: PaymentMethodsService);
    findAll(req: any, type?: string): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        balance: number;
        isActive: boolean;
        color: string;
        icon: string;
        creditLimit: number | null;
        availableLimit: number | null;
        walletGroup: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
    }[]>;
    getTypes(): Promise<{
        types: {
            value: "INVESTMENT" | "OTHER" | "CREDIT_CARD" | "DEBIT_CARD" | "WALLET_BALANCE" | "PIX" | "CHECKING_ACCOUNT" | "SAVINGS_ACCOUNT" | "CASH";
            label: string;
            description: string;
            icon: string;
        }[];
    }>;
    getSummary(req: any): Promise<{
        totalBalance: number;
        totalCreditLimit: number;
        totalAvailableCredit: number;
        totalUsedCredit: number;
        walletsCount: number;
    }>;
    getStatistics(req: any): Promise<{
        totalBalance: number;
        totalCreditLimit: number;
        totalAvailableCredit: number;
        totalUsedCredit: number;
        walletsCount: number;
    }>;
    findOne(req: any, id: number): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        balance: number;
        isActive: boolean;
        color: string;
        icon: string;
        creditLimit: number | null;
        availableLimit: number | null;
        walletGroup: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
    }>;
    create(req: any, createWalletDto: any): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        balance: number;
        isActive: boolean;
        color: string;
        icon: string;
    }>;
    update(req: any, id: number, updateWalletDto: any): Promise<{
        id: number;
        name: string;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        balance: number;
        isActive: boolean;
        color: string;
        icon: string;
    }>;
    remove(req: any, id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        currentBalance: number;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
        availableLimit: number | null;
    }>;
    toggleActive(req: any, id: number): Promise<{
        id: number;
        name: string;
        isActive: boolean;
    }>;
    getBalanceHistory(req: any, id: number, startDate?: string, endDate?: string): Promise<{
        history: never[];
        currentBalance: number;
    }>;
}
