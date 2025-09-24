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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
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
                monthlyBudget: number | null;
                parentCategoryId: number | null;
                userId: number;
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
                monthlyBudget: number | null;
                parentCategoryId: number | null;
                userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
        })[];
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.CategoryType;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }[]>;
    findOne(userId: number, id: number): Promise<{
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
                    userId: number;
                    isActive: boolean;
                    hasIntegratedPix: boolean;
                    hasWalletBalance: boolean;
                } | null;
            } & {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.PaymentMethodType;
                color: string;
                icon: string;
                userId: number;
                currentBalance: number;
                creditLimit: number | null;
                closingDay: number | null;
                dueDay: number | null;
                availableLimit: number | null;
                accountNumber: string | null;
                agency: string | null;
                bankCode: string | null;
                isActive: boolean;
                isPrimary: boolean;
                walletGroupId: number | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.TransactionType;
            description: string;
            userId: number;
            date: Date;
            amount: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }>;
    update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
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
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
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
        monthlyBudget: number | null;
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
