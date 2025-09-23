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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsV2Controller = void 0;
const common_1 = require("@nestjs/common");
const wallet_groups_service_1 = require("./wallet-groups.service");
const payment_methods_service_1 = require("./payment-methods.service");
const create_wallet_group_dto_1 = require("./dto/create-wallet-group.dto");
const create_payment_method_dto_1 = require("./dto/create-payment-method.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let WalletsV2Controller = class WalletsV2Controller {
    walletGroupsService;
    paymentMethodsService;
    constructor(walletGroupsService, paymentMethodsService) {
        this.walletGroupsService = walletGroupsService;
        this.paymentMethodsService = paymentMethodsService;
    }
    async createGroup(createWalletGroupDto, req) {
        try {
            return await this.walletGroupsService.create(req.user.id, createWalletGroupDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao criar grupo de carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllGroups(req) {
        try {
            return await this.walletGroupsService.findAll(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar grupos de carteiras', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getWalletGroupTypes() {
        return {
            types: [
                {
                    value: client_1.WalletGroupType.DIGITAL_WALLET,
                    label: 'Carteira Digital',
                    icon: 'smartphone',
                    description: 'Nubank, Mercado Pago, PicPay, etc.'
                },
                {
                    value: client_1.WalletGroupType.TRADITIONAL_BANK,
                    label: 'Banco Tradicional',
                    icon: 'bank',
                    description: 'Itaú, Bradesco, Santander, etc.'
                },
                {
                    value: client_1.WalletGroupType.INVESTMENT,
                    label: 'Investimentos',
                    icon: 'trending-up',
                    description: 'XP, Rico, Clear, etc.'
                },
                {
                    value: client_1.WalletGroupType.OTHER,
                    label: 'Outros',
                    icon: 'wallet',
                    description: 'Outras instituições'
                },
            ],
        };
    }
    async createDefaultGroups(req) {
        try {
            return await this.walletGroupsService.createDefaultWalletGroups(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao criar grupos padrão', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOneGroup(id, req) {
        try {
            return await this.walletGroupsService.findOne(parseInt(id), req.user.id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao buscar grupo de carteira', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateGroup(id, updateData, req) {
        try {
            return await this.walletGroupsService.update(parseInt(id), req.user.id, updateData);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Erro ao atualizar grupo de carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeGroup(id, req) {
        try {
            await this.walletGroupsService.remove(parseInt(id), req.user.id);
            return { message: 'Grupo de carteira removido com sucesso' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao remover grupo de carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createPaymentMethod(createPaymentMethodDto, req) {
        try {
            return await this.paymentMethodsService.create(req.user.id, createPaymentMethodDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao criar método de pagamento', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllPaymentMethods(req, walletGroupId) {
        try {
            const groupId = walletGroupId ? parseInt(walletGroupId) : undefined;
            return await this.paymentMethodsService.findAll(req.user.id, groupId);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar métodos de pagamento', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPaymentMethodTypes() {
        return {
            types: [
                {
                    value: client_1.PaymentMethodType.CREDIT_CARD,
                    label: 'Cartão de Crédito',
                    icon: 'credit-card',
                    requiresGroup: true,
                    description: 'Cartão de crédito da carteira'
                },
                {
                    value: client_1.PaymentMethodType.DEBIT_CARD,
                    label: 'Cartão de Débito',
                    icon: 'card',
                    requiresGroup: true,
                    description: 'Cartão de débito da carteira'
                },
                {
                    value: client_1.PaymentMethodType.WALLET_BALANCE,
                    label: 'Saldo da Carteira',
                    icon: 'wallet',
                    requiresGroup: true,
                    description: 'Saldo disponível na carteira digital'
                },
                {
                    value: client_1.PaymentMethodType.PIX,
                    label: 'PIX',
                    icon: 'pix',
                    requiresGroup: true,
                    description: 'PIX da carteira'
                },
                {
                    value: client_1.PaymentMethodType.CHECKING_ACCOUNT,
                    label: 'Conta Corrente',
                    icon: 'bank',
                    requiresGroup: false,
                    description: 'Conta corrente independente'
                },
                {
                    value: client_1.PaymentMethodType.SAVINGS_ACCOUNT,
                    label: 'Poupança',
                    icon: 'piggy-bank',
                    requiresGroup: false,
                    description: 'Conta poupança independente'
                },
                {
                    value: client_1.PaymentMethodType.CASH,
                    label: 'Dinheiro',
                    icon: 'cash',
                    requiresGroup: false,
                    description: 'Dinheiro em espécie'
                },
                {
                    value: client_1.PaymentMethodType.INVESTMENT,
                    label: 'Investimento',
                    icon: 'trending-up',
                    requiresGroup: false,
                    description: 'Conta de investimentos'
                },
                {
                    value: client_1.PaymentMethodType.OTHER,
                    label: 'Outros',
                    icon: 'more-horizontal',
                    requiresGroup: false,
                    description: 'Outros métodos de pagamento'
                },
            ],
        };
    }
    async getPaymentMethodsByType(type, req) {
        try {
            const paymentMethodType = type.toUpperCase();
            return await this.paymentMethodsService.getByType(req.user.id, paymentMethodType);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar métodos de pagamento por tipo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOnePaymentMethod(id, req) {
        try {
            return await this.paymentMethodsService.findOne(parseInt(id), req.user.id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao buscar método de pagamento', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePaymentMethod(id, updateData, req) {
        try {
            return await this.paymentMethodsService.update(parseInt(id), req.user.id, updateData);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Erro ao atualizar método de pagamento', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateBalance(id, { amount, operation }, req) {
        try {
            return await this.paymentMethodsService.updateBalance(parseInt(id), req.user.id, amount, operation);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao atualizar saldo', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removePaymentMethod(id, req) {
        try {
            await this.paymentMethodsService.remove(parseInt(id), req.user.id);
            return { message: 'Método de pagamento removido com sucesso' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao remover método de pagamento', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOverview(req) {
        try {
            const groups = await this.walletGroupsService.findAll(req.user.id);
            const independentMethods = await this.paymentMethodsService.findAll(req.user.id, null);
            let totalBalance = 0;
            let totalCreditLimit = 0;
            let totalAvailableCredit = 0;
            groups.forEach(group => {
                group.paymentMethods.forEach(method => {
                    totalBalance += method.currentBalance;
                    if (method.type === client_1.PaymentMethodType.CREDIT_CARD) {
                        totalCreditLimit += method.creditLimit || 0;
                        totalAvailableCredit += method.availableLimit || 0;
                    }
                });
            });
            independentMethods.forEach(method => {
                if (!method.walletGroupId) {
                    totalBalance += method.currentBalance;
                    if (method.type === client_1.PaymentMethodType.CREDIT_CARD) {
                        totalCreditLimit += method.creditLimit || 0;
                        totalAvailableCredit += method.availableLimit || 0;
                    }
                }
            });
            return {
                groups,
                independentMethods: independentMethods.filter(method => !method.walletGroupId),
                summary: {
                    totalBalance,
                    totalCreditLimit,
                    totalAvailableCredit,
                    totalUsedCredit: totalCreditLimit - totalAvailableCredit,
                    groupsCount: groups.length,
                    paymentMethodsCount: groups.reduce((acc, group) => acc + group.paymentMethods.length, 0) +
                        independentMethods.filter(method => !method.walletGroupId).length,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar visão geral das carteiras', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.WalletsV2Controller = WalletsV2Controller;
__decorate([
    (0, common_1.Post)('groups'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wallet_group_dto_1.CreateWalletGroupDto, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('groups'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "findAllGroups", null);
__decorate([
    (0, common_1.Get)('groups/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getWalletGroupTypes", null);
__decorate([
    (0, common_1.Post)('groups/create-defaults'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "createDefaultGroups", null);
__decorate([
    (0, common_1.Get)('groups/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "findOneGroup", null);
__decorate([
    (0, common_1.Patch)('groups/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "removeGroup", null);
__decorate([
    (0, common_1.Post)('payment-methods'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_method_dto_1.CreatePaymentMethodDto, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "createPaymentMethod", null);
__decorate([
    (0, common_1.Get)('payment-methods'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('walletGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "findAllPaymentMethods", null);
__decorate([
    (0, common_1.Get)('payment-methods/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getPaymentMethodTypes", null);
__decorate([
    (0, common_1.Get)('payment-methods/by-type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getPaymentMethodsByType", null);
__decorate([
    (0, common_1.Get)('payment-methods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "findOnePaymentMethod", null);
__decorate([
    (0, common_1.Patch)('payment-methods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "updatePaymentMethod", null);
__decorate([
    (0, common_1.Patch)('payment-methods/:id/balance'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "updateBalance", null);
__decorate([
    (0, common_1.Delete)('payment-methods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "removePaymentMethod", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getOverview", null);
exports.WalletsV2Controller = WalletsV2Controller = __decorate([
    (0, common_1.Controller)('wallets-v2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wallet_groups_service_1.WalletGroupsService,
        payment_methods_service_1.PaymentMethodsService])
], WalletsV2Controller);
//# sourceMappingURL=wallets-v2.controller.js.map