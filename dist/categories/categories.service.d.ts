import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
    findAllByUser(userId: number, type?: string): Promise<({
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
    getHierarchy(userId: number, type?: string): Promise<({
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
    findOne(userId: number, id: number): Promise<{
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
    update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
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
    getSubcategories(userId: number, parentId: number): Promise<({
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
    findHierarchical(userId: number, type?: string): Promise<{
        subcategories: ({
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
