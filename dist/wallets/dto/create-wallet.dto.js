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
exports.CreateWalletDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateWalletDto {
    name;
    initialBalance;
    type;
    description;
    color;
    icon;
}
exports.CreateWalletDto = CreateWalletDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Saldo inicial deve ser um número' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWalletDto.prototype, "initialBalance", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.WalletType, { message: 'Tipo de carteira inválido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Descrição deve ter no máximo 200 caracteres' }),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)({ message: 'Cor deve estar no formato hexadecimal (#RRGGBB)' }),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(30, { message: 'Ícone deve ter no máximo 30 caracteres' }),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "icon", void 0);
//# sourceMappingURL=create-wallet.dto.js.map