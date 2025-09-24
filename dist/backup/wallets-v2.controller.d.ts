import { WalletGroupsService } from './wallet-groups.service';
import { PaymentMethodsService } from './payment-methods.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class WalletsV2Controller {
    private readonly walletGroupsService;
    private readonly paymentMethodsService;
    constructor(walletGroupsService: WalletGroupsService, paymentMethodsService: PaymentMethodsService);
    createGroup(createWalletGroupDto: CreateWalletGroupDto, req: any): Promise<any>;
    findAllGroups(req: any): Promise<any>;
    createDefaultGroups(req: any): Promise<any[]>;
    findOneGroup(id: string, req: any): Promise<any>;
    updateGroup(id: string, updateData: Partial<CreateWalletGroupDto>, req: any): Promise<any>;
    removeGroup(id: string, req: any): Promise<{
        message: string;
    }>;
    createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto, req: any): Promise<any>;
    findAllPaymentMethods(req: any, walletGroupId?: string): Promise<any>;
    getPaymentMethodsByType(type: string, req: any): Promise<any>;
    findOnePaymentMethod(id: string, req: any): Promise<any>;
    updatePaymentMethod(id: string, updateData: Partial<CreatePaymentMethodDto>, req: any): Promise<any>;
    updateBalance(id: string, { amount, operation }: {
        amount: number;
        operation: 'add' | 'subtract';
    }, req: any): Promise<any>;
    removePaymentMethod(id: string, req: any): Promise<{
        message: string;
    }>;
    getOverview(req: any): Promise<{
        groups: any;
        independentMethods: any;
        summary: {
            totalBalance: number;
            totalCreditLimit: number;
            totalAvailableCredit: number;
            totalUsedCredit: number;
            groupsCount: any;
            paymentMethodsCount: any;
        };
    }>;
}
