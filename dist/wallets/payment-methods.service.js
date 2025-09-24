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
exports.PaymentMethodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentMethodsService = class PaymentMethodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByUser(userId, walletGroupId) {
        const where = { userId, isActive: true };
        if (walletGroupId !== undefined) {
            where.walletGroupId = walletGroupId;
        }
        return this.prisma.paymentMethod.findMany({
            where,
            include: {
                walletGroup: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'asc' },
            ],
        });
    }
    async findIndependentByUser(userId) {
        return this.prisma.paymentMethod.findMany({
            where: {
                userId,
                walletGroupId: null,
                isActive: true,
            },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'asc' },
            ],
        });
    }
    async findOne(userId, id) {
        const method = await this.prisma.paymentMethod.findFirst({
            where: { id, userId, isActive: true },
            include: {
                walletGroup: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
        });
        if (!method) {
            throw new common_1.NotFoundException('Método de pagamento não encontrado');
        }
        return method;
    }
    async create(userId, createMethodDto) {
        if (createMethodDto.walletGroupId) {
            const group = await this.prisma.walletGroup.findFirst({
                where: {
                    id: createMethodDto.walletGroupId,
                    userId,
                    isActive: true,
                },
            });
            if (!group) {
                throw new common_1.NotFoundException('Grupo de carteira não encontrado');
            }
        }
        let availableLimit = undefined;
        if (createMethodDto.type === client_1.PaymentMethodType.CREDIT_CARD && createMethodDto.creditLimit) {
            availableLimit = createMethodDto.creditLimit;
        }
        const method = await this.prisma.paymentMethod.create({
            data: {
                ...createMethodDto,
                userId,
                availableLimit,
            },
            include: {
                walletGroup: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
        });
        if (createMethodDto.isPrimary || createMethodDto.walletGroupId) {
            await this.updatePrimaryStatus(userId, method.id, createMethodDto.walletGroupId);
        }
        return method;
    }
    async update(userId, id, updateMethodDto) {
        const existingMethod = await this.findOne(userId, id);
        if (updateMethodDto.walletGroupId && updateMethodDto.walletGroupId !== existingMethod.walletGroupId) {
            const group = await this.prisma.walletGroup.findFirst({
                where: {
                    id: updateMethodDto.walletGroupId,
                    userId,
                    isActive: true,
                },
            });
            if (!group) {
                throw new common_1.NotFoundException('Grupo de carteira não encontrado');
            }
        }
        let updateData = { ...updateMethodDto };
        if (updateMethodDto.creditLimit !== undefined && existingMethod.type === client_1.PaymentMethodType.CREDIT_CARD) {
            const usedCredit = (existingMethod.creditLimit || 0) - (existingMethod.availableLimit || 0);
            updateData.availableLimit = updateMethodDto.creditLimit - usedCredit;
        }
        const updatedMethod = await this.prisma.paymentMethod.update({
            where: { id },
            data: updateData,
            include: {
                walletGroup: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
        });
        if (updateMethodDto.isPrimary) {
            await this.updatePrimaryStatus(userId, id, updatedMethod.walletGroupId || undefined);
        }
        return updatedMethod;
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        const transactionsCount = await this.prisma.transaction.count({
            where: { paymentMethodId: id },
        });
        if (transactionsCount > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um método de pagamento que possui transações associadas.');
        }
        return this.prisma.paymentMethod.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async setPrimary(userId, id) {
        const method = await this.findOne(userId, id);
        return this.updatePrimaryStatus(userId, id, method.walletGroupId || undefined);
    }
    async getCount(userId) {
        return this.prisma.paymentMethod.count({
            where: { userId, isActive: true },
        });
    }
    async getTotalBalance(userId) {
        const result = await this.prisma.paymentMethod.aggregate({
            where: { userId, isActive: true },
            _sum: { currentBalance: true },
        });
        return result._sum.currentBalance || 0;
    }
    async getTotalCreditLimit(userId) {
        const result = await this.prisma.paymentMethod.aggregate({
            where: {
                userId,
                isActive: true,
                type: client_1.PaymentMethodType.CREDIT_CARD,
            },
            _sum: { creditLimit: true },
        });
        return result._sum.creditLimit || 0;
    }
    async getTotalAvailableCredit(userId) {
        const result = await this.prisma.paymentMethod.aggregate({
            where: {
                userId,
                isActive: true,
                type: client_1.PaymentMethodType.CREDIT_CARD,
            },
            _sum: { availableLimit: true },
        });
        return result._sum.availableLimit || 0;
    }
    async getTypes() {
        const types = Object.values(client_1.PaymentMethodType).map(type => ({
            value: type,
            label: this.getTypeLabel(type),
            description: this.getTypeDescription(type),
            icon: this.getTypeIcon(type),
        }));
        return { types };
    }
    async updatePrimaryStatus(userId, methodId, walletGroupId) {
        if (walletGroupId) {
            await this.prisma.paymentMethod.updateMany({
                where: {
                    userId,
                    walletGroupId,
                    id: { not: methodId },
                },
                data: { isPrimary: false },
            });
        }
        else {
            await this.prisma.paymentMethod.updateMany({
                where: {
                    userId,
                    walletGroupId: null,
                    id: { not: methodId },
                },
                data: { isPrimary: false },
            });
        }
        return this.prisma.paymentMethod.update({
            where: { id: methodId },
            data: { isPrimary: true },
            include: {
                walletGroup: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                    },
                },
            },
        });
    }
    getTypeLabel(type) {
        const labels = {
            [client_1.PaymentMethodType.CREDIT_CARD]: 'Cartão de Crédito',
            [client_1.PaymentMethodType.DEBIT_CARD]: 'Cartão de Débito',
            [client_1.PaymentMethodType.WALLET_BALANCE]: 'Saldo da Carteira',
            [client_1.PaymentMethodType.PIX]: 'PIX',
            [client_1.PaymentMethodType.CHECKING_ACCOUNT]: 'Conta Corrente',
            [client_1.PaymentMethodType.SAVINGS_ACCOUNT]: 'Poupança',
            [client_1.PaymentMethodType.CASH]: 'Dinheiro',
            [client_1.PaymentMethodType.INVESTMENT]: 'Investimentos',
            [client_1.PaymentMethodType.OTHER]: 'Outros',
        };
        return labels[type] || type;
    }
    getTypeDescription(type) {
        const descriptions = {
            [client_1.PaymentMethodType.CREDIT_CARD]: 'Compras parceladas e à prazo',
            [client_1.PaymentMethodType.DEBIT_CARD]: 'Débito direto na conta',
            [client_1.PaymentMethodType.WALLET_BALANCE]: 'Saldo disponível na carteira digital',
            [client_1.PaymentMethodType.PIX]: 'Transferências instantâneas',
            [client_1.PaymentMethodType.CHECKING_ACCOUNT]: 'Conta corrente bancária',
            [client_1.PaymentMethodType.SAVINGS_ACCOUNT]: 'Conta poupança',
            [client_1.PaymentMethodType.CASH]: 'Dinheiro em espécie',
            [client_1.PaymentMethodType.INVESTMENT]: 'Aplicações financeiras',
            [client_1.PaymentMethodType.OTHER]: 'Outros métodos de pagamento',
        };
        return descriptions[type] || '';
    }
    getTypeIcon(type) {
        const icons = {
            [client_1.PaymentMethodType.CREDIT_CARD]: 'card',
            [client_1.PaymentMethodType.DEBIT_CARD]: 'card-outline',
            [client_1.PaymentMethodType.WALLET_BALANCE]: 'wallet',
            [client_1.PaymentMethodType.PIX]: 'flash',
            [client_1.PaymentMethodType.CHECKING_ACCOUNT]: 'business',
            [client_1.PaymentMethodType.SAVINGS_ACCOUNT]: 'piggy-bank',
            [client_1.PaymentMethodType.CASH]: 'cash',
            [client_1.PaymentMethodType.INVESTMENT]: 'trending-up',
            [client_1.PaymentMethodType.OTHER]: 'ellipsis-horizontal',
        };
        return icons[type] || 'card';
    }
};
exports.PaymentMethodsService = PaymentMethodsService;
exports.PaymentMethodsService = PaymentMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentMethodsService);
//# sourceMappingURL=payment-methods.service.js.map