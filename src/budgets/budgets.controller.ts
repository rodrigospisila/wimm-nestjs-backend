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
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Request() req, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.userId, createBudgetDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('month', ParseIntPipe) month?: number,
    @Query('year', ParseIntPipe) year?: number,
  ) {
    return this.budgetsService.findAll(req.user.userId, month, year);
  }

  @Get('summary')
  getBudgetSummary(
    @Request() req,
    @Query('month', ParseIntPipe) month?: number,
    @Query('year', ParseIntPipe) year?: number,
  ) {
    return this.budgetsService.getBudgetSummary(req.user.userId, month, year);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.budgetsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(req.user.userId, id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.budgetsService.remove(req.user.userId, id);
  }
}
