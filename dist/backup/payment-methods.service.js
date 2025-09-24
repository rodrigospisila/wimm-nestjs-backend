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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentMethodsService = class PaymentMethodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPaymentMethodDto) {
        if (createPaymentMethodDto.type === string.CREDIT_CARD) {
            if (!createPaymentMethodDto.creditLimit || createPaymentMethodDto.creditLimit <= 0) {
                throw new common_1.BadRequestException('Limite do cartão de crédito é obrigatório e deve ser maior que zero');
            }
            if (!createPaymentMethodDto.closingDay || createPaymentMethodDto.closingDay < 1 || createPaymentMethodDto.closingDay > 28) {
                throw new common_1.BadRequestException('Dia de fechamento deve estar entre 1 e 28');
            }
            if (!createPaymentMethodDto.dueDay || createPaymentMethodDto.dueDay < 1 || createPaymentMethodDto.dueDay > 31) {
                throw new common_1.BadRequestException('Dia de vencimento deve estar entre 1 e 31');
            }
            if (createPaymentMethodDto.dueDay <= createPaymentMethodDto.closingDay) {
                throw new common_1.BadRequestException('Dia de vencimento deve ser posterior ao dia de fechamento');
            }
        }
        if (createPaymentMethodDto.isPrimary && createPaymentMethodDto.walletGroupId) {
            await this.prisma.paymentMethod.updateMany({
                where: {
                    walletGroupId: createPaymentMethodDto.walletGroupId,
                    userId,
                },
                data: { isPrimary: false },
            });
        }
        const availableLimit = createPaymentMethodDto.type === string.CREDIT_CARD
            ? createPaymentMethodDto.creditLimit
            : null;
        return this.prisma.paymentMethod.create({
            data: {
                ...createPaymentMethodDto,
                availableLimit,
                userId,
            },
            include: {
                walletGroup: true,
            },
        });
    }
    async findAll(userId, walletGroupId) {
        const where = { userId, isActive: true };
        if (walletGroupId !== undefined) {
            where.walletGroupId = walletGroupId;
        }
        return this.prisma.paymentMethod.findMany({
            where,
            include: {
                walletGroup: true,
            },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'asc' }
            ],
        });
    }
    async findOne(id, userId) {
        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: { id, userId },
            include: {
                walletGroup: true,
                transactions: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Método de pagamento não encontrado');
        }
        return paymentMethod;
    }
    async update(id, userId, updateData) {
        const paymentMethod = await this.findOne(id, userId);
        if (paymentMethod.type === string.CREDIT_CARD || updateData.type === string.CREDIT_CARD) {
            if (updateData.closingDay && (updateData.closingDay < 1 || updateData.closingDay > 28)) {
                throw new common_1.BadRequestException('Dia de fechamento deve estar entre 1 e 28');
            }
            if (updateData.dueDay && (updateData.dueDay < 1 || updateData.dueDay > 31)) {
                throw new common_1.BadRequestException('Dia de vencimento deve estar entre 1 e 31');
            }
            const closingDay = updateData.closingDay || paymentMethod.closingDay;
            const dueDay = updateData.dueDay || paymentMethod.dueDay;
            if (closingDay && dueDay && dueDay <= closingDay) {
                throw new common_1.BadRequestException('Dia de vencimento deve ser posterior ao dia de fechamento');
            }
        }
        if (updateData.isPrimary && paymentMethod.walletGroupId) {
            await this.prisma.paymentMethod.updateMany({
                where: {
                    walletGroupId: paymentMethod.walletGroupId,
                    userId,
                    id: { not: id },
                },
                data: { isPrimary: false },
            });
        }
        let availableLimit = paymentMethod.availableLimit;
        if (updateData.creditLimit !== undefined) {
            const usedLimit = (paymentMethod.creditLimit || 0) - (paymentMethod.availableLimit || 0);
            availableLimit = updateData.creditLimit - usedLimit;
        }
        return this.prisma.paymentMethod.update({
            where: { id },
            data: {
                ...updateData,
                availableLimit,
            },
            include: {
                walletGroup: true,
            },
        });
    }
    async remove(id, userId) {
        const paymentMethod = await this.findOne(id, userId);
        const transactionCount = await this.prisma.transaction.count({
            where: { paymentMethodId: id },
        });
        if (transactionCount > 0) {
            return this.prisma.paymentMethod.update({
                where: { id },
                data: { isActive: false },
            });
        }
        else {
            return this.prisma.paymentMethod.delete({
                where: { id },
            });
        }
    }
    async updateBalance(id, userId, amount, operation) {
        const paymentMethod = await this.findOne(id, userId);
        const newBalance = operation === 'add'
            ? paymentMethod.currentBalance + amount
            : paymentMethod.currentBalance - amount;
        let availableLimit = paymentMethod.availableLimit;
        if (paymentMethod.type === string.CREDIT_CARD) {
            availableLimit = operation === 'add'
                ? (paymentMethod.availableLimit || 0) + amount
                : (paymentMethod.availableLimit || 0) - amount;
        }
        return this.prisma.paymentMethod.update({
            where: { id },
            data: {
                currentBalance: newBalance,
                availableLimit,
            },
        });
    }
    async getByType(userId, type) {
        return this.prisma.paymentMethod.findMany({
            where: {
                userId,
                type,
                isActive: true,
            },
            include: {
                walletGroup: true,
            },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'asc' }
            ],
        });
    }
};
exports.PaymentMethodsService = PaymentMethodsService;
exports.PaymentMethodsService = PaymentMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PaymentMethodsService);
//# sourceMappingURL=payment-methods.service.js.map