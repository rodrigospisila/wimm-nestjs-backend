import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '@prisma/client';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(req: any, createCategoryDto: CreateCategoryDto): Promise<{
        parentCategory: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        } | null;
        subCategories: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        }[];
        _count: {
            transactions: number;
        };
    } & {
        name: string;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        parentCategoryId: number | null;
        userId: number;
    }>;
    findAll(req: any, type?: CategoryType, hierarchical?: string): Promise<({
        parentCategory: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        } | null;
        subCategories: ({
            _count: {
                transactions: number;
            };
        } & {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        })[];
        _count: {
            transactions: number;
        };
    } & {
        name: string;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        parentCategoryId: number | null;
        userId: number;
    })[]>;
    getStatistics(req: any, categoryId?: number): Promise<{
        categoryId: number;
        categoryName: string;
        categoryType: import("@prisma/client").$Enums.CategoryType | undefined;
        categoryColor: string | undefined;
        monthlyBudget: number | null | undefined;
        totalAmount: number;
        transactionCount: number;
        budgetUsagePercentage: number | null;
    }[]>;
    createDefaultCategories(req: any): Promise<{
        message: string;
        categories: any[];
        summary: {
            total: number;
            income: number;
            expense: number;
        };
    }>;
    createDefaultSubcategories(req: any): Promise<{
        message: string;
        subcategories: any[];
        summary: {
            total: number;
            byParent: {
                parent: string;
                count: number;
            }[];
        };
    }>;
    findOne(req: any, id: number): Promise<{
        parentCategory: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        } | null;
        subCategories: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        }[];
        transactions: ({
            wallet: {
                name: string;
                type: import("@prisma/client").$Enums.WalletType;
                description: string | null;
                color: string;
                icon: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
                initialBalance: number;
                currentBalance: number;
                isActive: boolean;
            };
        } & {
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            id: number;
            userId: number;
            amount: number;
            date: Date;
            walletId: number;
            categoryId: number;
            transferToWalletId: number | null;
        })[];
        _count: {
            transactions: number;
        };
    } & {
        name: string;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        parentCategoryId: number | null;
        userId: number;
    }>;
    update(req: any, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        parentCategory: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        } | null;
        subCategories: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            parentCategoryId: number | null;
            userId: number;
        }[];
        _count: {
            transactions: number;
        };
    } & {
        name: string;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        parentCategoryId: number | null;
        userId: number;
    }>;
    remove(req: any, id: number): Promise<{
        name: string;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        parentCategoryId: number | null;
        userId: number;
    }>;
}
