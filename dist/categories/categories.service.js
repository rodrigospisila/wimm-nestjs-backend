"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createCategoryDto) {
        if (createCategoryDto.parentCategoryId) {
            const parentCategory = await this.prisma.category.findFirst({
                where: {
                    id: createCategoryDto.parentCategoryId,
                    userId,
                },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Categoria pai não encontrada');
            }
            if (parentCategory.type !== createCategoryDto.type) {
                throw new common_1.BadRequestException('Categoria filha deve ter o mesmo tipo da categoria pai');
            }
        }
        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                userId,
                color: createCategoryDto.color || this.getDefaultColor(createCategoryDto.type),
                icon: createCategoryDto.icon || this.getDefaultIcon(createCategoryDto.type),
            },
            include: {
                parentCategory: true,
                subCategories: true,
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });
    }
    async findAll(userId, type) {
        const where = { userId };
        if (type) {
            where.type = type;
        }
        return this.prisma.category.findMany({
            where,
            include: {
                parentCategory: true,
                subCategories: {
                    include: {
                        _count: {
                            select: {
                                transactions: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
            orderBy: [
                { parentCategoryId: 'asc' },
                { name: 'asc' },
            ],
        });
    }
    async findHierarchical(userId, type) {
        const categories = await this.findAll(userId, type);
        const parentCategories = categories.filter(cat => !cat.parentCategoryId);
        const childCategories = categories.filter(cat => cat.parentCategoryId);
        const hierarchical = parentCategories.map(parent => ({
            ...parent,
            subCategories: childCategories.filter(child => child.parentCategoryId === parent.id),
        }));
        return hierarchical;
    }
    async findOne(userId, id) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId },
            include: {
                parentCategory: true,
                subCategories: true,
                transactions: {
                    take: 10,
                    orderBy: { date: 'desc' },
                    include: {
                        paymentMethod: {
                            include: {
                                walletGroup: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoria não encontrada');
        }
        return category;
    }
    async update(userId, id, updateCategoryDto) {
        const category = await this.findOne(userId, id);
        if (updateCategoryDto.parentCategoryId) {
            if (updateCategoryDto.parentCategoryId === id) {
                throw new common_1.BadRequestException('Uma categoria não pode ser pai de si mesma');
            }
            const parentCategory = await this.prisma.category.findFirst({
                where: {
                    id: updateCategoryDto.parentCategoryId,
                    userId,
                },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Categoria pai não encontrada');
            }
            if (await this.wouldCreateLoop(userId, id, updateCategoryDto.parentCategoryId)) {
                throw new common_1.BadRequestException('Esta operação criaria um loop na hierarquia');
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                parentCategory: true,
                subCategories: true,
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });
    }
    async remove(userId, id) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId },
            include: {
                subCategories: true,
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoria não encontrada');
        }
        if (category.subCategories.length > 0) {
            throw new common_1.BadRequestException('Não é possível excluir uma categoria que possui subcategorias');
        }
        if (category._count.transactions > 0) {
            throw new common_1.BadRequestException('Não é possível excluir uma categoria que possui transações');
        }
        return this.prisma.category.delete({
            where: { id },
        });
    }
    async getStatistics(userId, categoryId) {
        const where = { userId };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const monthlyStats = await this.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                ...where,
                createdAt: {
                    gte: currentMonth,
                    lt: nextMonth,
                },
            },
            _sum: {
                amount: true,
            },
            _count: true,
        });
        const categoriesInfo = await this.prisma.category.findMany({
            where: {
                userId,
                id: {
                    in: monthlyStats.map(stat => stat.categoryId).filter(Boolean),
                },
            },
            select: {
                id: true,
                name: true,
                type: true,
                color: true,
                monthlyBudget: true,
            },
        });
        const result = monthlyStats.map(stat => {
            const categoryInfo = categoriesInfo.find(cat => cat.id === stat.categoryId);
            return {
                categoryId: stat.categoryId,
                categoryName: categoryInfo?.name || 'Sem categoria',
                categoryType: categoryInfo?.type,
                categoryColor: categoryInfo?.color,
                monthlyBudget: categoryInfo?.monthlyBudget,
                totalAmount: stat._sum.amount || 0,
                transactionCount: stat._count,
                budgetUsagePercentage: categoryInfo?.monthlyBudget
                    ? ((stat._sum.amount || 0) / categoryInfo.monthlyBudget) * 100
                    : null,
            };
        });
        return result;
    }
    async createDefaultCategories(userId) {
        const existingCategories = await this.prisma.category.findMany({
            where: { userId },
        });
        if (existingCategories.length > 0) {
            throw new common_1.BadRequestException('Usuário já possui categorias criadas');
        }
        const defaultCategories = [
            { name: 'Salário', type: client_1.CategoryType.INCOME, color: '#4CAF50', icon: 'work' },
            { name: 'Freelance', type: client_1.CategoryType.INCOME, color: '#8BC34A', icon: 'computer' },
            { name: 'Investimentos', type: client_1.CategoryType.INCOME, color: '#CDDC39', icon: 'trending-up' },
            { name: 'Vendas', type: client_1.CategoryType.INCOME, color: '#9CCC65', icon: 'store' },
            { name: 'Outros', type: client_1.CategoryType.INCOME, color: '#FFC107', icon: 'attach-money' },
            { name: 'Alimentação', type: client_1.CategoryType.EXPENSE, color: '#FF9800', icon: 'restaurant' },
            { name: 'Transporte', type: client_1.CategoryType.EXPENSE, color: '#FF5722', icon: 'directions-car' },
            { name: 'Moradia', type: client_1.CategoryType.EXPENSE, color: '#795548', icon: 'home' },
            { name: 'Saúde', type: client_1.CategoryType.EXPENSE, color: '#F44336', icon: 'local-hospital' },
            { name: 'Educação', type: client_1.CategoryType.EXPENSE, color: '#9C27B0', icon: 'school' },
            { name: 'Lazer', type: client_1.CategoryType.EXPENSE, color: '#E91E63', icon: 'movie' },
            { name: 'Compras', type: client_1.CategoryType.EXPENSE, color: '#3F51B5', icon: 'shopping-cart' },
            { name: 'Serviços', type: client_1.CategoryType.EXPENSE, color: '#00BCD4', icon: 'build' },
            { name: 'Impostos', type: client_1.CategoryType.EXPENSE, color: '#FF7043', icon: 'account-balance' },
            { name: 'Outros', type: client_1.CategoryType.EXPENSE, color: '#607D8B', icon: 'more-horiz' },
        ];
        const createdCategories = [];
        await this.prisma.$transaction(async (prisma) => {
            for (const category of defaultCategories) {
                const created = await prisma.category.create({
                    data: {
                        ...category,
                        userId,
                    },
                    include: {
                        parentCategory: true,
                        subCategories: true,
                        _count: {
                            select: {
                                transactions: true,
                            },
                        },
                    },
                });
                createdCategories.push(created);
            }
        });
        return {
            message: 'Categorias padrão criadas com sucesso',
            categories: createdCategories,
            summary: {
                total: createdCategories.length,
                income: createdCategories.filter(cat => cat.type === client_1.CategoryType.INCOME).length,
                expense: createdCategories.filter(cat => cat.type === client_1.CategoryType.EXPENSE).length,
            },
        };
    }
    async createDefaultSubcategories(userId) {
        const parentCategories = await this.prisma.category.findMany({
            where: {
                userId,
                parentCategoryId: null,
            },
        });
        if (parentCategories.length === 0) {
            throw new common_1.BadRequestException('Usuário deve ter categorias principais antes de criar subcategorias');
        }
        const subcategoriesMap = {
            'Alimentação': [
                { name: 'Supermercado', color: '#FF8A65', icon: 'shopping-basket' },
                { name: 'Restaurantes', color: '#FF7043', icon: 'restaurant-menu' },
                { name: 'Delivery', color: '#FF5722', icon: 'delivery-dining' },
                { name: 'Lanchonete', color: '#FF6F00', icon: 'fastfood' },
            ],
            'Transporte': [
                { name: 'Combustível', color: '#FF7043', icon: 'local-gas-station' },
                { name: 'Transporte Público', color: '#FF5722', icon: 'directions-bus' },
                { name: 'Uber/Taxi', color: '#FF3D00', icon: 'local-taxi' },
                { name: 'Manutenção', color: '#BF360C', icon: 'build' },
            ],
            'Moradia': [
                { name: 'Aluguel', color: '#8D6E63', icon: 'home' },
                { name: 'Condomínio', color: '#795548', icon: 'apartment' },
                { name: 'Energia', color: '#6D4C41', icon: 'flash-on' },
                { name: 'Água', color: '#5D4037', icon: 'water-drop' },
                { name: 'Internet', color: '#4E342E', icon: 'wifi' },
            ],
            'Saúde': [
                { name: 'Médico', color: '#E57373', icon: 'medical-services' },
                { name: 'Farmácia', color: '#F44336', icon: 'local-pharmacy' },
                { name: 'Dentista', color: '#D32F2F', icon: 'dentistry' },
                { name: 'Exames', color: '#C62828', icon: 'biotech' },
            ],
            'Lazer': [
                { name: 'Cinema', color: '#EC407A', icon: 'movie' },
                { name: 'Viagens', color: '#E91E63', icon: 'flight' },
                { name: 'Esportes', color: '#C2185B', icon: 'sports' },
                { name: 'Hobbies', color: '#AD1457', icon: 'palette' },
            ],
        };
        const createdSubcategories = [];
        await this.prisma.$transaction(async (prisma) => {
            for (const parentCategory of parentCategories) {
                const subcategories = subcategoriesMap[parentCategory.name];
                if (subcategories) {
                    for (const subcategory of subcategories) {
                        const created = await prisma.category.create({
                            data: {
                                ...subcategory,
                                type: parentCategory.type,
                                parentCategoryId: parentCategory.id,
                                userId,
                            },
                            include: {
                                parentCategory: true,
                                subCategories: true,
                                _count: {
                                    select: {
                                        transactions: true,
                                    },
                                },
                            },
                        });
                        createdSubcategories.push(created);
                    }
                }
            }
        });
        return {
            message: 'Subcategorias padrão criadas com sucesso',
            subcategories: createdSubcategories,
            summary: {
                total: createdSubcategories.length,
                byParent: Object.entries(subcategoriesMap).map(([parent, subs]) => ({
                    parent,
                    count: subs.length,
                })),
            },
        };
    }
    async wouldCreateLoop(userId, categoryId, parentId) {
        let currentParentId = parentId;
        while (currentParentId) {
            if (currentParentId === categoryId) {
                return true;
            }
            const parent = await this.prisma.category.findFirst({
                where: { id: currentParentId, userId },
                select: { parentCategoryId: true },
            });
            currentParentId = parent?.parentCategoryId || null;
        }
        return false;
    }
    getDefaultColor(type) {
        return type === client_1.CategoryType.INCOME ? '#4CAF50' : '#FF5722';
    }
    getDefaultIcon(type) {
        return type === client_1.CategoryType.INCOME ? 'trending-up' : 'trending-down';
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map