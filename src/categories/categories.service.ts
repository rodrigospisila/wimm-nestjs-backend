import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createCategoryDto: CreateCategoryDto) {
    // Verificar se a categoria pai existe (se fornecida)
    if (createCategoryDto.parentCategoryId) {
      const parentCategory = await this.prisma.category.findFirst({
        where: {
          id: createCategoryDto.parentCategoryId,
          userId,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('Categoria pai não encontrada');
      }

      // Verificar se a categoria pai tem o mesmo tipo
      if (parentCategory.type !== createCategoryDto.type) {
        throw new BadRequestException('Categoria filha deve ter o mesmo tipo da categoria pai');
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

  async findAll(userId: number, type?: CategoryType) {
    const where: any = { userId };
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

  async findHierarchical(userId: number, type?: CategoryType) {
    const categories = await this.findAll(userId, type);
    
    // Separar categorias pai das filhas
    const parentCategories = categories.filter(cat => !cat.parentCategoryId);
    const childCategories = categories.filter(cat => cat.parentCategoryId);

    // Organizar hierarquicamente
    const hierarchical = parentCategories.map(parent => ({
      ...parent,
      subCategories: childCategories.filter(child => child.parentCategoryId === parent.id),
    }));

    return hierarchical;
  }

  async findOne(userId: number, id: number) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      include: {
        parentCategory: true,
        subCategories: true,
        transactions: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            wallet: true,
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
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(userId: number, id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(userId, id);

    // Verificar se está tentando definir uma categoria pai
    if (updateCategoryDto.parentCategoryId) {
      // Não pode ser pai de si mesmo
      if (updateCategoryDto.parentCategoryId === id) {
        throw new BadRequestException('Uma categoria não pode ser pai de si mesma');
      }

      // Verificar se a categoria pai existe
      const parentCategory = await this.prisma.category.findFirst({
        where: {
          id: updateCategoryDto.parentCategoryId,
          userId,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException('Categoria pai não encontrada');
      }

      // Verificar se não criaria um loop
      if (await this.wouldCreateLoop(userId, id, updateCategoryDto.parentCategoryId)) {
        throw new BadRequestException('Esta operação criaria um loop na hierarquia');
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

  async remove(userId: number, id: number) {
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
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se tem subcategorias
    if (category.subCategories.length > 0) {
      throw new BadRequestException('Não é possível excluir uma categoria que possui subcategorias');
    }

    // Verificar se tem transações
    if (category._count.transactions > 0) {
      throw new BadRequestException('Não é possível excluir uma categoria que possui transações');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getStatistics(userId: number, categoryId?: number) {
    const where: any = { userId };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Estatísticas do mês atual
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

    // Buscar informações das categorias
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

    // Combinar estatísticas com informações das categorias
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

  async createDefaultCategories(userId: number) {
    // Verificar se o usuário já possui categorias
    const existingCategories = await this.prisma.category.findMany({
      where: { userId },
    });

    if (existingCategories.length > 0) {
      throw new BadRequestException('Usuário já possui categorias criadas');
    }

    const defaultCategories = [
      // Categorias de Receita
      { name: 'Salário', type: CategoryType.INCOME, color: '#4CAF50', icon: 'work' },
      { name: 'Freelance', type: CategoryType.INCOME, color: '#8BC34A', icon: 'computer' },
      { name: 'Investimentos', type: CategoryType.INCOME, color: '#CDDC39', icon: 'trending-up' },
      { name: 'Vendas', type: CategoryType.INCOME, color: '#9CCC65', icon: 'store' },
      { name: 'Outros', type: CategoryType.INCOME, color: '#FFC107', icon: 'attach-money' },

      // Categorias de Despesa
      { name: 'Alimentação', type: CategoryType.EXPENSE, color: '#FF9800', icon: 'restaurant' },
      { name: 'Transporte', type: CategoryType.EXPENSE, color: '#FF5722', icon: 'directions-car' },
      { name: 'Moradia', type: CategoryType.EXPENSE, color: '#795548', icon: 'home' },
      { name: 'Saúde', type: CategoryType.EXPENSE, color: '#F44336', icon: 'local-hospital' },
      { name: 'Educação', type: CategoryType.EXPENSE, color: '#9C27B0', icon: 'school' },
      { name: 'Lazer', type: CategoryType.EXPENSE, color: '#E91E63', icon: 'movie' },
      { name: 'Compras', type: CategoryType.EXPENSE, color: '#3F51B5', icon: 'shopping-cart' },
      { name: 'Serviços', type: CategoryType.EXPENSE, color: '#00BCD4', icon: 'build' },
      { name: 'Impostos', type: CategoryType.EXPENSE, color: '#FF7043', icon: 'account-balance' },
      { name: 'Outros', type: CategoryType.EXPENSE, color: '#607D8B', icon: 'more-horiz' },
    ];

    const createdCategories: any[] = [];
    
    // Usar transação para garantir consistência
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
        income: createdCategories.filter(cat => cat.type === CategoryType.INCOME).length,
        expense: createdCategories.filter(cat => cat.type === CategoryType.EXPENSE).length,
      },
    };
  }

  async createDefaultSubcategories(userId: number) {
    // Buscar categorias principais do usuário
    const parentCategories = await this.prisma.category.findMany({
      where: { 
        userId,
        parentCategoryId: null,
      },
    });

    if (parentCategories.length === 0) {
      throw new BadRequestException('Usuário deve ter categorias principais antes de criar subcategorias');
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

    const createdSubcategories: any[] = [];

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

  private async wouldCreateLoop(userId: number, categoryId: number, parentId: number): Promise<boolean> {
    let currentParentId: number | null = parentId;
    
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

  private getDefaultColor(type: CategoryType): string {
    return type === CategoryType.INCOME ? '#4CAF50' : '#FF5722';
  }

  private getDefaultIcon(type: CategoryType): string {
    return type === CategoryType.INCOME ? 'trending-up' : 'trending-down';
  }
}
