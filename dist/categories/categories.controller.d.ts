import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '@prisma/client';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(req: any, createCategoryDto: CreateCategoryDto): Promise<{
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        } | null;
        subCategories: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        userId: number;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
    }>;
    findAll(req: any, type?: CategoryType, hierarchical?: string): Promise<({
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        } | null;
        subCategories: ({
            _count: {
                transactions: number;
            };
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        })[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        userId: number;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
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
        transactions: ({
            paymentMethod: {
                walletGroup: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    type: import("@prisma/client").$Enums.WalletGroupType;
                    description: string | null;
                    color: string;
                    icon: string;
                    hasIntegratedPix: boolean;
                    hasWalletBalance: boolean;
                    isActive: boolean;
                    userId: number;
                } | null;
            } & {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
                icon: string;
                isActive: boolean;
                userId: number;
                isPrimary: boolean;
                walletGroupId: number | null;
                currentBalance: number;
                creditLimit: number | null;
                closingDay: number | null;
                dueDay: number | null;
                accountNumber: string | null;
                agency: string | null;
                bankCode: string | null;
                availableLimit: number | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            paymentMethodId: number;
            amount: number;
            date: Date;
            categoryId: number;
            subcategoryId: number | null;
            creditCardBillId: number | null;
            installmentId: number | null;
            installmentNumber: number | null;
            transferToMethodId: number | null;
            notes: string | null;
            tags: string | null;
            isRecurring: boolean;
        })[];
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        } | null;
        subCategories: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        userId: number;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
    }>;
    update(req: any, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        } | null;
        subCategories: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        userId: number;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
    }>;
    remove(req: any, id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        userId: number;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
    }>;
}
