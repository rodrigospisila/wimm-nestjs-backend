import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createBudgetDto: CreateBudgetDto) {
    const { categoryId, subcategoryId, monthlyLimit, month, year } = createBudgetDto;

    // Verificar se a categoria pertence ao usuário
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se já existe orçamento para esta categoria/subcategoria no mês/ano
    const existingBudget = await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        subcategoryId: subcategoryId || null,
        month,
        year,
      },
    });

    if (existingBudget) {
      throw new BadRequestException('Já existe um orçamento para esta categoria neste período');
    }

    // Calcular gastos atuais do mês
    const currentSpent = await this.calculateCurrentSpent(userId, categoryId, subcategoryId || null, month, year);

    return this.prisma.budget.create({
      data: {
        userId,
        categoryId,
        subcategoryId,
        monthlyLimit,
        currentSpent,
        month,
        year,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });
  }

  async findAll(userId: number, month?: number, year?: number) {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        month: targetMonth,
        year: targetYear,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
      orderBy: {
        category: {
          name: 'asc',
        },
      },
    });

    // Atualizar gastos atuais para cada orçamento
    const updatedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const currentSpent = await this.calculateCurrentSpent(
          userId,
          budget.categoryId,
          budget.subcategoryId || null,
          targetMonth,
          targetYear
        );

        // Atualizar no banco se necessário
        if (Math.abs(currentSpent - budget.currentSpent) > 0.01) {
          await this.prisma.budget.update({
            where: { id: budget.id },
            data: { currentSpent },
          });
        }

        return {
          ...budget,
          currentSpent,
          percentage: budget.monthlyLimit > 0 ? (currentSpent / budget.monthlyLimit) * 100 : 0,
          remaining: budget.monthlyLimit - currentSpent,
          status: this.getBudgetStatus(currentSpent, budget.monthlyLimit),
        };
      })
    );

    return updatedBudgets;
  }

  async findOne(userId: number, id: number) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    const currentSpent = await this.calculateCurrentSpent(
      userId,
      budget.categoryId,
      budget.subcategoryId || null,
      budget.month,
      budget.year
    );

    return {
      ...budget,
      currentSpent,
      percentage: budget.monthlyLimit > 0 ? (currentSpent / budget.monthlyLimit) * 100 : 0,
      remaining: budget.monthlyLimit - currentSpent,
      status: this.getBudgetStatus(currentSpent, budget.monthlyLimit),
    };
  }

  async update(userId: number, id: number, updateBudgetDto: UpdateBudgetDto) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    const updatedBudget = await this.prisma.budget.update({
      where: { id },
      data: updateBudgetDto,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    const currentSpent = await this.calculateCurrentSpent(
      userId,
      updatedBudget.categoryId,
      updatedBudget.subcategoryId || null,
      updatedBudget.month,
      updatedBudget.year
    );

    return {
      ...updatedBudget,
      currentSpent,
      percentage: updatedBudget.monthlyLimit > 0 ? (currentSpent / updatedBudget.monthlyLimit) * 100 : 0,
      remaining: updatedBudget.monthlyLimit - currentSpent,
      status: this.getBudgetStatus(currentSpent, updatedBudget.monthlyLimit),
    };
  }

  async remove(userId: number, id: number) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    return this.prisma.budget.delete({
      where: { id },
    });
  }

  async getBudgetSummary(userId: number, month?: number, year?: number) {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const budgets = await this.findAll(userId, targetMonth, targetYear);

    const summary = {
      totalBudget: budgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0),
      totalSpent: budgets.reduce((sum, budget) => sum + budget.currentSpent, 0),
      totalRemaining: budgets.reduce((sum, budget) => sum + budget.remaining, 0),
      budgetCount: budgets.length,
      overBudgetCount: budgets.filter(budget => budget.status === 'OVER_BUDGET').length,
      warningCount: budgets.filter(budget => budget.status === 'WARNING').length,
      onTrackCount: budgets.filter(budget => budget.status === 'ON_TRACK').length,
      categories: budgets.map(budget => ({
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        categoryColor: budget.category.color,
        categoryIcon: budget.category.icon,
        budgetId: budget.id,
        monthlyLimit: budget.monthlyLimit,
        currentSpent: budget.currentSpent,
        percentage: budget.percentage,
        remaining: budget.remaining,
        status: budget.status,
      })),
    };

    return summary;
  }

  private async calculateCurrentSpent(
    userId: number,
    categoryId: number,
    subcategoryId: number | null,
    month: number,
    year: number
  ): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    let whereCondition: any = {
      userId,
      type: 'EXPENSE',
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (subcategoryId) {
      // Se é um orçamento de subcategoria, buscar apenas transações dessa subcategoria
      whereCondition.categoryId = categoryId;
      whereCondition.subcategoryId = subcategoryId;
    } else {
      // Se é um orçamento de categoria principal, incluir:
      // 1. Transações diretas da categoria principal (sem subcategoria)
      // 2. Transações de todas as subcategorias desta categoria
      
      // Buscar todas as subcategorias desta categoria
      const subcategories = await this.prisma.category.findMany({
        where: {
          parentCategoryId: categoryId,
          userId,
        },
        select: { id: true },
      });

      const subcategoryIds = subcategories.map(sub => sub.id);

      whereCondition.OR = [
        // Transações diretas da categoria principal
        {
          categoryId,
          subcategoryId: null,
        },
        // Transações das subcategorias
        ...(subcategoryIds.length > 0 ? [{
          categoryId: {
            in: subcategoryIds,
          },
          subcategoryId: {
            not: null,
          },
        }] : []),
      ];
    }

    const result = await this.prisma.transaction.aggregate({
      where: whereCondition,
      _sum: {
        amount: true,
      },
    });

    return Math.abs(result._sum.amount || 0);
  }

  private getBudgetStatus(currentSpent: number, monthlyLimit: number): string {
    const percentage = monthlyLimit > 0 ? (currentSpent / monthlyLimit) * 100 : 0;

    if (percentage >= 100) return 'OVER_BUDGET';
    if (percentage >= 80) return 'WARNING';
    return 'ON_TRACK';
  }
}
