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
exports.WalletGroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletGroupsService = class WalletGroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createWalletGroupDto) {
        return this.prisma.walletGroup.create({
            data: {
                ...createWalletGroupDto,
                userId,
            },
            include: {
                paymentMethods: true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.walletGroup.findMany({
            where: { userId },
            include: {
                paymentMethods: {
                    where: { isActive: true },
                    orderBy: [
                        { isPrimary: 'desc' },
                        { createdAt: 'asc' }
                    ]
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id, userId) {
        const walletGroup = await this.prisma.walletGroup.findFirst({
            where: { id, userId },
            include: {
                paymentMethods: {
                    where: { isActive: true },
                    orderBy: [
                        { isPrimary: 'desc' },
                        { createdAt: 'asc' }
                    ]
                },
            },
        });
        if (!walletGroup) {
            throw new common_1.NotFoundException('Grupo de carteira não encontrado');
        }
        return walletGroup;
    }
    async update(id, userId, updateData) {
        const walletGroup = await this.findOne(id, userId);
        return this.prisma.walletGroup.update({
            where: { id },
            data: updateData,
            include: {
                paymentMethods: true,
            },
        });
    }
    async remove(id, userId) {
        const walletGroup = await this.findOne(id, userId);
        const activePaymentMethods = await this.prisma.paymentMethod.count({
            where: { walletGroupId: id, isActive: true },
        });
        if (activePaymentMethods > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um grupo de carteira que possui métodos de pagamento ativos');
        }
        return this.prisma.walletGroup.delete({
            where: { id },
        });
    }
    async createDefaultWalletGroups(userId) {
        const defaultGroups = [
            {
                name: 'Nubank',
                type: string.DIGITAL_WALLET,
                description: 'Carteira digital Nubank',
                color: '#8A05BE',
                icon: 'nubank',
                hasIntegratedPix: true,
                hasWalletBalance: true,
            },
            {
                name: 'Mercado Pago',
                type: string.DIGITAL_WALLET,
                description: 'Carteira digital Mercado Pago',
                color: '#00B1EA',
                icon: 'mercado-pago',
                hasIntegratedPix: true,
                hasWalletBalance: true,
            },
            {
                name: 'PicPay',
                type: string.DIGITAL_WALLET,
                description: 'Carteira digital PicPay',
                color: '#11C76F',
                icon: 'picpay',
                hasIntegratedPix: true,
                hasWalletBalance: true,
            },
        ];
        const createdGroups = [];
        for (const group of defaultGroups) {
            const created = await this.create(userId, group);
            createdGroups.push(created);
        }
        return createdGroups;
    }
};
exports.WalletGroupsService = WalletGroupsService;
exports.WalletGroupsService = WalletGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], WalletGroupsService);
//# sourceMappingURL=wallet-groups.service.js.map