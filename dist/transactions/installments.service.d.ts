import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentTransactionDto, InstallmentType } from './dto/create-installment-transaction.dto';
export declare class InstallmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createInstallmentTransaction(userId: number, createInstallmentDto: CreateInstallmentTransactionDto): Promise<{
        installment: ({
            category: {
                name: string;
                id: number;
                type: import("@prisma/client").$Enums.CategoryType;
                color: string;
                icon: string;
            };
            creditCard: {
                name: string;
                id: number;
                userId: number;
                limit: number;
                dueDay: number;
                closingDay: number;
                bankCode: string | null;
            } | null;
            transactions: {
                id: number;
                description: string;
                date: Date;
                amount: number;
                categoryId: number;
                creditCardId: number;
                installmentId: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            categoryId: number;
            notes: string | null;
            tags: string | null;
            startDate: Date;
            totalAmount: number;
            installmentCount: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
            creditCardId: number | null;
            currentInstallment: number;
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
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        creditCard: {
            name: string;
            id: number;
            limit: number;
            dueDay: number;
            closingDay: number;
        } | null;
        transactions: {
            id: number;
            description: string;
            date: Date;
            amount: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        creditCardId: number | null;
        currentInstallment: number;
    }[]>;
    findOneInstallment(userId: number, id: number): Promise<{
        status: string;
        progress: number;
        paidInstallments: number;
        remainingInstallments: number;
        totalPaid: number;
        totalRemaining: number;
        category: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
        };
        creditCard: {
            name: string;
            id: number;
            limit: number;
            dueDay: number;
            closingDay: number;
        } | null;
        transactions: {
            id: number;
            description: string;
            date: Date;
            amount: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        creditCardId: number | null;
        currentInstallment: number;
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
                name: string;
                id: number;
                color: string;
                icon: string;
            };
        } & {
            id: number;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            date: Date;
            amount: number;
            walletId: number;
            categoryId: number;
            transferToWalletId: number | null;
        })[];
    }>;
}
