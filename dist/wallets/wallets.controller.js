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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const wallet_groups_service_1 = require("./wallet-groups.service");
const payment_methods_service_1 = require("./payment-methods.service");
let WalletsController = class WalletsController {
    walletGroupsService;
    paymentMethodsService;
    constructor(walletGroupsService, paymentMethodsService) {
        this.walletGroupsService = walletGroupsService;
        this.paymentMethodsService = paymentMethodsService;
    }
    async findAll(req, type) {
        const userId = req.user.userId;
        const paymentMethods = await this.paymentMethodsService.findAllByUser(userId);
        const wallets = paymentMethods.map(method => ({
            id: method.id,
            name: method.name,
            type: method.type,
            balance: method.currentBalance,
            isActive: method.isActive,
            color: method.color,
            icon: method.icon,
            creditLimit: method.creditLimit,
            availableLimit: method.availableLimit,
            walletGroup: method.walletGroup,
        }));
        return wallets;
    }
    async getTypes() {
        return this.paymentMethodsService.getTypes();
    }
    async getSummary(req) {
        const userId = req.user.userId;
        const [totalBalance, totalCreditLimit, totalAvailableCredit, paymentMethodsCount,] = await Promise.all([
            this.paymentMethodsService.getTotalBalance(userId),
            this.paymentMethodsService.getTotalCreditLimit(userId),
            this.paymentMethodsService.getTotalAvailableCredit(userId),
            this.paymentMethodsService.getCount(userId),
        ]);
        return {
            totalBalance: totalBalance || 0,
            totalCreditLimit: totalCreditLimit || 0,
            totalAvailableCredit: totalAvailableCredit || 0,
            totalUsedCredit: (totalCreditLimit || 0) - (totalAvailableCredit || 0),
            walletsCount: paymentMethodsCount || 0,
        };
    }
    async getStatistics(req) {
        const userId = req.user.userId;
        return this.getSummary(req);
    }
    async findOne(req, id) {
        const userId = req.user.userId;
        const method = await this.paymentMethodsService.findOne(userId, id);
        return {
            id: method.id,
            name: method.name,
            type: method.type,
            balance: method.currentBalance,
            isActive: method.isActive,
            color: method.color,
            icon: method.icon,
            creditLimit: method.creditLimit,
            availableLimit: method.availableLimit,
            walletGroup: method.walletGroup,
        };
    }
    async create(req, createWalletDto) {
        const userId = req.user.userId;
        const createMethodDto = {
            name: createWalletDto.name,
            type: createWalletDto.type,
            currentBalance: createWalletDto.balance || 0,
            creditLimit: createWalletDto.creditLimit,
            color: createWalletDto.color || '#4CAF50',
            icon: createWalletDto.icon || 'credit-card',
            isPrimary: createWalletDto.isPrimary || false,
        };
        const method = await this.paymentMethodsService.create(userId, createMethodDto);
        return {
            id: method.id,
            name: method.name,
            type: method.type,
            balance: method.currentBalance,
            isActive: method.isActive,
            color: method.color,
            icon: method.icon,
        };
    }
    async update(req, id, updateWalletDto) {
        const userId = req.user.userId;
        const updateMethodDto = {
            name: updateWalletDto.name,
            currentBalance: updateWalletDto.balance,
            creditLimit: updateWalletDto.creditLimit,
            color: updateWalletDto.color,
            icon: updateWalletDto.icon,
        };
        const method = await this.paymentMethodsService.update(userId, id, updateMethodDto);
        return {
            id: method.id,
            name: method.name,
            type: method.type,
            balance: method.currentBalance,
            isActive: method.isActive,
            color: method.color,
            icon: method.icon,
        };
    }
    async remove(req, id) {
        const userId = req.user.userId;
        return this.paymentMethodsService.remove(userId, id);
    }
    async toggleActive(req, id) {
        const userId = req.user.userId;
        const method = await this.paymentMethodsService.findOne(userId, id);
        const updated = method;
        return {
            id: updated.id,
            name: updated.name,
            isActive: updated.isActive,
        };
    }
    async getBalanceHistory(req, id, startDate, endDate) {
        const userId = req.user.userId;
        return {
            history: [],
            currentBalance: 0,
        };
    }
};
exports.WalletsController = WalletsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getTypes", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Get)(':id/balance-history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getBalanceHistory", null);
exports.WalletsController = WalletsController = __decorate([
    (0, common_1.Controller)('wallets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wallet_groups_service_1.WalletGroupsService,
        payment_methods_service_1.PaymentMethodsService])
], WalletsController);
//# sourceMappingURL=wallets.controller.js.map