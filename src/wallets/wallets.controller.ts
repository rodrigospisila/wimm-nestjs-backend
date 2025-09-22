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
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto, @Request() req) {
    try {
      return await this.walletsService.create(req.user.id, createWalletDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao criar carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Request() req, @Query('type') type?: string) {
    try {
      return await this.walletsService.findAll(req.user.id, type);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar carteiras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('summary')
  async getSummary(@Request() req) {
    try {
      return await this.walletsService.getSummary(req.user.id);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar resumo das carteiras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('types')
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

  @Get('statistics')
  async getStatistics(@Request() req) {
    try {
      return await this.walletsService.getStatistics(req.user.id);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar estatísticas das carteiras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const wallet = await this.walletsService.findOne(parseInt(id), req.user.id);
      if (!wallet) {
        throw new HttpException('Carteira não encontrada', HttpStatus.NOT_FOUND);
      }
      return wallet;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao buscar carteira',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/balance-history')
  async getBalanceHistory(
    @Param('id') id: string,
    @Request() req,
    @Query('days') days: string = '30',
  ) {
    try {
      return await this.walletsService.getBalanceHistory(
        parseInt(id),
        req.user.id,
        parseInt(days),
      );
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar histórico de saldo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Request() req,
  ) {
    try {
      const wallet = await this.walletsService.update(
        parseInt(id),
        req.user.id,
        updateWalletDto,
      );
      if (!wallet) {
        throw new HttpException('Carteira não encontrada', HttpStatus.NOT_FOUND);
      }
      return wallet;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Erro ao atualizar carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string, @Request() req) {
    try {
      return await this.walletsService.toggleActive(parseInt(id), req.user.id);
    } catch (error) {
      throw new HttpException(
        'Erro ao alterar status da carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const result = await this.walletsService.remove(parseInt(id), req.user.id);
      if (!result) {
        throw new HttpException('Carteira não encontrada', HttpStatus.NOT_FOUND);
      }
      return { message: 'Carteira removida com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao remover carteira',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
