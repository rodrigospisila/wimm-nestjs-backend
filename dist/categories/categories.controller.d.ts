import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(req: any, type?: string): Promise<({
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
        subCategories: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
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
    })[]>;
    getHierarchy(req: any, type?: string): Promise<({
        _count: {
            transactions: number;
        };
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
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
        subCategories: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
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
    update(req: any, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        _count: {
            transactions: number;
        };
        parentCategory: {
            name: string;
            id: number;
            color: string;
            icon: string;
        } | null;
        subCategories: {
            name: string;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string;
            icon: string;
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
    getSubcategories(req: any, id: number): Promise<({
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            paymentMethodId: number;
            categoryId: number;
            amount: number;
            date: Date;
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
