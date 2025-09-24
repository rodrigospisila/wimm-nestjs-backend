export declare enum InstallmentType {
    FIXED = "FIXED",
    CREDIT_CARD = "CREDIT_CARD"
}
export declare class CreateInstallmentTransactionDto {
    description: string;
    totalAmount: number;
    installmentCount: number;
    installmentType: InstallmentType;
    categoryId: number;
    walletId: number;
    creditCardId?: number;
    startDate?: string;
    notes?: string;
    tags?: string;
    dueDay?: number;
}
