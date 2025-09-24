import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(
    private readonly walletGroupsService: WalletGroupsService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  @Get()
  async findAll(@Request() req, @Query('type') type?: string) {
    const userId = req.user.userId;
    
    // Retornar métodos de pagamento como "wallets" para compatibilidade V1
    const paymentMethods = await this.paymentMethodsService.findAllByUser(userId);
    
    // Converter para formato V1
    const wallets = paymentMethods.map(method => ({
      id: method.id,
      name: method.name,
      type: method.type,
      balance: method.currentBalance,
      isActive: method.isActive,
      color: method.color,
      icon: method.icon,
      // Campos específicos para compatibilidade
      creditLimit: method.creditLimit,
      availableLimit: method.availableLimit,
      walletGroup: method.walletGroup,
    }));

    return wallets;
  }

  @Get('types')
  async getTypes() {
    return this.paymentMethodsService.getTypes();
  }

  @Get('summary')
  async getSummary(@Request() req) {
    const userId = req.user.userId;
    
    const [
      totalBalance,
      totalCreditLimit,
      totalAvailableCredit,
      paymentMethodsCount,
    ] = await Promise.all([
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

  @Get('statistics')
  async getStatistics(@Request() req) {
    const userId = req.user.userId;
    return this.getSummary(req);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    const method = await this.paymentMethodsService.findOne(userId, id);
    
    // Converter para formato V1
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

  @Post()
  async create(@Request() req, @Body() createWalletDto: any) {
    const userId = req.user.userId;
    
    // Converter dados V1 para V2
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
    
    // Retornar no formato V1
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

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletDto: any,
  ) {
    const userId = req.user.userId;
    
    // Converter dados V1 para V2
    const updateMethodDto = {
      name: updateWalletDto.name,
      currentBalance: updateWalletDto.balance,
      creditLimit: updateWalletDto.creditLimit,
      color: updateWalletDto.color,
      icon: updateWalletDto.icon,
    };

    const method = await this.paymentMethodsService.update(userId, id, updateMethodDto);
    
    // Retornar no formato V1
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

  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.paymentMethodsService.remove(userId, id);
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    const method = await this.paymentMethodsService.findOne(userId, id);
    
    // Para toggle active, precisamos usar um método específico ou implementar no service
    // Por enquanto, vamos retornar o método atual
    const updated = method;

    return {
      id: updated.id,
      name: updated.name,
      isActive: updated.isActive,
    };
  }

  @Get(':id/balance-history')
  async getBalanceHistory(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    
    // Por enquanto, retornar array vazio
    // TODO: Implementar histórico de saldos se necessário
    return {
      history: [],
      currentBalance: 0,
    };
  }
}
