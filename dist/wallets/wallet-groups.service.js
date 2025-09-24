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
exports.WalletGroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WalletGroupsService = class WalletGroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByUser(userId) {
        return this.prisma.walletGroup.findMany({
            where: { userId, isActive: true },
            include: {
                paymentMethods: {
                    where: { isActive: true },
                    orderBy: [
                        { isPrimary: 'desc' },
                        { createdAt: 'asc' },
                    ],
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(userId, id) {
        const group = await this.prisma.walletGroup.findFirst({
            where: { id, userId, isActive: true },
            include: {
                paymentMethods: {
                    where: { isActive: true },
                    orderBy: [
                        { isPrimary: 'desc' },
                        { createdAt: 'asc' },
                    ],
                },
            },
        });
        if (!group) {
            throw new common_1.NotFoundException('Grupo de carteira não encontrado');
        }
        return group;
    }
    async create(userId, createGroupDto) {
        const existingGroup = await this.prisma.walletGroup.findFirst({
            where: {
                userId,
                name: createGroupDto.name,
                isActive: true,
            },
        });
        if (existingGroup) {
            throw new common_1.BadRequestException('Já existe um grupo com este nome');
        }
        return this.prisma.walletGroup.create({
            data: {
                ...createGroupDto,
                userId,
            },
            include: {
                paymentMethods: true,
            },
        });
    }
    async update(userId, id, updateGroupDto) {
        const existingGroup = await this.findOne(userId, id);
        if (updateGroupDto.name && updateGroupDto.name !== existingGroup.name) {
            const duplicateGroup = await this.prisma.walletGroup.findFirst({
                where: {
                    userId,
                    name: updateGroupDto.name,
                    isActive: true,
                    id: { not: id },
                },
            });
            if (duplicateGroup) {
                throw new common_1.BadRequestException('Já existe um grupo com este nome');
            }
        }
        return this.prisma.walletGroup.update({
            where: { id },
            data: updateGroupDto,
            include: {
                paymentMethods: {
                    where: { isActive: true },
                    orderBy: [
                        { isPrimary: 'desc' },
                        { createdAt: 'asc' },
                    ],
                },
            },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        const paymentMethodsCount = await this.prisma.paymentMethod.count({
            where: { walletGroupId: id, isActive: true },
        });
        if (paymentMethodsCount > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um grupo que possui métodos de pagamento. Remova ou transfira os métodos primeiro.');
        }
        return this.prisma.walletGroup.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getCount(userId) {
        return this.prisma.walletGroup.count({
            where: { userId, isActive: true },
        });
    }
    async getTypes() {
        const types = Object.values(client_1.WalletGroupType).map(type => ({
            value: type,
            label: this.getTypeLabel(type),
            description: this.getTypeDescription(type),
        }));
        return { types };
    }
    async createDefaults(userId) {
        const defaultGroups = [
            {
                name: 'Nubank',
                type: client_1.WalletGroupType.DIGITAL_WALLET,
                description: 'Carteira digital Nubank',
                color: '#8A05BE',
                icon: 'card',
                hasIntegratedPix: true,
                hasWalletBalance: true,
            },
            {
                name: 'Mercado Pago',
                type: client_1.WalletGroupType.DIGITAL_WALLET,
                description: 'Carteira digital Mercado Pago',
                color: '#00AAFF',
                icon: 'wallet',
                hasIntegratedPix: true,
                hasWalletBalance: true,
            },
            {
                name: 'PicPay',
                type: client_1.WalletGroupType.DIGITAL_WALLET,
                description: 'Carteira digital PicPay',
                color: '#21C25E',
                icon: 'phone-portrait',
                hasIntegratedPix: true,
                hasWalletBalance: true,
            },
            {
                name: 'Itaú',
                type: client_1.WalletGroupType.TRADITIONAL_BANK,
                description: 'Banco Itaú',
                color: '#FF6600',
                icon: 'business',
                hasIntegratedPix: true,
                hasWalletBalance: false,
            },
            {
                name: 'Bradesco',
                type: client_1.WalletGroupType.TRADITIONAL_BANK,
                description: 'Banco Bradesco',
                color: '#E30613',
                icon: 'business',
                hasIntegratedPix: true,
                hasWalletBalance: false,
            },
        ];
        const createdGroups = [];
        for (const groupData of defaultGroups) {
            try {
                const existing = await this.prisma.walletGroup.findFirst({
                    where: {
                        userId,
                        name: groupData.name,
                        isActive: true,
                    },
                });
                if (!existing) {
                    const created = await this.prisma.walletGroup.create({
                        data: {
                            ...groupData,
                            userId,
                        },
                    });
                    createdGroups.push(created);
                    await this.createDefaultPaymentMethods(userId, created.id, created.type);
                }
            }
            catch (error) {
                console.error(`Erro ao criar grupo ${groupData.name}:`, error);
            }
        }
        return {
            message: `${createdGroups.length} grupos padrão criados`,
            groups: createdGroups,
        };
    }
    getTypeLabel(type) {
        const labels = {
            [client_1.WalletGroupType.DIGITAL_WALLET]: 'Carteira Digital',
            [client_1.WalletGroupType.TRADITIONAL_BANK]: 'Banco Tradicional',
            [client_1.WalletGroupType.INVESTMENT]: 'Investimentos',
            [client_1.WalletGroupType.OTHER]: 'Outros',
        };
        return labels[type] || type;
    }
    getTypeDescription(type) {
        const descriptions = {
            [client_1.WalletGroupType.DIGITAL_WALLET]: 'Nubank, Mercado Pago, PicPay, etc.',
            [client_1.WalletGroupType.TRADITIONAL_BANK]: 'Itaú, Bradesco, Santander, etc.',
            [client_1.WalletGroupType.INVESTMENT]: 'XP, Rico, Clear, etc.',
            [client_1.WalletGroupType.OTHER]: 'Outras instituições financeiras',
        };
        return descriptions[type] || '';
    }
    async createDefaultPaymentMethods(userId, walletGroupId, groupType) {
        const defaultMethods = [];
        if (groupType === client_1.WalletGroupType.DIGITAL_WALLET) {
            defaultMethods.push({
                name: 'Cartão de Crédito',
                type: 'CREDIT_CARD',
                currentBalance: 0,
                creditLimit: 1000,
                availableLimit: 1000,
                closingDay: 5,
                dueDay: 15,
                isPrimary: true,
                color: '#4CAF50',
                icon: 'credit-card',
            }, {
                name: 'Cartão de Débito',
                type: 'DEBIT_CARD',
                currentBalance: 0,
                isPrimary: false,
                color: '#2196F3',
                icon: 'card',
            }, {
                name: 'Saldo da Carteira',
                type: 'WALLET_BALANCE',
                currentBalance: 0,
                isPrimary: false,
                color: '#FF9800',
                icon: 'wallet',
            });
        }
        else if (groupType === client_1.WalletGroupType.TRADITIONAL_BANK) {
            defaultMethods.push({
                name: 'Conta Corrente',
                type: 'CHECKING_ACCOUNT',
                currentBalance: 0,
                isPrimary: true,
                color: '#607D8B',
                icon: 'business',
            }, {
                name: 'Poupança',
                type: 'SAVINGS_ACCOUNT',
                currentBalance: 0,
                isPrimary: false,
                color: '#4CAF50',
                icon: 'piggy-bank',
            });
        }
        for (const methodData of defaultMethods) {
            try {
                await this.prisma.paymentMethod.create({
                    data: {
                        ...methodData,
                        userId,
                        walletGroupId,
                        isActive: true,
                    },
                });
            }
            catch (error) {
                console.error(`Erro ao criar método de pagamento ${methodData.name}:`, error);
            }
        }
    }
};
exports.WalletGroupsService = WalletGroupsService;
exports.WalletGroupsService = WalletGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletGroupsService);
//# sourceMappingURL=wallet-groups.service.js.map