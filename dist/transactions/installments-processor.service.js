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
var InstallmentsProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentsProcessorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InstallmentsProcessorService = InstallmentsProcessorService_1 = class InstallmentsProcessorService {
    prisma;
    logger = new common_1.Logger(InstallmentsProcessorService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processInstallments() {
        this.logger.log('Iniciando processamento de parcelas...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
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
        }
        catch (error) {
            this.logger.error('Erro ao processar parcelas:', error);
        }
    }
    async processInstallment(installment, today) {
        try {
            const dueTransactions = installment.transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                transactionDate.setHours(0, 0, 0, 0);
                return transactionDate <= today;
            });
            const dueCount = dueTransactions.length;
            if (dueCount > installment.currentInstallment) {
                const newCurrentInstallment = dueCount;
                await this.prisma.installment.update({
                    where: { id: installment.id },
                    data: {
                        currentInstallment: newCurrentInstallment,
                        isActive: newCurrentInstallment < installment.installmentCount,
                    },
                });
                if (installment.installmentType === 'CREDIT_CARD' && installment.creditCardId) {
                    await this.processCreditCardInstallment(installment, dueTransactions.slice(installment.currentInstallment));
                }
                if (installment.installmentType === 'FIXED') {
                    await this.processFixedInstallment(installment, dueTransactions.slice(installment.currentInstallment));
                }
                this.logger.log(`Parcela ${installment.id} processada: ${installment.currentInstallment} -> ${newCurrentInstallment}`);
                if (newCurrentInstallment >= installment.installmentCount) {
                    this.logger.log(`Parcela ${installment.id} concluída`);
                    await this.onInstallmentCompleted(installment);
                }
            }
        }
        catch (error) {
            this.logger.error(`Erro ao processar parcela ${installment.id}:`, error);
        }
    }
    async processCreditCardInstallment(installment, newTransactions) {
        try {
            for (const transaction of newTransactions) {
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
                this.logger.log(`Transação de cartão criada para parcela ${installment.id}: R$ ${transaction.amount}`);
            }
        }
        catch (error) {
            this.logger.error(`Erro ao processar parcela de cartão ${installment.id}:`, error);
        }
    }
    async processFixedInstallment(installment, newTransactions) {
        try {
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
                const wallet = await this.prisma.wallet.findUnique({
                    where: { id: walletId },
                });
                if (!wallet) {
                    this.logger.warn(`Carteira ${walletId} não encontrada`);
                    continue;
                }
                const newBalance = wallet.currentBalance - transaction.amount;
                await this.prisma.wallet.update({
                    where: { id: walletId },
                    data: {
                        currentBalance: newBalance,
                    },
                });
                this.logger.log(`Carteira ${walletId} debitada: R$ ${transaction.amount} (saldo: R$ ${newBalance})`);
            }
        }
        catch (error) {
            this.logger.error(`Erro ao processar parcela fixa ${installment.id}:`, error);
        }
    }
    async onInstallmentCompleted(installment) {
        try {
            this.logger.log(`Parcela concluída: ${installment.description} - R$ ${installment.totalAmount}`);
            await this.createCompletionNotification(installment);
        }
        catch (error) {
            this.logger.error(`Erro ao finalizar parcela ${installment.id}:`, error);
        }
    }
    async createCompletionNotification(installment) {
        try {
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
        }
        catch (error) {
            this.logger.error(`Erro ao criar notificação para parcela ${installment.id}:`, error);
        }
    }
    async processInstallmentsManually() {
        this.logger.log('Processamento manual de parcelas iniciado');
        await this.processInstallments();
    }
    async processUserInstallments(userId) {
        this.logger.log(`Processando parcelas do usuário ${userId}`);
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
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
        }
        catch (error) {
            this.logger.error(`Erro ao processar parcelas do usuário ${userId}:`, error);
        }
    }
    async generateMonthlyReport(year, month) {
        try {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
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
            const userReports = monthlyInstallments.reduce((acc, installment) => {
                const userId = installment.category.user.id;
                if (!acc[userId]) {
                    acc[userId] = {
                        user: installment.category.user,
                        installments: [],
                        totalAmount: 0,
                    };
                }
                const monthlyAmount = installment.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
                acc[userId].installments.push({
                    ...installment,
                    monthlyAmount,
                });
                acc[userId].totalAmount += monthlyAmount;
                return acc;
            }, {});
            this.logger.log(`Relatório mensal gerado para ${Object.keys(userReports).length} usuários`);
            return userReports;
        }
        catch (error) {
            this.logger.error('Erro ao gerar relatório mensal:', error);
            throw error;
        }
    }
    async getUpcomingInstallments(userId, days = 7) {
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
        }
        catch (error) {
            this.logger.error(`Erro ao buscar próximas parcelas do usuário ${userId}:`, error);
            throw error;
        }
    }
};
exports.InstallmentsProcessorService = InstallmentsProcessorService;
exports.InstallmentsProcessorService = InstallmentsProcessorService = InstallmentsProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstallmentsProcessorService);
//# sourceMappingURL=installments-processor.service.js.map