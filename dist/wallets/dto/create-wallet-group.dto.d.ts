import { WalletGroupType } from '@prisma/client';
export declare class CreateWalletGroupDto {
    name: string;
    type: WalletGroupType;
    description?: string;
    color?: string;
    icon?: string;
    hasIntegratedPix?: boolean;
    hasWalletBalance?: boolean;
}
