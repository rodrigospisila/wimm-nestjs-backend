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
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Controller('wallets-v2')
@UseGuards(JwtAuthGuard)
export class WalletsV2Controller {
  constructor(
    private readonly walletGroupsService: WalletGroupsService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  @Get('overview')
  async getOverview(@Request() req) {
    const userId = req.user.userId;
    
    const [groups, independentMethods, summary] = await Promise.all([
      this.walletGroupsService.findAllByUser(userId),
      this.paymentMethodsService.findIndependentByUser(userId),
      this.getFinancialSummary(userId),
    ]);

    return {
      groups,
      independentMethods,
      summary,
    };
  }

  @Get('groups')
  async getAllGroups(@Request() req) {
    const userId = req.user.userId;
    return this.walletGroupsService.findAllByUser(userId);
  }

  @Post('groups')
  async createGroup(@Request() req, @Body() createGroupDto: CreateWalletGroupDto) {
    const userId = req.user.userId;
    return this.walletGroupsService.create(userId, createGroupDto);
  }

  @Patch('groups/:id')
  async updateGroup(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: Partial<CreateWalletGroupDto>,
  ) {
    const userId = req.user.userId;
    return this.walletGroupsService.update(userId, id, updateGroupDto);
  }

  @Delete('groups/:id')
  async deleteGroup(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.walletGroupsService.remove(userId, id);
  }

  @Get('groups/types')
  async getGroupTypes() {
    return this.walletGroupsService.getTypes();
  }

  @Post('groups/create-defaults')
  async createDefaultGroups(@Request() req) {
    const userId = req.user.userId;
    return this.walletGroupsService.createDefaults(userId);
  }

  @Get('payment-methods')
  async getAllPaymentMethods(@Request() req, @Query('groupId') groupId?: string) {
    const userId = req.user.userId;
    const groupIdNum = groupId ? parseInt(groupId) : undefined;
    return this.paymentMethodsService.findAllByUser(userId, groupIdNum);
  }

  @Post('payment-methods')
  async createPaymentMethod(@Request() req, @Body() createMethodDto: CreatePaymentMethodDto) {
    const userId = req.user.userId;
    return this.paymentMethodsService.create(userId, createMethodDto);
  }

  @Patch('payment-methods/:id')
  async updatePaymentMethod(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMethodDto: Partial<CreatePaymentMethodDto>,
  ) {
    const userId = req.user.userId;
    return this.paymentMethodsService.update(userId, id, updateMethodDto);
  }

  @Delete('payment-methods/:id')
  async deletePaymentMethod(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.paymentMethodsService.remove(userId, id);
  }

  @Get('payment-methods/types')
  async getPaymentMethodTypes() {
    return this.paymentMethodsService.getTypes();
  }

  @Patch('payment-methods/:id/set-primary')
  async setPrimaryPaymentMethod(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.userId;
    return this.paymentMethodsService.setPrimary(userId, id);
  }

  private async getFinancialSummary(userId: number) {
    const [
      totalBalance,
      totalCreditLimit,
      totalAvailableCredit,
      groupsCount,
      paymentMethodsCount,
    ] = await Promise.all([
      this.paymentMethodsService.getTotalBalance(userId),
      this.paymentMethodsService.getTotalCreditLimit(userId),
      this.paymentMethodsService.getTotalAvailableCredit(userId),
      this.walletGroupsService.getCount(userId),
      this.paymentMethodsService.getCount(userId),
    ]);

    const totalUsedCredit = totalCreditLimit - totalAvailableCredit;

    return {
      totalBalance,
      totalCreditLimit,
      totalAvailableCredit,
      totalUsedCredit,
      groupsCount,
      paymentMethodsCount,
    };
  }
}
