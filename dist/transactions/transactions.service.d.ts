import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
interface TransactionFilters {
    startDate?: Date;
    endDate?: Date;
    categoryId?: number;
    paymentMethodId?: number;
    type?: TransactionType;
}
interface Pagination {
    page: number;
    limit: number;
}
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: number, filters?: TransactionFilters, pagination?: Pagination): Promise<{
        transactions: ({
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
            installment: {
                id: number;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
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
        installment: {
            id: number;
            totalAmount: number;
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
    }>;
    create(userId: number, createTransactionDto: CreateTransactionDto): Promise<{
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
    }>;
    update(userId: number, id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
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
    }>;
    remove(userId: number, id: number): Promise<{
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
    }>;
    getSummary(userId: number, startDate?: Date, endDate?: Date): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
        topCategories: {
            categoryId: number;
            name: string;
            color: string;
            icon: string;
            type: import("@prisma/client").$Enums.CategoryType;
            amount: number;
            transactionCount: number;
        }[];
    }>;
    getRecent(userId: number, limit?: number): Promise<({
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
    createTransfer(userId: number, transferData: {
        description: string;
        amount: number;
        fromPaymentMethodId: number;
        toPaymentMethodId: number;
        date?: string;
    }): Promise<{
        outTransaction: {
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
        };
        inTransaction: {
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
        };
        message: string;
    }>;
    private updatePaymentMethodBalance;
    private getTopCategories;
}
export {};
