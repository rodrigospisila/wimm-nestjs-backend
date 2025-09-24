import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class WalletsV2Controller {
    private readonly walletGroupsService;
    private readonly paymentMethodsService;
    constructor(walletGroupsService: WalletGroupsService, paymentMethodsService: PaymentMethodsService);
    getOverview(req: any): Promise<{
        groups: ({
            paymentMethods: {
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
                availableLimit: number | null;
                accountNumber: string | null;
                agency: string | null;
                bankCode: string | null;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletGroupType;
            description: string | null;
            color: string;
            icon: string;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
            isActive: boolean;
            userId: number;
        })[];
        independentMethods: {
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
            availableLimit: number | null;
            accountNumber: string | null;
            agency: string | null;
            bankCode: string | null;
        }[];
        summary: {
            totalBalance: number;
            totalCreditLimit: number;
            totalAvailableCredit: number;
            totalUsedCredit: number;
            groupsCount: number;
            paymentMethodsCount: number;
        };
    }>;
    getAllGroups(req: any): Promise<({
        paymentMethods: {
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
            availableLimit: number | null;
            accountNumber: string | null;
            agency: string | null;
            bankCode: string | null;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletGroupType;
        description: string | null;
        color: string;
        icon: string;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
        isActive: boolean;
        userId: number;
    })[]>;
    createGroup(req: any, createGroupDto: CreateWalletGroupDto): Promise<{
        paymentMethods: {
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
            availableLimit: number | null;
            accountNumber: string | null;
            agency: string | null;
            bankCode: string | null;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletGroupType;
        description: string | null;
        color: string;
        icon: string;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
        isActive: boolean;
        userId: number;
    }>;
    updateGroup(req: any, id: number, updateGroupDto: Partial<CreateWalletGroupDto>): Promise<{
        paymentMethods: {
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
            availableLimit: number | null;
            accountNumber: string | null;
            agency: string | null;
            bankCode: string | null;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletGroupType;
        description: string | null;
        color: string;
        icon: string;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
        isActive: boolean;
        userId: number;
    }>;
    deleteGroup(req: any, id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.WalletGroupType;
        description: string | null;
        color: string;
        icon: string;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
        isActive: boolean;
        userId: number;
    }>;
    getGroupTypes(): Promise<{
        types: {
            value: "DIGITAL_WALLET" | "TRADITIONAL_BANK" | "INVESTMENT" | "OTHER";
            label: string;
            description: string;
        }[];
    }>;
    createDefaultGroups(req: any): Promise<{
        message: string;
        groups: any[];
    }>;
    getAllPaymentMethods(req: any, groupId?: string): Promise<({
        walletGroup: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
    } & {
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
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    })[]>;
    createPaymentMethod(req: any, createMethodDto: CreatePaymentMethodDto): Promise<{
        walletGroup: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
    } & {
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
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    updatePaymentMethod(req: any, id: number, updateMethodDto: Partial<CreatePaymentMethodDto>): Promise<{
        walletGroup: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
    } & {
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
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    deletePaymentMethod(req: any, id: number): Promise<{
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
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    getPaymentMethodTypes(): Promise<{
        types: {
            value: "INVESTMENT" | "OTHER" | "CREDIT_CARD" | "DEBIT_CARD" | "WALLET_BALANCE" | "PIX" | "CHECKING_ACCOUNT" | "SAVINGS_ACCOUNT" | "CASH";
            label: string;
            description: string;
            icon: string;
        }[];
    }>;
    setPrimaryPaymentMethod(req: any, id: number): Promise<{
        walletGroup: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
    } & {
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
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    private getFinancialSummary;
}
