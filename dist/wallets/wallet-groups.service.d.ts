import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
export declare class WalletGroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: number): Promise<({
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
    findOne(userId: number, id: number): Promise<{
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
    create(userId: number, createGroupDto: CreateWalletGroupDto): Promise<{
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
    update(userId: number, id: number, updateGroupDto: Partial<CreateWalletGroupDto>): Promise<{
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
    remove(userId: number, id: number): Promise<{
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
    getCount(userId: number): Promise<number>;
    getTypes(): Promise<{
        types: {
            value: "DIGITAL_WALLET" | "TRADITIONAL_BANK" | "INVESTMENT" | "OTHER";
            label: string;
            description: string;
        }[];
    }>;
    createDefaults(userId: number): Promise<{
        message: string;
        groups: any[];
    }>;
    private getTypeLabel;
    private getTypeDescription;
    private createDefaultPaymentMethods;
}
