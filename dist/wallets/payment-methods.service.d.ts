import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class PaymentMethodsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: number, walletGroupId?: number): Promise<({
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
    findIndependentByUser(userId: number): Promise<{
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
    }[]>;
    findOne(userId: number, id: number): Promise<{
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
    create(userId: number, createMethodDto: CreatePaymentMethodDto): Promise<{
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
    update(userId: number, id: number, updateMethodDto: Partial<CreatePaymentMethodDto>): Promise<{
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
    remove(userId: number, id: number): Promise<{
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
    setPrimary(userId: number, id: number): Promise<{
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
    getCount(userId: number): Promise<number>;
    getTotalBalance(userId: number): Promise<number>;
    getTotalCreditLimit(userId: number): Promise<number>;
    getTotalAvailableCredit(userId: number): Promise<number>;
    getTypes(): Promise<{
        types: {
            value: "INVESTMENT" | "OTHER" | "CREDIT_CARD" | "DEBIT_CARD" | "WALLET_BALANCE" | "PIX" | "CHECKING_ACCOUNT" | "SAVINGS_ACCOUNT" | "CASH";
            label: string;
            description: string;
            icon: string;
        }[];
    }>;
    private updatePrimaryStatus;
    private getTypeLabel;
    private getTypeDescription;
    private getTypeIcon;
}
