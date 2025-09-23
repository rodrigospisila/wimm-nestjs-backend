import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentTransactionDto, InstallmentType } from './dto/create-installment-transaction.dto';
export declare class InstallmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createInstallmentTransaction(userId: number, createInstallmentDto: CreateInstallmentTransactionDto): Promise<{
        installment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            isActive: boolean;
            paymentMethodId: number;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            userId: number;
            startDate: Date;
            totalAmount: number;
            installmentCount: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
            currentInstallment: number;
        } | null;
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
        paidInstallments: any;
        remainingInstallments: any;
        nextPaymentDate: any;
        nextPaymentAmount: any;
        totalPaid: any;
        totalRemaining: any;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        paymentMethodId: number;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        userId: number;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        currentInstallment: number;
    }[]>;
    findOneInstallment(userId: number, id: number): Promise<{
        status: string;
        progress: number;
        paidInstallments: any;
        remainingInstallments: any;
        totalPaid: any;
        totalRemaining: any;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        paymentMethodId: number;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        userId: number;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
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
    }>;
}
