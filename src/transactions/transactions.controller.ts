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
import { TransactionsService } from './transactions.service';
import { InstallmentsService } from './installments.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly installmentsService: InstallmentsService,
  ) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('paymentMethodId') paymentMethodId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;
    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : undefined,
      type: type as any,
      search: search || undefined,
    };
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    };

    return this.transactionsService.findAllByUser(userId, filters, pagination);
  }

  @Get('summary')
  async getSummary(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.transactionsService.getSummary(userId, start, end);
  }

  @Get('recent')
  async getRecent(@Request() req, @Query('limit') limit?: string) {
    const userId = req.user.userId;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.transactionsService.getRecent(userId, limitNum);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.transactionsService.findOne(userId, id);
  }

  @Post()
  async create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    const userId = req.user.userId;
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const userId = req.user.userId;
    return this.transactionsService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.transactionsService.remove(userId, id);
  }

  // Endpoints para Parcelamentos
  @Post('installments')
  async createInstallment(@Request() req, @Body() createInstallmentDto: CreateInstallmentDto) {
    const userId = req.user.userId;
    return this.installmentsService.create(userId, createInstallmentDto);
  }

  @Get('installments')
  async getInstallments(
    @Request() req,
    @Query('status') status?: string,
    @Query('paymentMethodId') paymentMethodId?: string,
  ) {
    const userId = req.user.userId;
    const filters = {
      status: status as any,
      paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : undefined,
    };
    return this.installmentsService.findAllByUser(userId, filters);
  }

  @Get('installments/:id')
  async getInstallment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.installmentsService.findOne(userId, id);
  }

  @Patch('installments/:id/pay')
  async payInstallment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() paymentData: { installmentNumber: number; paidAmount?: number },
  ) {
    const userId = req.user.userId;
    return this.installmentsService.payInstallment(userId, id, paymentData.installmentNumber, paymentData.paidAmount);
  }

  @Delete('installments/:id')
  async removeInstallment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.installmentsService.remove(userId, id);
  }

  // Endpoints para Transferências
  @Post('transfers')
  async createTransfer(
    @Request() req,
    @Body() transferData: {
      description: string;
      amount: number;
      fromPaymentMethodId: number;
      toPaymentMethodId: number;
      date?: string;
    },
  ) {
    const userId = req.user.userId;
    return this.transactionsService.createTransfer(userId, transferData);
  }
}
