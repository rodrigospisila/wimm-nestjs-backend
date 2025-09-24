import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(req: any, type?: string): Promise<({
        parentCategory: {
            name: string;
            color: string;
            icon: string;
            id: number;
        } | null;
        subCategories: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
            id: number;
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
    })[]>;
    getHierarchy(req: any, type?: string): Promise<({
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
    })[]>;
    getTypes(): Promise<{
        types: {
            value: "INCOME" | "EXPENSE";
            label: string;
            description: string;
        }[];
    }>;
    createDefaults(req: any): Promise<{
        message: string;
        categories: any[];
    }>;
    findOne(req: any, id: number): Promise<{
        parentCategory: {
            name: string;
            color: string;
            icon: string;
            id: number;
        } | null;
        subCategories: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
            id: number;
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
    update(req: any, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        parentCategory: {
            name: string;
            color: string;
            icon: string;
            id: number;
        } | null;
        subCategories: {
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
            id: number;
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
    getSubcategories(req: any, id: number): Promise<({
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
    getCategoryStatistics(req: any, id: number, startDate?: string, endDate?: string): Promise<{
        categoryId: number;
        totalAmount: number;
        transactionCount: number;
        recentTransactions: ({
            paymentMethod: {
                name: string;
                type: import("@prisma/client").$Enums.PaymentMethodType;
            };
        } & {
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            amount: number;
            date: Date;
            paymentMethodId: number;
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
    }>;
}
