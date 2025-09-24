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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const transactions_service_1 = require("./transactions.service");
const installments_service_1 = require("./installments.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const create_installment_dto_1 = require("./dto/create-installment.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
let TransactionsController = class TransactionsController {
    transactionsService;
    installmentsService;
    constructor(transactionsService, installmentsService) {
        this.transactionsService = transactionsService;
        this.installmentsService = installmentsService;
    }
    async findAll(req, startDate, endDate, categoryId, paymentMethodId, type, page, limit) {
        const userId = req.user.userId;
        const filters = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : undefined,
            type: type,
        };
        const pagination = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 50,
        };
        return this.transactionsService.findAllByUser(userId, filters, pagination);
    }
    async getSummary(req, startDate, endDate) {
        const userId = req.user.userId;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.transactionsService.getSummary(userId, start, end);
    }
    async getRecent(req, limit) {
        const userId = req.user.userId;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.transactionsService.getRecent(userId, limitNum);
    }
    async findOne(req, id) {
        const userId = req.user.userId;
        return this.transactionsService.findOne(userId, id);
    }
    async create(req, createTransactionDto) {
        const userId = req.user.userId;
        return this.transactionsService.create(userId, createTransactionDto);
    }
    async update(req, id, updateTransactionDto) {
        const userId = req.user.userId;
        return this.transactionsService.update(userId, id, updateTransactionDto);
    }
    async remove(req, id) {
        const userId = req.user.userId;
        return this.transactionsService.remove(userId, id);
    }
    async createInstallment(req, createInstallmentDto) {
        const userId = req.user.userId;
        return this.installmentsService.create(userId, createInstallmentDto);
    }
    async getInstallments(req, status, paymentMethodId) {
        const userId = req.user.userId;
        const filters = {
            status: status,
            paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : undefined,
        };
        return this.installmentsService.findAllByUser(userId, filters);
    }
    async getInstallment(req, id) {
        const userId = req.user.userId;
        return this.installmentsService.findOne(userId, id);
    }
    async payInstallment(req, id, paymentData) {
        const userId = req.user.userId;
        return this.installmentsService.payInstallment(userId, id, paymentData.installmentNumber, paymentData.paidAmount);
    }
    async removeInstallment(req, id) {
        const userId = req.user.userId;
        return this.installmentsService.remove(userId, id);
    }
    async createTransfer(req, transferData) {
        const userId = req.user.userId;
        return this.transactionsService.createTransfer(userId, transferData);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('categoryId')),
    __param(4, (0, common_1.Query)('paymentMethodId')),
    __param(5, (0, common_1.Query)('type')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('installments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_installment_dto_1.CreateInstallmentDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createInstallment", null);
__decorate([
    (0, common_1.Get)('installments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('paymentMethodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getInstallments", null);
__decorate([
    (0, common_1.Get)('installments/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getInstallment", null);
__decorate([
    (0, common_1.Patch)('installments/:id/pay'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "payInstallment", null);
__decorate([
    (0, common_1.Delete)('installments/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "removeInstallment", null);
__decorate([
    (0, common_1.Post)('transfers'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransfer", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        installments_service_1.InstallmentsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map