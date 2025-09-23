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
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletGroupType, PaymentMethodType } from '@prisma/client';

@Controller('wallets-v2')
@UseGuards(JwtAuthGuard)
export class WalletsV2Controller {
  constructor(
    private readonly walletGroupsService: WalletGroupsService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  // ==================== WALLET GROUPS ====================

  @Post('groups')
  async createGroup(@Body() createWalletGroupDto: CreateWalletGroupDto, @Request() req) {
    try {
      return await this.walletGroupsService.create(req.user.id, createWalletGroupDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao criar grupo de carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('groups')
  async findAllGroups(@Request() req) {
    try {
      return await this.walletGroupsService.findAll(req.user.id);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar grupos de carteiras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('groups/types')
  async getWalletGroupTypes() {
    return {
      types: [
        { 
          value: WalletGroupType.DIGITAL_WALLET, 
          label: 'Carteira Digital', 
          icon: 'smartphone',
          description: 'Nubank, Mercado Pago, PicPay, etc.'
        },
        { 
          value: WalletGroupType.TRADITIONAL_BANK, 
          label: 'Banco Tradicional', 
          icon: 'bank',
          description: 'Itaú, Bradesco, Santander, etc.'
        },
        { 
          value: WalletGroupType.INVESTMENT, 
          label: 'Investimentos', 
          icon: 'trending-up',
          description: 'XP, Rico, Clear, etc.'
        },
        { 
          value: WalletGroupType.OTHER, 
          label: 'Outros', 
          icon: 'wallet',
          description: 'Outras instituições'
        },
      ],
    };
  }

  @Post('groups/create-defaults')
  async createDefaultGroups(@Request() req) {
    try {
      return await this.walletGroupsService.createDefaultWalletGroups(req.user.id);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar grupos padrão',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('groups/:id')
  async findOneGroup(@Param('id') id: string, @Request() req) {
    try {
      return await this.walletGroupsService.findOne(parseInt(id), req.user.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao buscar grupo de carteira',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('groups/:id')
  async updateGroup(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateWalletGroupDto>,
    @Request() req,
  ) {
    try {
      return await this.walletGroupsService.update(parseInt(id), req.user.id, updateData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Erro ao atualizar grupo de carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('groups/:id')
  async removeGroup(@Param('id') id: string, @Request() req) {
    try {
      await this.walletGroupsService.remove(parseInt(id), req.user.id);
      return { message: 'Grupo de carteira removido com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao remover grupo de carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==================== PAYMENT METHODS ====================

  @Post('payment-methods')
  async createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto, @Request() req) {
    try {
      return await this.paymentMethodsService.create(req.user.id, createPaymentMethodDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao criar método de pagamento',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('payment-methods')
  async findAllPaymentMethods(@Request() req, @Query('walletGroupId') walletGroupId?: string) {
    try {
      const groupId = walletGroupId ? parseInt(walletGroupId) : undefined;
      return await this.paymentMethodsService.findAll(req.user.id, groupId);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar métodos de pagamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('payment-methods/types')
  async getPaymentMethodTypes() {
    return {
      types: [
        { 
          value: PaymentMethodType.CREDIT_CARD, 
          label: 'Cartão de Crédito', 
          icon: 'credit-card',
          requiresGroup: true,
          description: 'Cartão de crédito da carteira'
        },
        { 
          value: PaymentMethodType.DEBIT_CARD, 
          label: 'Cartão de Débito', 
          icon: 'card',
          requiresGroup: true,
          description: 'Cartão de débito da carteira'
        },
        { 
          value: PaymentMethodType.WALLET_BALANCE, 
          label: 'Saldo da Carteira', 
          icon: 'wallet',
          requiresGroup: true,
          description: 'Saldo disponível na carteira digital'
        },
        { 
          value: PaymentMethodType.PIX, 
          label: 'PIX', 
          icon: 'pix',
          requiresGroup: true,
          description: 'PIX da carteira'
        },
        { 
          value: PaymentMethodType.CHECKING_ACCOUNT, 
          label: 'Conta Corrente', 
          icon: 'bank',
          requiresGroup: false,
          description: 'Conta corrente independente'
        },
        { 
          value: PaymentMethodType.SAVINGS_ACCOUNT, 
          label: 'Poupança', 
          icon: 'piggy-bank',
          requiresGroup: false,
          description: 'Conta poupança independente'
        },
        { 
          value: PaymentMethodType.CASH, 
          label: 'Dinheiro', 
          icon: 'cash',
          requiresGroup: false,
          description: 'Dinheiro em espécie'
        },
        { 
          value: PaymentMethodType.INVESTMENT, 
          label: 'Investimento', 
          icon: 'trending-up',
          requiresGroup: false,
          description: 'Conta de investimentos'
        },
        { 
          value: PaymentMethodType.OTHER, 
          label: 'Outros', 
          icon: 'more-horizontal',
          requiresGroup: false,
          description: 'Outros métodos de pagamento'
        },
      ],
    };
  }

  @Get('payment-methods/by-type/:type')
  async getPaymentMethodsByType(@Param('type') type: string, @Request() req) {
    try {
      const paymentMethodType = type.toUpperCase() as PaymentMethodType;
      return await this.paymentMethodsService.getByType(req.user.id, paymentMethodType);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar métodos de pagamento por tipo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('payment-methods/:id')
  async findOnePaymentMethod(@Param('id') id: string, @Request() req) {
    try {
      return await this.paymentMethodsService.findOne(parseInt(id), req.user.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao buscar método de pagamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('payment-methods/:id')
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePaymentMethodDto>,
    @Request() req,
  ) {
    try {
      return await this.paymentMethodsService.update(parseInt(id), req.user.id, updateData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Erro ao atualizar método de pagamento',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('payment-methods/:id/balance')
  async updateBalance(
    @Param('id') id: string,
    @Body() { amount, operation }: { amount: number; operation: 'add' | 'subtract' },
    @Request() req,
  ) {
    try {
      return await this.paymentMethodsService.updateBalance(parseInt(id), req.user.id, amount, operation);
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar saldo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('payment-methods/:id')
  async removePaymentMethod(@Param('id') id: string, @Request() req) {
    try {
      await this.paymentMethodsService.remove(parseInt(id), req.user.id);
      return { message: 'Método de pagamento removido com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao remover método de pagamento',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ==================== OVERVIEW ====================

  @Get('overview')
  async getOverview(@Request() req) {
    try {
      const groups = await this.walletGroupsService.findAll(req.user.id);
      const independentMethods = await this.paymentMethodsService.findAll(req.user.id, undefined);
      
      // Calcular totais
      let totalBalance = 0;
      let totalCreditLimit = 0;
      let totalAvailableCredit = 0;

      // Somar saldos dos grupos
      groups.forEach(group => {
        group.paymentMethods.forEach(method => {
          totalBalance += method.currentBalance;
          if (method.type === PaymentMethodType.CREDIT_CARD) {
            totalCreditLimit += method.creditLimit || 0;
            totalAvailableCredit += method.availableLimit || 0;
          }
        });
      });

      // Somar saldos dos métodos independentes
      independentMethods.forEach(method => {
        if (!method.walletGroupId) {
          totalBalance += method.currentBalance;
          if (method.type === PaymentMethodType.CREDIT_CARD) {
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
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar visão geral das carteiras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
