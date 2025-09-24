export declare enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare class CreateTransactionDto {
    description: string;
    amount: number;
    type: TransactionType;
    categoryId: number;
    walletId: number;
    date?: string;
    notes?: string;
    location?: string;
    tags?: string;
}
