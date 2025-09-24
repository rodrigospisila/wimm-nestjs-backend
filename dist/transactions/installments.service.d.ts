import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
interface InstallmentFilters {
    status?: string;
    paymentMethodId?: number;
}
export declare class InstallmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createInstallmentDto: CreateInstallmentDto): Promise<{
        installment: {
            paymentMethod: {
                walletGroup: {
                    name: string;
                    id: number;
                    color: string;
                    icon: string;
                } | null;
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
            };
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                color: string;
                icon: string;
            };
            transactions: {
                id: number;
                createdAt: Date;
                amount: number;
                date: Date;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            totalAmount: number;
            startDate: Date;
            installmentCount: number;
            currentInstallment: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
        };
        transactions: any[];
        message: string;
    }>;
    findAllByUser(userId: number, filters?: InstallmentFilters): Promise<({
        paymentMethod: {
            walletGroup: {
                name: string;
                id: number;
                color: string;
                icon: string;
            } | null;
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        transactions: {
            id: number;
            amount: number;
            date: Date;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        userId: number;
        paymentMethodId: number;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        totalAmount: number;
        startDate: Date;
        installmentCount: number;
        currentInstallment: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    })[]>;
    findOne(userId: number, id: number): Promise<{
        paymentMethod: {
            walletGroup: {
                name: string;
                id: number;
                color: string;
                icon: string;
            } | null;
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
        };
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        transactions: {
            id: number;
            createdAt: Date;
            amount: number;
            date: Date;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        userId: number;
        paymentMethodId: number;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        totalAmount: number;
        startDate: Date;
        installmentCount: number;
        currentInstallment: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    }>;
    payInstallment(userId: number, installmentId: number, installmentNumber: number, paidAmount?: number): Promise<{
        message: string;
        installment: {
            paymentMethod: {
                walletGroup: {
                    name: string;
                    id: number;
                    color: string;
                    icon: string;
                } | null;
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
            };
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                color: string;
                icon: string;
            };
            transactions: {
                id: number;
                createdAt: Date;
                amount: number;
                date: Date;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            totalAmount: number;
            startDate: Date;
            installmentCount: number;
            currentInstallment: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
        };
    }>;
    remove(userId: number, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        userId: number;
        paymentMethodId: number;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        totalAmount: number;
        startDate: Date;
        installmentCount: number;
        currentInstallment: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    }>;
    cancelInstallment(userId: number, id: number): Promise<{
        message: string;
        installment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            totalAmount: number;
            startDate: Date;
            installmentCount: number;
            currentInstallment: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
        };
    }>;
    getPendingInstallments(userId: number): Promise<({
        paymentMethod: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.PaymentMethodType;
            color: string;
        };
        category: {
            name: string;
            id: number;
            color: string;
            icon: string;
        };
        installment: {
            id: number;
            description: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        description: string;
        userId: number;
        paymentMethodId: number;
        categoryId: number;
        amount: number;
        date: Date;
        subcategoryId: number | null;
        creditCardBillId: number | null;
        installmentId: number | null;
        installmentNumber: number | null;
        transferToMethodId: number | null;
        notes: string | null;
        tags: string | null;
        isRecurring: boolean;
    })[]>;
}
export {};
