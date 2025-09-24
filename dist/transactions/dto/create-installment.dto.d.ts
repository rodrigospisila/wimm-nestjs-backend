import { InstallmentType } from '@prisma/client';
export declare class CreateInstallmentDto {
    description: string;
    totalAmount: number;
    installmentCount: number;
    startDate?: string;
    installmentType: InstallmentType;
    categoryId: number;
    paymentMethodId: number;
    notes?: string;
}
