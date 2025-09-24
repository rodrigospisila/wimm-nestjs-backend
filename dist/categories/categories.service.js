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
    async findAllByUser(userId, type) {
        const where = { userId };
        if (type) {
            where.type = type;
        }
        return this.prisma.category.findMany({
            where,
            include: {
                parentCategory: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                        type: true,
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
    async getHierarchy(userId, type) {
        const where = { userId, parentCategoryId: null };
        if (type) {
            where.type = type;
        }
        return this.prisma.category.findMany({
            where,
            include: {
                subCategories: {
                    where: {},
                    orderBy: { name: 'asc' },
                },
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(userId, id) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId, },
            include: {
                parentCategory: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
                subCategories: {
                    where: {},
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                        type: true,
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
        const existingCategory = await this.findOne(userId, id);
        if (updateCategoryDto.parentCategoryId && updateCategoryDto.parentCategoryId !== existingCategory.parentCategoryId) {
            const parentCategory = await this.prisma.category.findFirst({
                where: {
                    id: updateCategoryDto.parentCategoryId,
                    userId,
                },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Categoria pai não encontrada');
            }
            if (updateCategoryDto.parentCategoryId === id) {
                throw new common_1.BadRequestException('Uma categoria não pode ser pai de si mesma');
            }
            const categoryType = updateCategoryDto.type || existingCategory.type;
            if (parentCategory.type !== categoryType) {
                throw new common_1.BadRequestException('Categoria filha deve ter o mesmo tipo da categoria pai');
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                parentCategory: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
                subCategories: {
                    where: {},
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                        type: true,
                    },
                },
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        const transactionsCount = await this.prisma.transaction.count({
            where: { categoryId: id },
        });
        if (transactionsCount > 0) {
            throw new common_1.BadRequestException('Não é possível excluir uma categoria que possui transações associadas.');
        }
        const subcategoriesCount = await this.prisma.category.count({
            where: { parentCategoryId: id, },
        });
        if (subcategoriesCount > 0) {
            throw new common_1.BadRequestException('Não é possível excluir uma categoria que possui subcategorias. Remova as subcategorias primeiro.');
        }
        return this.prisma.category.update({
            where: { id },
            data: {},
        });
    }
    async getSubcategories(userId, parentId) {
        await this.findOne(userId, parentId);
        return this.prisma.category.findMany({
            where: {
                parentCategoryId: parentId,
                userId,
            },
            include: {
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getCategoryStatistics(userId, categoryId, startDate, endDate) {
        await this.findOne(userId, categoryId);
        const where = {
            categoryId,
            userId,
        };
        if (startDate && endDate) {
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        const [transactions, totalAmount, transactionCount] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                include: {
                    paymentMethod: {
                        select: {
                            name: true,
                            type: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
                take: 10,
            }),
            this.prisma.transaction.aggregate({
                where,
                _sum: { amount: true },
            }),
            this.prisma.transaction.count({ where }),
        ]);
        return {
            categoryId,
            totalAmount: totalAmount._sum.amount || 0,
            transactionCount,
            recentTransactions: transactions,
        };
    }
    async getTypes() {
        const types = Object.values(client_1.CategoryType).map(type => ({
            value: type,
            label: this.getTypeLabel(type),
            description: this.getTypeDescription(type),
        }));
        return { types };
    }
    async createDefaults(userId) {
        const defaultCategories = [
            {
                name: 'Alimentação',
                type: client_1.CategoryType.EXPENSE,
                color: '#FF6B6B',
                icon: 'restaurant',
                subcategories: [
                    { name: 'Café', color: '#FF8E8E', icon: 'cafe' },
                    { name: 'Almoço', color: '#FFB3B3', icon: 'restaurant' },
                    { name: 'iFood', color: '#FFC9C9', icon: 'bicycle' },
                ],
            },
            {
                name: 'Mercado',
                type: client_1.CategoryType.EXPENSE,
                color: '#4CAF50',
                icon: 'storefront',
                subcategories: [
                    { name: 'Casa', color: '#66BB6A', icon: 'home' },
                ],
            },
            {
                name: 'Transporte',
                type: client_1.CategoryType.EXPENSE,
                color: '#4ECDC4',
                icon: 'car',
                subcategories: [
                    { name: 'Combustível', color: '#6ED4CC', icon: 'car-sport' },
                    { name: 'Uber/99', color: '#8EDCD6', icon: 'car' },
                    { name: 'Transporte Público', color: '#AEE4E0', icon: 'bus' },
                    { name: 'Estacionamento', color: '#CEEBE9', icon: 'location' },
                ],
            },
            {
                name: 'Moradia',
                type: client_1.CategoryType.EXPENSE,
                color: '#45B7D1',
                icon: 'home',
                subcategories: [
                    { name: 'Parcela', color: '#67C5D7', icon: 'home' },
                    { name: 'Luz', color: '#ABE1E3', icon: 'flash' },
                    { name: 'Água', color: '#CDEFE9', icon: 'water' },
                ],
            },
            {
                name: 'Saúde',
                type: client_1.CategoryType.EXPENSE,
                color: '#96CEB4',
                icon: 'medical',
                subcategories: [
                    { name: 'Plano de Saúde', color: '#A8D5C1', icon: 'shield-checkmark' },
                    { name: 'Médico', color: '#BADCCE', icon: 'person' },
                    { name: 'Farmácia', color: '#CCE3DB', icon: 'medical' },
                    { name: 'Exames', color: '#DEEAE8', icon: 'document-text' },
                ],
            },
            {
                name: 'Lazer',
                type: client_1.CategoryType.EXPENSE,
                color: '#FFEAA7',
                icon: 'game-controller',
                subcategories: [
                    { name: 'Cinema', color: '#FFECB3', icon: 'film' },
                    { name: 'Shows', color: '#FFEEBF', icon: 'musical-notes' },
                    { name: 'Viagens', color: '#FFF0CB', icon: 'airplane' },
                    { name: 'Streaming', color: '#FFF2D7', icon: 'tv' },
                ],
            },
            {
                name: 'Salário',
                type: client_1.CategoryType.INCOME,
                color: '#00B894',
                icon: 'card',
                subcategories: [
                    { name: 'Salário Principal', color: '#26C281', icon: 'card' },
                    { name: 'Hora Extra', color: '#4CCC6E', icon: 'time' },
                    { name: '13º Salário', color: '#72D65B', icon: 'gift' },
                    { name: 'Férias', color: '#98E048', icon: 'sunny' },
                ],
            },
            {
                name: 'Freelance',
                type: client_1.CategoryType.INCOME,
                color: '#6C5CE7',
                icon: 'laptop',
                subcategories: [
                    { name: 'Projetos', color: '#8B7BED', icon: 'code-slash' },
                    { name: 'Consultoria', color: '#A99AF3', icon: 'people' },
                    { name: 'Vendas', color: '#C7B9F9', icon: 'storefront' },
                ],
            },
            {
                name: 'Investimentos',
                type: client_1.CategoryType.INCOME,
                color: '#FD79A8',
                icon: 'trending-up',
                subcategories: [
                    { name: 'Dividendos', color: '#FE8FB5', icon: 'stats-chart' },
                    { name: 'Juros', color: '#FFA5C2', icon: 'calculator' },
                    { name: 'Rendimento', color: '#FFBBCF', icon: 'trending-up' },
                ],
            },
        ];
        const createdCategories = [];
        for (const categoryData of defaultCategories) {
            try {
                const existing = await this.prisma.category.findFirst({
                    where: {
                        userId,
                        name: categoryData.name,
                    },
                });
                if (!existing) {
                    const { subcategories, ...mainCategoryData } = categoryData;
                    const mainCategory = await this.prisma.category.create({
                        data: {
                            ...mainCategoryData,
                            userId,
                        },
                    });
                    createdCategories.push(mainCategory);
                    if (subcategories) {
                        for (const subCategoryData of subcategories) {
                            try {
                                const subCategory = await this.prisma.category.create({
                                    data: {
                                        ...subCategoryData,
                                        type: categoryData.type,
                                        parentCategoryId: mainCategory.id,
                                        userId,
                                    },
                                });
                                createdCategories.push(subCategory);
                            }
                            catch (error) {
                                console.error(`Erro ao criar subcategoria ${subCategoryData.name}:`, error);
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error(`Erro ao criar categoria ${categoryData.name}:`, error);
            }
        }
        return {
            message: `${createdCategories.length} categorias padrão criadas`,
            categories: createdCategories,
        };
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
            subcategories: childCategories.filter(child => child.parentCategoryId === parent.id),
        }));
        return hierarchical;
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
    getTypeLabel(type) {
        const labels = {
            [client_1.CategoryType.INCOME]: 'Receita',
            [client_1.CategoryType.EXPENSE]: 'Despesa',
        };
        return labels[type] || type;
    }
    getTypeDescription(type) {
        const descriptions = {
            [client_1.CategoryType.INCOME]: 'Categorias para receitas e ganhos',
            [client_1.CategoryType.EXPENSE]: 'Categorias para gastos e despesas',
        };
        return descriptions[type] || '';
    }
    getDefaultColor(type) {
        return type === client_1.CategoryType.INCOME ? '#00B894' : '#FF6B6B';
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