import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createCategoryDto: CreateCategoryDto): Promise<{
        createdAt: Date;
        id: number;
        type: import("@prisma/client").$Enums.CategoryType;
        name: string;
        updatedAt: Date;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }>;
    findAll(userId: number, type?: string): Promise<{
        createdAt: Date;
        id: number;
        type: import("@prisma/client").$Enums.CategoryType;
        name: string;
        updatedAt: Date;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }[]>;
    findHierarchical(userId: number, type?: string): Promise<{
        subcategories: {
            createdAt: Date;
            id: number;
            type: import("@prisma/client").$Enums.CategoryType;
            name: string;
            updatedAt: Date;
            description: string | null;
            color: string;
            icon: string;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
            userId: number;
        }[];
        createdAt: Date;
        id: number;
        type: import("@prisma/client").$Enums.CategoryType;
        name: string;
        updatedAt: Date;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }[]>;
    findOne(userId: number, id: number): Promise<{
        createdAt: Date;
        id: number;
        type: import("@prisma/client").$Enums.CategoryType;
        name: string;
        updatedAt: Date;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }>;
    update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        createdAt: Date;
        id: number;
        type: import("@prisma/client").$Enums.CategoryType;
        name: string;
        updatedAt: Date;
        description: string | null;
        color: string;
        icon: string;
        monthlyBudget: number | null;
        parentCategoryId: number | null;
        userId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        createdAt: Date;
        id: number;
        type: import("@prisma/client").$Enums.CategoryType;
        name: string;
        updatedAt: Date;
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
