import { CategoryType } from '@prisma/client';
export declare class CreateCategoryDto {
    name: string;
    type: CategoryType;
    description?: string;
    color?: string;
    icon?: string;
    monthlyBudget?: number;
    parentCategoryId?: number;
}
