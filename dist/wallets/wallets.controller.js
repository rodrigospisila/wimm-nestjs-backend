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
exports.WalletsController = void 0;
const common_1 = require("@nestjs/common");
const wallets_service_1 = require("./wallets.service");
const create_wallet_dto_1 = require("./dto/create-wallet.dto");
const update_wallet_dto_1 = require("./dto/update-wallet.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WalletsController = class WalletsController {
    walletsService;
    constructor(walletsService) {
        this.walletsService = walletsService;
    }
    async create(createWalletDto, req) {
        try {
            return await this.walletsService.create(req.user.id, createWalletDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao criar carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(req, type) {
        try {
            return await this.walletsService.findAll(req.user.id, type);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar carteiras', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSummary(req) {
        try {
            return await this.walletsService.getSummary(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar resumo das carteiras', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getWalletTypes() {
        return {
            types: [
                { value: 'CHECKING_ACCOUNT', label: 'Conta Corrente', icon: 'bank' },
                { value: 'SAVINGS_ACCOUNT', label: 'Conta Poupança', icon: 'piggy-bank' },
                { value: 'CASH', label: 'Dinheiro', icon: 'cash' },
                { value: 'INVESTMENT', label: 'Investimento', icon: 'trending-up' },
                { value: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: 'credit-card' },
                { value: 'OTHER', label: 'Outros', icon: 'wallet' },
            ],
        };
    }
    async getStatistics(req) {
        try {
            return await this.walletsService.getStatistics(req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar estatísticas das carteiras', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id, req) {
        try {
            const wallet = await this.walletsService.findOne(parseInt(id), req.user.id);
            if (!wallet) {
                throw new common_1.HttpException('Carteira não encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            return wallet;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao buscar carteira', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBalanceHistory(id, req, days = '30') {
        try {
            return await this.walletsService.getBalanceHistory(parseInt(id), req.user.id, parseInt(days));
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar histórico de saldo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateWalletDto, req) {
        try {
            const wallet = await this.walletsService.update(parseInt(id), req.user.id, updateWalletDto);
            if (!wallet) {
                throw new common_1.HttpException('Carteira não encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            return wallet;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Erro ao atualizar carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async toggleActive(id, req) {
        try {
            return await this.walletsService.toggleActive(parseInt(id), req.user.id);
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao alterar status da carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id, req) {
        try {
            const result = await this.walletsService.remove(parseInt(id), req.user.id);
            if (!result) {
                throw new common_1.HttpException('Carteira não encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Carteira removida com sucesso' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Erro ao remover carteira', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.WalletsController = WalletsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wallet_dto_1.CreateWalletDto, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getWalletTypes", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/balance-history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getBalanceHistory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_wallet_dto_1.UpdateWalletDto, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "remove", null);
exports.WalletsController = WalletsController = __decorate([
    (0, common_1.Controller)('wallets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wallets_service_1.WalletsService])
], WalletsController);
//# sourceMappingURL=wallets.controller.js.map