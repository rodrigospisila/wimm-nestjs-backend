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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletsService = class WalletsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createWalletDto) {
        const { name, initialBalance } = createWalletDto;
        const wallet = await this.prisma.wallet.create({
            data: {
                name,
                initialBalance,
                currentBalance: initialBalance,
                userId,
            },
        });
        return wallet;
    }
    async findAll(userId) {
        const wallets = await this.prisma.wallet.findMany({
            where: { userId },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 5,
                },
            },
        });
        return wallets;
    }
    async findOne(id, userId) {
        const wallet = await this.prisma.wallet.findFirst({
            where: { id, userId },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        return wallet;
    }
    async update(id, userId, updateWalletDto) {
        const existingWallet = await this.prisma.wallet.findFirst({
            where: { id, userId },
        });
        if (!existingWallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        const wallet = await this.prisma.wallet.update({
            where: { id },
            data: updateWalletDto,
        });
        return wallet;
    }
    async remove(id, userId) {
        const existingWallet = await this.prisma.wallet.findFirst({
            where: { id, userId },
        });
        if (!existingWallet) {
            throw new common_1.NotFoundException('Wallet not found');
        }
        await this.prisma.wallet.delete({
            where: { id },
        });
        return { message: 'Wallet deleted successfully' };
    }
    async getSummary(userId) {
        const wallets = await this.prisma.wallet.findMany({
            where: { userId },
        });
        const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.currentBalance, 0);
        const walletsCount = wallets.length;
        return {
            totalBalance,
            walletsCount,
            wallets: wallets.map(wallet => ({
                id: wallet.id,
                name: wallet.name,
                currentBalance: wallet.currentBalance,
            })),
        };
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map