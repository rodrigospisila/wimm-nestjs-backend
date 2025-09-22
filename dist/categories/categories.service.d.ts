import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '@prisma/client';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createCategoryDto: CreateCategoryDto): Promise<{
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
    findAll(userId: number, type?: CategoryType): Promise<({
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
    findHierarchical(userId: number, type?: CategoryType): Promise<{
        subCategories: ({
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
        })[];
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
        _count: {
            transactions: number;
        };
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
    }[]>;
    findOne(userId: number, id: number): Promise<{
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
            date: Date;
            amount: number;
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
    update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
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
    remove(userId: number, id: number): Promise<{
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
    getStatistics(userId: number, categoryId?: number): Promise<{
        categoryId: number;
        categoryName: string;
        categoryType: import("@prisma/client").$Enums.CategoryType | undefined;
        categoryColor: string | undefined;
        monthlyBudget: number | null | undefined;
        totalAmount: number;
        transactionCount: number;
        budgetUsagePercentage: number | null;
    }[]>;
    createDefaultCategories(userId: number): Promise<{
        message: string;
        categories: any[];
        summary: {
            total: number;
            income: number;
            expense: number;
        };
    }>;
    createDefaultSubcategories(userId: number): Promise<{
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
    private wouldCreateLoop;
    private getDefaultColor;
    private getDefaultIcon;
}
