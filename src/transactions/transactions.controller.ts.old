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
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { InstallmentsService } from './installments.service';
import { InstallmentsProcessorService } from './installments-processor.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateInstallmentTransactionDto } from './dto/create-installment-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly installmentsService: InstallmentsService,
    private readonly installmentsProcessorService: InstallmentsProcessorService,
  ) {}

  @Post()
  create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, createTransactionDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('walletId') walletId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};

    if (type) filters.type = type;
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (walletId) filters.walletId = parseInt(walletId);
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    return this.transactionsService.findAll(req.user.id, filters);
  }

  @Get('statistics')
  getStatistics(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('walletId') walletId?: string,
  ) {
    const filters: any = {};

    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (walletId) filters.walletId = parseInt(walletId);

    return this.transactionsService.getStatistics(req.user.id, filters);
  }

  @Get('monthly-report/:year/:month')
  getMonthlyReport(
    @Request() req,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Mês deve estar entre 1 e 12');
    }

    if (year < 2000 || year > 2100) {
      throw new BadRequestException('Ano deve estar entre 2000 e 2100');
    }

    return this.transactionsService.getMonthlyReport(req.user.id, year, month);
  }

  // ==================== ENDPOINTS DE PARCELAS ====================
  // IMPORTANTE: Rotas específicas devem vir ANTES das rotas com parâmetros (:id)

  @Post('installments')
  createInstallment(
    @Request() req,
    @Body() createInstallmentDto: CreateInstallmentTransactionDto,
  ) {
    return this.installmentsService.createInstallmentTransaction(
      req.user.id,
      createInstallmentDto,
    );
  }

  @Get('installments')
  findAllInstallments(
    @Request() req,
    @Query('categoryId') categoryId?: string,
    @Query('walletId') walletId?: string,
    @Query('creditCardId') creditCardId?: string,
    @Query('status') status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};

    // Validar e converter parâmetros numéricos
    if (categoryId && categoryId.trim() !== '') {
      const parsedCategoryId = parseInt(categoryId);
      if (!isNaN(parsedCategoryId)) {
        filters.categoryId = parsedCategoryId;
      }
    }

    if (walletId && walletId.trim() !== '') {
      const parsedWalletId = parseInt(walletId);
      if (!isNaN(parsedWalletId)) {
        filters.walletId = parsedWalletId;
      }
    }

    if (creditCardId && creditCardId.trim() !== '') {
      const parsedCreditCardId = parseInt(creditCardId);
      if (!isNaN(parsedCreditCardId)) {
        filters.creditCardId = parsedCreditCardId;
      }
    }

    if (status && ['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      filters.status = status;
    }

    if (limit && limit.trim() !== '') {
      const parsedLimit = parseInt(limit);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        filters.limit = parsedLimit;
      }
    }

    if (offset && offset.trim() !== '') {
      const parsedOffset = parseInt(offset);
      if (!isNaN(parsedOffset) && parsedOffset >= 0) {
        filters.offset = parsedOffset;
      }
    }

    return this.installmentsService.findAllInstallments(req.user.id, filters);
  }

  @Get('installments/statistics')
  getInstallmentStatistics(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters: any = {};

    if (startDate && startDate.trim() !== '') {
      filters.startDate = startDate;
    }
    
    if (endDate && endDate.trim() !== '') {
      filters.endDate = endDate;
    }
    
    if (categoryId && categoryId.trim() !== '') {
      const parsedCategoryId = parseInt(categoryId);
      if (!isNaN(parsedCategoryId)) {
        filters.categoryId = parsedCategoryId;
      }
    }

    return this.installmentsService.getInstallmentStatistics(req.user.id, filters);
  }

  @Get('installments/:id')
  findOneInstallment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.installmentsService.findOneInstallment(req.user.id, id);
  }

  @Delete('installments/:id')
  cancelInstallment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.installmentsService.cancelInstallment(req.user.id, id);
  }

  @Get('upcoming-payments')
  getUpcomingPayments(
    @Request() req,
    @Query('days') days?: string,
    @Query('limit') limit?: string,
  ) {
    const daysAhead = days ? parseInt(days) : 30;
    const limitResults = limit ? parseInt(limit) : 10;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    return this.transactionsService.findAll(req.user.id, {
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      limit: limitResults,
    });
  }

  // Endpoints do Processador de Parcelas

  @Post('installments/process')
  async processInstallments(@Request() req) {
    await this.installmentsProcessorService.processUserInstallments(req.user.id);
    return { message: 'Parcelas processadas com sucesso' };
  }

  @Get('installments/upcoming')
  async getUpcomingInstallments(
    @Request() req,
    @Query('days') days?: string,
  ) {
    let daysAhead = 7; // valor padrão
    
    if (days && days.trim() !== '') {
      const parsedDays = parseInt(days);
      if (!isNaN(parsedDays) && parsedDays > 0) {
        daysAhead = parsedDays;
      }
    }
    
    return this.installmentsProcessorService.getUpcomingInstallments(req.user.id, daysAhead);
  }

  @Get('installments/monthly-report/:year/:month')
  async getInstallmentsMonthlyReport(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.installmentsProcessorService.generateMonthlyReport(year, month);
  }

  @Post('installments/process-all')
  async processAllInstallments() {
    await this.installmentsProcessorService.processInstallmentsManually();
    return { message: 'Todas as parcelas foram processadas' };
  }

  // ==================== ENDPOINTS COM PARÂMETROS ====================
  // IMPORTANTE: Rotas com parâmetros (:id) devem vir DEPOIS das rotas específicas

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(req.user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(req.user.id, id);
  }
}
