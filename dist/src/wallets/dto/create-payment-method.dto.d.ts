export declare class CreatePaymentMethodDto {
    name: string;
    type: string;
    currentBalance?: number;
    creditLimit?: number;
    closingDay?: number;
    dueDay?: number;
    accountNumber?: string;
    agency?: string;
    bankCode?: string;
    isPrimary?: boolean;
    color?: string;
    icon?: string;
    walletGroupId?: number;
}
