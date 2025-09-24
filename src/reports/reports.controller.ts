import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboard(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getDashboard(userId, start, end);
  }

  @Get('overview')
  async getOverview(@Request() req) {
    const userId = req.user.userId;
    return this.reportsService.getOverview(userId);
  }

  @Get('categories')
  async getCategoryReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
  ) {
    const userId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getCategoryReport(userId, start, end, type);
  }

  @Get('time-analysis')
  async getTimeAnalysis(
    @Request() req,
    @Query('period') period?: string,
    @Query('type') type?: string,
  ) {
    const userId = req.user.userId;
    return this.reportsService.getTimeAnalysis(userId, period, type);
  }

  @Get('installments')
  async getInstallmentReport(@Request() req) {
    const userId = req.user.userId;
    return this.reportsService.getInstallmentReport(userId);
  }

  @Get('payment-methods')
  async getPaymentMethodReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getPaymentMethodReport(userId, start, end);
  }

  @Get('balance-evolution')
  async getBalanceEvolution(
    @Request() req,
    @Query('months') months?: string,
  ) {
    const userId = req.user.userId;
    const monthsNum = months ? parseInt(months) : 12;
    return this.reportsService.getBalanceEvolution(userId, monthsNum);
  }

  @Get('monthly-summary')
  async getMonthlySummary(
    @Request() req,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const userId = req.user.userId;
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
    return this.reportsService.getMonthlySummary(userId, yearNum, monthNum);
  }
}
