import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createCategoryDto: CreateCategoryDto): Promise<{
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
    findAllByUser(userId: number, type?: string): Promise<({
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
    getHierarchy(userId: number, type?: string): Promise<({
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
    findOne(userId: number, id: number): Promise<{
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
    update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
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
    remove(userId: number, id: number): Promise<{
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
    getSubcategories(userId: number, parentId: number): Promise<({
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
    getCategoryStatistics(userId: number, categoryId: number, startDate?: Date, endDate?: Date): Promise<{
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
    getTypes(): Promise<{
        types: {
            value: "INCOME" | "EXPENSE";
            label: string;
            description: string;
        }[];
    }>;
    createDefaults(userId: number): Promise<{
        message: string;
        categories: any[];
    }>;
    findAll(userId: number, type?: string): Promise<({
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
    findHierarchical(userId: number, type?: string): Promise<{
        subcategories: ({
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
    }[]>;
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
    private getTypeLabel;
    private getTypeDescription;
    private getDefaultColor;
    private getDefaultIcon;
}
