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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const wallet_groups_service_1 = require("./wallet-groups.service");
const payment_methods_service_1 = require("./payment-methods.service");
const create_wallet_group_dto_1 = require("./dto/create-wallet-group.dto");
const create_payment_method_dto_1 = require("./dto/create-payment-method.dto");
let WalletsV2Controller = class WalletsV2Controller {
    walletGroupsService;
    paymentMethodsService;
    constructor(walletGroupsService, paymentMethodsService) {
        this.walletGroupsService = walletGroupsService;
        this.paymentMethodsService = paymentMethodsService;
    }
    async getOverview(req) {
        const userId = req.user.userId;
        const [groups, independentMethods, summary] = await Promise.all([
            this.walletGroupsService.findAllByUser(userId),
            this.paymentMethodsService.findIndependentByUser(userId),
            this.getFinancialSummary(userId),
        ]);
        return {
            groups,
            independentMethods,
            summary,
        };
    }
    async getAllGroups(req) {
        const userId = req.user.userId;
        return this.walletGroupsService.findAllByUser(userId);
    }
    async createGroup(req, createGroupDto) {
        const userId = req.user.userId;
        return this.walletGroupsService.create(userId, createGroupDto);
    }
    async updateGroup(req, id, updateGroupDto) {
        const userId = req.user.userId;
        return this.walletGroupsService.update(userId, id, updateGroupDto);
    }
    async deleteGroup(req, id) {
        const userId = req.user.userId;
        return this.walletGroupsService.remove(userId, id);
    }
    async getGroupTypes() {
        return this.walletGroupsService.getTypes();
    }
    async createDefaultGroups(req) {
        const userId = req.user.userId;
        return this.walletGroupsService.createDefaults(userId);
    }
    async getAllPaymentMethods(req, groupId) {
        const userId = req.user.userId;
        const groupIdNum = groupId ? parseInt(groupId) : undefined;
        return this.paymentMethodsService.findAllByUser(userId, groupIdNum);
    }
    async createPaymentMethod(req, createMethodDto) {
        const userId = req.user.userId;
        return this.paymentMethodsService.create(userId, createMethodDto);
    }
    async updatePaymentMethod(req, id, updateMethodDto) {
        const userId = req.user.userId;
        return this.paymentMethodsService.update(userId, id, updateMethodDto);
    }
    async deletePaymentMethod(req, id) {
        const userId = req.user.userId;
        return this.paymentMethodsService.remove(userId, id);
    }
    async getPaymentMethodTypes() {
        return this.paymentMethodsService.getTypes();
    }
    async setPrimaryPaymentMethod(req, id) {
        const userId = req.user.userId;
        return this.paymentMethodsService.setPrimary(userId, id);
    }
    async getFinancialSummary(userId) {
        const [totalBalance, totalCreditLimit, totalAvailableCredit, groupsCount, paymentMethodsCount,] = await Promise.all([
            this.paymentMethodsService.getTotalBalance(userId),
            this.paymentMethodsService.getTotalCreditLimit(userId),
            this.paymentMethodsService.getTotalAvailableCredit(userId),
            this.walletGroupsService.getCount(userId),
            this.paymentMethodsService.getCount(userId),
        ]);
        const totalUsedCredit = totalCreditLimit - totalAvailableCredit;
        return {
            totalBalance,
            totalCreditLimit,
            totalAvailableCredit,
            totalUsedCredit,
            groupsCount,
            paymentMethodsCount,
        };
    }
};
exports.WalletsV2Controller = WalletsV2Controller;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('groups'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getAllGroups", null);
__decorate([
    (0, common_1.Post)('groups'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_wallet_group_dto_1.CreateWalletGroupDto]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "createGroup", null);
__decorate([
    (0, common_1.Patch)('groups/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "deleteGroup", null);
__decorate([
    (0, common_1.Get)('groups/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getGroupTypes", null);
__decorate([
    (0, common_1.Post)('groups/create-defaults'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "createDefaultGroups", null);
__decorate([
    (0, common_1.Get)('payment-methods'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getAllPaymentMethods", null);
__decorate([
    (0, common_1.Post)('payment-methods'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_method_dto_1.CreatePaymentMethodDto]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "createPaymentMethod", null);
__decorate([
    (0, common_1.Patch)('payment-methods/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "updatePaymentMethod", null);
__decorate([
    (0, common_1.Delete)('payment-methods/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "deletePaymentMethod", null);
__decorate([
    (0, common_1.Get)('payment-methods/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "getPaymentMethodTypes", null);
__decorate([
    (0, common_1.Patch)('payment-methods/:id/set-primary'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WalletsV2Controller.prototype, "setPrimaryPaymentMethod", null);
exports.WalletsV2Controller = WalletsV2Controller = __decorate([
    (0, common_1.Controller)('wallets-v2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wallet_groups_service_1.WalletGroupsService,
        payment_methods_service_1.PaymentMethodsService])
], WalletsV2Controller);
//# sourceMappingURL=wallets-v2.controller.js.map