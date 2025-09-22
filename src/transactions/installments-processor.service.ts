import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstallmentsProcessorService {
  private readonly logger = new Logger(InstallmentsProcessorService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Executa diariamente às 6:00 AM para processar parcelas vencidas
   * TODO: Adicionar @Cron(CronExpression.EVERY_DAY_AT_6AM) quando @nestjs/schedule estiver instalado
   */
  async processInstallments() {
    this.logger.log('Iniciando processamento de parcelas...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar todas as parcelas ativas
      const activeInstallments = await this.prisma.installment.findMany({
        where: {
          isActive: true,
          currentInstallment: {
            lt: this.prisma.installment.fields.installmentCount,
          },
        },
        include: {
          category: true,
          creditCard: true,
          transactions: {
            orderBy: { date: 'asc' },
          },
        },
      });

      this.logger.log(`Encontradas ${activeInstallments.length} parcelas ativas para processar`);

      for (const installment of activeInstallments) {
        await this.processInstallment(installment, today);
      }

      this.logger.log('Processamento de parcelas concluído');
    } catch (error) {
      this.logger.error('Erro ao processar parcelas:', error);
    }
  }

  /**
   * Processa uma parcela específica
   */
  private async processInstallment(installment: any, today: Date) {
    try {
      // Buscar transações que venceram hoje ou antes
      const dueTransactions = installment.transactions.filter((transaction: any) => {
        const transactionDate = new Date(transaction.date);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate <= today;
      });

      // Contar quantas parcelas já venceram
      const dueCount = dueTransactions.length;

      // Se há parcelas vencidas que ainda não foram processadas
      if (dueCount > installment.currentInstallment) {
        const newCurrentInstallment = dueCount;

        // Atualizar o status da parcela
        await this.prisma.installment.update({
          where: { id: installment.id },
          data: {
            currentInstallment: newCurrentInstallment,
            // Se todas as parcelas foram processadas, marcar como inativa
            isActive: newCurrentInstallment < installment.installmentCount,
          },
        });

        // Se é uma parcela de cartão de crédito, processar fatura
        if (installment.installmentType === 'CREDIT_CARD' && installment.creditCardId) {
          await this.processCreditCardInstallment(installment, dueTransactions.slice(installment.currentInstallment));
        }

        // Se é uma parcela fixa, debitar da carteira
        if (installment.installmentType === 'FIXED') {
          await this.processFixedInstallment(installment, dueTransactions.slice(installment.currentInstallment));
        }

        this.logger.log(
          `Parcela ${installment.id} processada: ${installment.currentInstallment} -> ${newCurrentInstallment}`
        );

        // Verificar se a parcela foi concluída
        if (newCurrentInstallment >= installment.installmentCount) {
          this.logger.log(`Parcela ${installment.id} concluída`);
          await this.onInstallmentCompleted(installment);
        }
      }
    } catch (error) {
      this.logger.error(`Erro ao processar parcela ${installment.id}:`, error);
    }
  }

  /**
   * Processa parcelas de cartão de crédito
   */
  private async processCreditCardInstallment(installment: any, newTransactions: any[]) {
    try {
      for (const transaction of newTransactions) {
        // Criar transação na fatura do cartão
        await this.prisma.cardTransaction.create({
          data: {
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            creditCardId: installment.creditCardId,
            categoryId: installment.categoryId,
            installmentId: installment.id,
          },
        });

        this.logger.log(
          `Transação de cartão criada para parcela ${installment.id}: R$ ${transaction.amount}`
        );
      }
    } catch (error) {
      this.logger.error(`Erro ao processar parcela de cartão ${installment.id}:`, error);
    }
  }

  /**
   * Processa parcelas fixas (debita da carteira)
   */
  private async processFixedInstallment(installment: any, newTransactions: any[]) {
    try {
      // Para parcelas fixas, precisamos encontrar a carteira associada
      // Como não temos walletId no installment, vamos buscar na primeira transação
      const firstTransaction = await this.prisma.transaction.findFirst({
        where: {
          id: installment.transactions[0]?.id,
        },
      });

      if (!firstTransaction) {
        this.logger.warn(`Transação não encontrada para parcela ${installment.id}`);
        return;
      }

      const walletId = firstTransaction.walletId;

      for (const transaction of newTransactions) {
        // Buscar a carteira atual
        const wallet = await this.prisma.wallet.findUnique({
          where: { id: walletId },
        });

        if (!wallet) {
          this.logger.warn(`Carteira ${walletId} não encontrada`);
          continue;
        }

        // Debitar o valor da carteira
        const newBalance = wallet.currentBalance - transaction.amount;

        await this.prisma.wallet.update({
          where: { id: walletId },
          data: {
            currentBalance: newBalance,
          },
        });

        this.logger.log(
          `Carteira ${walletId} debitada: R$ ${transaction.amount} (saldo: R$ ${newBalance})`
        );
      }
    } catch (error) {
      this.logger.error(`Erro ao processar parcela fixa ${installment.id}:`, error);
    }
  }

  /**
   * Executado quando uma parcela é concluída
   */
  private async onInstallmentCompleted(installment: any) {
    try {
      // Aqui podemos adicionar lógicas adicionais quando uma parcela é concluída
      // Por exemplo: enviar notificação, gerar relatório, etc.

      this.logger.log(`Parcela concluída: ${installment.description} - R$ ${installment.totalAmount}`);

      // Exemplo: criar uma notificação
      await this.createCompletionNotification(installment);
    } catch (error) {
      this.logger.error(`Erro ao finalizar parcela ${installment.id}:`, error);
    }
  }

  /**
   * Cria notificação de conclusão de parcela
   */
  private async createCompletionNotification(installment: any) {
    try {
      // Buscar o usuário da parcela através da categoria
      const category = await this.prisma.category.findUnique({
        where: { id: installment.categoryId },
        include: { user: true },
      });

      if (!category?.user) {
        this.logger.warn(`Usuário não encontrado para parcela ${installment.id}`);
        return;
      }

      await this.prisma.notification.create({
        data: {
          type: 'INSTALLMENT_COMPLETED',
          title: 'Parcela Concluída',
          message: `Sua parcela "${installment.description}" foi concluída com sucesso!`,
          userId: category.user.id,
          isRead: false,
        },
      });

      this.logger.log(`Notificação criada para conclusão da parcela ${installment.id}`);
    } catch (error) {
      this.logger.error(`Erro ao criar notificação para parcela ${installment.id}:`, error);
    }
  }

  /**
   * Método manual para processar parcelas (útil para testes)
   */
  async processInstallmentsManually() {
    this.logger.log('Processamento manual de parcelas iniciado');
    await this.processInstallments();
  }

  /**
   * Processa parcelas de um usuário específico
   */
  async processUserInstallments(userId: number) {
    this.logger.log(`Processando parcelas do usuário ${userId}`);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar parcelas ativas do usuário
      const userInstallments = await this.prisma.installment.findMany({
        where: {
          isActive: true,
          currentInstallment: {
            lt: this.prisma.installment.fields.installmentCount,
          },
          category: {
            userId: userId,
          },
        },
        include: {
          category: true,
          creditCard: true,
          transactions: {
            orderBy: { date: 'asc' },
          },
        },
      });

      for (const installment of userInstallments) {
        await this.processInstallment(installment, today);
      }

      this.logger.log(`Processamento concluído para usuário ${userId}`);
    } catch (error) {
      this.logger.error(`Erro ao processar parcelas do usuário ${userId}:`, error);
    }
  }

  /**
   * Gera relatório mensal de parcelas
   */
  async generateMonthlyReport(year: number, month: number) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Buscar parcelas que tiveram vencimentos no mês
      const monthlyInstallments = await this.prisma.installment.findMany({
        where: {
          transactions: {
            some: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
        include: {
          category: {
            include: {
              user: true,
            },
          },
          transactions: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });

      // Agrupar por usuário
      const userReports = monthlyInstallments.reduce((acc, installment) => {
        const userId = installment.category.user.id;
        if (!acc[userId]) {
          acc[userId] = {
            user: installment.category.user,
            installments: [],
            totalAmount: 0,
          };
        }

        const monthlyAmount = installment.transactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        acc[userId].installments.push({
          ...installment,
          monthlyAmount,
        });
        acc[userId].totalAmount += monthlyAmount;

        return acc;
      }, {} as any);

      this.logger.log(`Relatório mensal gerado para ${Object.keys(userReports).length} usuários`);

      return userReports;
    } catch (error) {
      this.logger.error('Erro ao gerar relatório mensal:', error);
      throw error;
    }
  }

  /**
   * Busca próximas parcelas a vencer
   */
  async getUpcomingInstallments(userId: number, days: number = 7) {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const upcomingInstallments = await this.prisma.installment.findMany({
        where: {
          isActive: true,
          category: {
            userId: userId,
          },
          transactions: {
            some: {
              date: {
                gte: today,
                lte: futureDate,
              },
            },
          },
        },
        include: {
          category: true,
          creditCard: true,
          transactions: {
            where: {
              date: {
                gte: today,
                lte: futureDate,
              },
            },
            orderBy: { date: 'asc' },
          },
        },
      });

      return upcomingInstallments;
    } catch (error) {
      this.logger.error(`Erro ao buscar próximas parcelas do usuário ${userId}:`, error);
      throw error;
    }
  }
}
