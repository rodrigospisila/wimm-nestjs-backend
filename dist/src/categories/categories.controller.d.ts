import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(req: any, createCategoryDto: CreateCategoryDto): Promise<{
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
    findAll(req: any, type?: string, hierarchical?: string): Promise<{
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
    update(req: any, id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
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
    remove(req: any, id: number): Promise<{
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
}
