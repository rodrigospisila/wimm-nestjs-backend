import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class WalletsV2Controller {
    private readonly walletGroupsService;
    private readonly paymentMethodsService;
    constructor(walletGroupsService: WalletGroupsService, paymentMethodsService: PaymentMethodsService);
    createGroup(createWalletGroupDto: CreateWalletGroupDto, req: any): Promise<{
        paymentMethods: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
            icon: string;
            creditLimit: number | null;
            closingDay: number | null;
            dueDay: number | null;
            currentBalance: number;
            isActive: boolean;
            userId: number;
            isPrimary: boolean;
            walletGroupId: number | null;
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
        isActive: boolean;
        userId: number;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
    }>;
    findAllGroups(req: any): Promise<({
        paymentMethods: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
            icon: string;
            creditLimit: number | null;
            closingDay: number | null;
            dueDay: number | null;
            currentBalance: number;
            isActive: boolean;
            userId: number;
            isPrimary: boolean;
            walletGroupId: number | null;
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
        isActive: boolean;
        userId: number;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
    })[]>;
    getWalletGroupTypes(): Promise<{
        types: ({
            value: "DIGITAL_WALLET";
            label: string;
            icon: string;
            description: string;
        } | {
            value: "TRADITIONAL_BANK";
            label: string;
            icon: string;
            description: string;
        } | {
            value: "INVESTMENT";
            label: string;
            icon: string;
            description: string;
        } | {
            value: "OTHER";
            label: string;
            icon: string;
            description: string;
        })[];
    }>;
    createDefaultGroups(req: any): Promise<never[]>;
    findOneGroup(id: string, req: any): Promise<{
        paymentMethods: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
            icon: string;
            creditLimit: number | null;
            closingDay: number | null;
            dueDay: number | null;
            currentBalance: number;
            isActive: boolean;
            userId: number;
            isPrimary: boolean;
            walletGroupId: number | null;
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
        isActive: boolean;
        userId: number;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
    }>;
    updateGroup(id: string, updateData: Partial<CreateWalletGroupDto>, req: any): Promise<{
        paymentMethods: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
            icon: string;
            creditLimit: number | null;
            closingDay: number | null;
            dueDay: number | null;
            currentBalance: number;
            isActive: boolean;
            userId: number;
            isPrimary: boolean;
            walletGroupId: number | null;
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
        isActive: boolean;
        userId: number;
        hasIntegratedPix: boolean;
        hasWalletBalance: boolean;
    }>;
    removeGroup(id: string, req: any): Promise<{
        message: string;
    }>;
    createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto, req: any): Promise<{
        walletGroup: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletGroupType;
            description: string | null;
            color: string;
            icon: string;
            isActive: boolean;
            userId: number;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
        } | null;
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        currentBalance: number;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    findAllPaymentMethods(req: any, walletGroupId?: string): Promise<({
        walletGroup: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletGroupType;
            description: string | null;
            color: string;
            icon: string;
            isActive: boolean;
            userId: number;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
        } | null;
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        currentBalance: number;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    })[]>;
    getPaymentMethodTypes(): Promise<{
        types: ({
            value: "CREDIT_CARD";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "DEBIT_CARD";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "WALLET_BALANCE";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "PIX";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "CHECKING_ACCOUNT";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "SAVINGS_ACCOUNT";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "CASH";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "INVESTMENT";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        } | {
            value: "OTHER";
            label: string;
            icon: string;
            requiresGroup: boolean;
            description: string;
        })[];
    }>;
    getPaymentMethodsByType(type: string, req: any): Promise<({
        walletGroup: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletGroupType;
            description: string | null;
            color: string;
            icon: string;
            isActive: boolean;
            userId: number;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
        } | null;
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        currentBalance: number;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    })[]>;
    findOnePaymentMethod(id: string, req: any): Promise<{
        walletGroup: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletGroupType;
            description: string | null;
            color: string;
            icon: string;
            isActive: boolean;
            userId: number;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
        } | null;
        transactions: ({
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.CategoryType;
                description: string | null;
                color: string;
                icon: string;
                userId: number;
                monthlyBudget: number | null;
                parentCategoryId: number | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            amount: number;
            date: Date;
            paymentMethodId: number;
            categoryId: number;
            subcategoryId: number | null;
            creditCardBillId: number | null;
            installmentId: number | null;
            installmentNumber: number | null;
            transferToMethodId: number | null;
            notes: string | null;
            tags: string | null;
            isRecurring: boolean;
            userId: number;
        })[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        currentBalance: number;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    updatePaymentMethod(id: string, updateData: Partial<CreatePaymentMethodDto>, req: any): Promise<{
        walletGroup: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.WalletGroupType;
            description: string | null;
            color: string;
            icon: string;
            isActive: boolean;
            userId: number;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
        } | null;
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        currentBalance: number;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    updateBalance(id: string, { amount, operation }: {
        amount: number;
        operation: 'add' | 'subtract';
    }, req: any): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentMethodType;
        color: string;
        icon: string;
        creditLimit: number | null;
        closingDay: number | null;
        dueDay: number | null;
        currentBalance: number;
        isActive: boolean;
        userId: number;
        isPrimary: boolean;
        walletGroupId: number | null;
        availableLimit: number | null;
        accountNumber: string | null;
        agency: string | null;
        bankCode: string | null;
    }>;
    removePaymentMethod(id: string, req: any): Promise<{
        message: string;
    }>;
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
                creditLimit: number | null;
                closingDay: number | null;
                dueDay: number | null;
                currentBalance: number;
                isActive: boolean;
                userId: number;
                isPrimary: boolean;
                walletGroupId: number | null;
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
            isActive: boolean;
            userId: number;
            hasIntegratedPix: boolean;
            hasWalletBalance: boolean;
        })[];
        independentMethods: ({
            walletGroup: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.WalletGroupType;
                description: string | null;
                color: string;
                icon: string;
                isActive: boolean;
                userId: number;
                hasIntegratedPix: boolean;
                hasWalletBalance: boolean;
            } | null;
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
            icon: string;
            creditLimit: number | null;
            closingDay: number | null;
            dueDay: number | null;
            currentBalance: number;
            isActive: boolean;
            userId: number;
            isPrimary: boolean;
            walletGroupId: number | null;
            availableLimit: number | null;
            accountNumber: string | null;
            agency: string | null;
            bankCode: string | null;
        })[];
        summary: {
            totalBalance: number;
            totalCreditLimit: number;
            totalAvailableCredit: number;
            totalUsedCredit: number;
            groupsCount: number;
            paymentMethodsCount: number;
        };
    }>;
}
