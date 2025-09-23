import { WalletType } from '@prisma/client';
export declare class CreateWalletDto {
    name: string;
    initialBalance?: number;
    type?: WalletType;
    description?: string;
    color?: string;
    icon?: string;
    creditLimit?: number;
    closingDay?: number;
    dueDay?: number;
}
