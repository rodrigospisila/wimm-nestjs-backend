import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentTransactionDto, InstallmentType } from './dto/create-installment-transaction.dto';
export declare class InstallmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createInstallmentTransaction(userId: number, createInstallmentDto: CreateInstallmentTransactionDto): Promise<{
        installment: ({
            category: {
                id: number;
                name: string;
                type: import("@prisma/client").$Enums.CategoryType;
                color: string;
                icon: string;
            };
            creditCard: {
                id: number;
                dueDay: number;
                name: string;
                userId: number;
                limit: number;
                closingDay: number;
                bankCode: string | null;
            } | null;
            transactions: {
                id: number;
                description: string;
                creditCardId: number;
                categoryId: number;
                amount: number;
                date: Date;
                installmentId: number | null;
            }[];
        } & {
            id: number;
            description: string;
            totalAmount: number;
            installmentCount: number;
            currentInstallment: number;
            creditCardId: number | null;
            categoryId: number;
            startDate: Date;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
            notes: string | null;
            tags: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }) | null;
        transactions: any[];
        summary: {
            totalAmount: number;
            installmentCount: number;
            installmentAmount: number;
            lastInstallmentAmount: number;
            installmentType: InstallmentType;
        };
    }>;
    findAllInstallments(userId: number, filters?: {
        categoryId?: number;
        walletId?: number;
        creditCardId?: number;
        status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
        limit?: number;
        offset?: number;
    }): Promise<{
        status: string;
        progress: number;
        paidInstallments: number;
        remainingInstallments: number;
        nextPaymentDate: Date | null;
        nextPaymentAmount: number | null;
        totalPaid: number;
        totalRemaining: number;
        category: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        creditCard: {
            id: number;
            dueDay: number;
            name: string;
            limit: number;
            closingDay: number;
        } | null;
        transactions: {
            id: number;
            description: string;
            amount: number;
            date: Date;
        }[];
        id: number;
        description: string;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        creditCardId: number | null;
        categoryId: number;
        startDate: Date;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        notes: string | null;
        tags: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOneInstallment(userId: number, id: number): Promise<{
        status: string;
        progress: number;
        paidInstallments: number;
        remainingInstallments: number;
        totalPaid: number;
        totalRemaining: number;
        category: {
            id: number;
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        creditCard: {
            id: number;
            dueDay: number;
            name: string;
            limit: number;
            closingDay: number;
        } | null;
        transactions: {
            id: number;
            description: string;
            amount: number;
            date: Date;
        }[];
        id: number;
        description: string;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        creditCardId: number | null;
        categoryId: number;
        startDate: Date;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        notes: string | null;
        tags: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancelInstallment(userId: number, id: number): Promise<{
        message: string;
    }>;
    getInstallmentStatistics(userId: number, filters?: {
        startDate?: string;
        endDate?: string;
        categoryId?: number;
    }): Promise<{
        totalInstallments: number;
        activeInstallments: number;
        completedInstallments: number;
        totalAmount: number;
        upcomingPayments: ({
            category: {
                id: number;
                name: string;
                color: string;
                icon: string;
            };
        } & {
            id: number;
            description: string;
            categoryId: number;
            walletId: number;
            type: import("@prisma/client").$Enums.TransactionType;
            userId: number;
            amount: number;
            date: Date;
            transferToWalletId: number | null;
        })[];
    }>;
}
