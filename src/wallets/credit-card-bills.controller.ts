import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreditCardBillsService } from './credit-card-bills.service';

@Controller('credit-cards')
@UseGuards(JwtAuthGuard)
export class CreditCardBillsController {
  constructor(private readonly creditCardBillsService: CreditCardBillsService) {}

  @Get()
  async getCreditCards(@Request() req) {
    const userId = req.user.userId;
    return this.creditCardBillsService.getCreditCards(userId);
  }

  @Get('bills')
  async getAllBills(@Request() req) {
    const userId = req.user.userId;
    return this.creditCardBillsService.getAllCreditCardBills(userId);
  }

  @Get(':id/bill')
  async getCreditCardBill(
    @Request() req,
    @Param('id', ParseIntPipe) paymentMethodId: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const userId = req.user.userId;
    const targetMonth = month ? parseInt(month) : undefined;
    const targetYear = year ? parseInt(year) : undefined;
    
    return this.creditCardBillsService.getCreditCardBill(
      userId,
      paymentMethodId,
      targetMonth,
      targetYear,
    );
  }

  @Get(':id/bills/history')
  async getBillHistory(
    @Request() req,
    @Param('id', ParseIntPipe) paymentMethodId: number,
    @Query('months') months?: string,
  ) {
    const userId = req.user.userId;
    const monthsCount = months ? parseInt(months) : 12;
    
    // TODO: Implementar histórico detalhado
    return { message: 'Histórico de faturas em desenvolvimento' };
  }

  @Get(':id/limit')
  async updateLimit(
    @Request() req,
    @Param('id', ParseIntPipe) paymentMethodId: number,
  ) {
    await this.creditCardBillsService.updateAvailableLimit(paymentMethodId);
    return { message: 'Limite atualizado com sucesso' };
  }
}
