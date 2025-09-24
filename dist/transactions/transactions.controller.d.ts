import { TransactionsService } from './transactions.service';
import { InstallmentsService } from './installments.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly installmentsService;
    constructor(transactionsService: TransactionsService, installmentsService: InstallmentsService);
    findAll(req: any, startDate?: string, endDate?: string, categoryId?: string, paymentMethodId?: string, type?: string, page?: string, limit?: string): Promise<{
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
    getSummary(req: any, startDate?: string, endDate?: string): Promise<{
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
    getRecent(req: any, limit?: string): Promise<({
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
    findOne(req: any, id: number): Promise<{
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
    create(req: any, createTransactionDto: CreateTransactionDto): Promise<{
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
    update(req: any, id: number, updateTransactionDto: UpdateTransactionDto): Promise<{
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
    remove(req: any, id: number): Promise<{
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
    createInstallment(req: any, createInstallmentDto: CreateInstallmentDto): Promise<{
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
            startDate: Date;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            totalAmount: number;
            installmentCount: number;
            currentInstallment: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
        };
        transactions: any[];
        message: string;
    }>;
    getInstallments(req: any, status?: string, paymentMethodId?: string): Promise<({
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
        startDate: Date;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    })[]>;
    getInstallment(req: any, id: number): Promise<{
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
        startDate: Date;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    }>;
    payInstallment(req: any, id: number, paymentData: {
        installmentNumber: number;
        paidAmount?: number;
    }): Promise<{
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
            startDate: Date;
            categoryId: number;
            subcategoryId: number | null;
            notes: string | null;
            tags: string | null;
            totalAmount: number;
            installmentCount: number;
            currentInstallment: number;
            installmentType: import("@prisma/client").$Enums.InstallmentType;
        };
    }>;
    removeInstallment(req: any, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        userId: number;
        paymentMethodId: number;
        startDate: Date;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        totalAmount: number;
        installmentCount: number;
        currentInstallment: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
    }>;
    createTransfer(req: any, transferData: {
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
}
