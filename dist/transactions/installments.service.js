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
exports.InstallmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InstallmentsService = class InstallmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createInstallmentDto) {
        const category = await this.prisma.category.findFirst({
            where: { id: createInstallmentDto.categoryId, userId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoria não encontrada');
        }
        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: { id: createInstallmentDto.paymentMethodId, userId },
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Método de pagamento não encontrado');
        }
        const totalAmount = createInstallmentDto.totalAmount / createInstallmentDto.installmentCount;
        const startDate = createInstallmentDto.startDate ? new Date(createInstallmentDto.startDate) : new Date();
        const installment = await this.prisma.installment.create({
            data: {
                description: createInstallmentDto.description,
                totalAmount: createInstallmentDto.totalAmount,
                installmentCount: createInstallmentDto.installmentCount,
                startDate,
                installmentType: createInstallmentDto.installmentType,
                categoryId: createInstallmentDto.categoryId,
                paymentMethodId: createInstallmentDto.paymentMethodId,
                userId,
                notes: createInstallmentDto.notes,
            },
        });
        const transactions = [];
        for (let i = 1; i <= createInstallmentDto.installmentCount; i++) {
            const installmentDate = new Date(startDate);
            installmentDate.setMonth(installmentDate.getMonth() + (i - 1));
            const transaction = await this.prisma.transaction.create({
                data: {
                    description: `${createInstallmentDto.description} (${i}/${createInstallmentDto.installmentCount})`,
                    amount: -Math.abs(totalAmount),
                    date: installmentDate,
                    type: client_1.TransactionType.EXPENSE,
                    categoryId: createInstallmentDto.categoryId,
                    paymentMethodId: createInstallmentDto.paymentMethodId,
                    installmentId: installment.id,
                    installmentNumber: i,
                    userId,
                    notes: createInstallmentDto.notes,
                },
            });
            transactions.push(transaction);
        }
        if (paymentMethod.type !== client_1.PaymentMethodType.CREDIT_CARD) {
            await this.prisma.paymentMethod.update({
                where: { id: paymentMethod.id },
                data: {
                    currentBalance: {
                        decrement: createInstallmentDto.totalAmount,
                    },
                },
            });
        }
        return {
            installment: await this.findOne(userId, installment.id),
            transactions,
            message: `Parcelamento criado com ${createInstallmentDto.installmentCount} parcelas`,
        };
    }
    async findAllByUser(userId, filters = {}) {
        const where = { userId };
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.paymentMethodId) {
            where.paymentMethodId = filters.paymentMethodId;
        }
        return this.prisma.installment.findMany({
            where,
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
                paymentMethod: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        color: true,
                        walletGroup: {
                            select: {
                                id: true,
                                name: true,
                                color: true,
                                icon: true,
                            },
                        },
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        date: true,
                    },
                    orderBy: { installmentNumber: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, id) {
        const installment = await this.prisma.installment.findFirst({
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
                paymentMethod: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        color: true,
                        walletGroup: {
                            select: {
                                id: true,
                                name: true,
                                color: true,
                                icon: true,
                            },
                        },
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        date: true,
                        createdAt: true,
                    },
                    orderBy: { installmentNumber: 'asc' },
                },
            },
        });
        if (!installment) {
            throw new common_1.NotFoundException('Parcelamento não encontrado');
        }
        return installment;
    }
    async payInstallment(userId, installmentId, installmentNumber, paidAmount) {
        const installment = await this.findOne(userId, installmentId);
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                installmentId,
                installmentNumber,
                userId,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Parcela não encontrada');
        }
        const amountToPay = paidAmount || Math.abs(transaction.amount);
        await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {},
        });
        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installmentId },
            data: {
                currentInstallment: {
                    increment: 1,
                },
            },
        });
        if (updatedInstallment.currentInstallment >= updatedInstallment.installmentCount) {
            await this.prisma.installment.update({
                where: { id: installmentId },
                data: {},
            });
        }
        if (installment.paymentMethod.type !== client_1.PaymentMethodType.CREDIT_CARD) {
            await this.prisma.paymentMethod.update({
                where: { id: installment.paymentMethodId },
                data: {
                    currentBalance: {
                        decrement: amountToPay,
                    },
                },
            });
        }
        return {
            message: `Parcela ${installmentNumber}/${installment.installmentCount} paga com sucesso`,
            installment: await this.findOne(userId, installmentId),
        };
    }
    async remove(userId, id) {
        const installment = await this.findOne(userId, id);
        const paidTransactions = await this.prisma.transaction.count({
            where: {
                installmentId: id,
            },
        });
        if (paidTransactions > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um parcelamento que possui parcelas já pagas. Cancele as parcelas restantes.');
        }
        await this.prisma.transaction.deleteMany({
            where: { installmentId: id },
        });
        if (installment.paymentMethod.type !== client_1.PaymentMethodType.CREDIT_CARD) {
            await this.prisma.paymentMethod.update({
                where: { id: installment.paymentMethodId },
                data: {
                    currentBalance: {
                        increment: installment.totalAmount,
                    },
                },
            });
        }
        return this.prisma.installment.delete({
            where: { id },
        });
    }
    async cancelInstallment(userId, id) {
        const installment = await this.findOne(userId, id);
        const canceledInstallment = await this.prisma.installment.update({
            where: { id },
            data: {},
        });
        await this.prisma.transaction.deleteMany({
            where: {
                installmentId: id,
            },
        });
        return {
            message: 'Parcelamento cancelado com sucesso',
            installment: canceledInstallment,
        };
    }
    async getPendingInstallments(userId) {
        const currentDate = new Date();
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return this.prisma.transaction.findMany({
            where: {
                userId,
                installmentId: { not: null },
                date: {
                    lte: endOfMonth,
                },
            },
            include: {
                installment: {
                    select: {
                        id: true,
                        description: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
                paymentMethod: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        color: true,
                    },
                },
            },
            orderBy: { date: 'asc' },
        });
    }
};
exports.InstallmentsService = InstallmentsService;
exports.InstallmentsService = InstallmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstallmentsService);
//# sourceMappingURL=installments.service.js.map