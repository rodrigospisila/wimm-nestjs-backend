import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    description: string;
    amount: number;
    date?: string;
    type: TransactionType;
    categoryId: number;
    paymentMethodId: number;
    notes?: string;
    installmentId?: number;
    installmentNumber?: number;
}
