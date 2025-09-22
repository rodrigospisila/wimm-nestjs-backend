import { WalletType } from '@prisma/client';
export declare class UpdateWalletDto {
    name?: string;
    currentBalance?: number;
    type?: WalletType;
    description?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
}
