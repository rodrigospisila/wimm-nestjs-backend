import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class PaymentMethodsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createPaymentMethodDto: CreatePaymentMethodDto): Promise<any>;
    findAll(userId: number, walletGroupId?: number): Promise<any>;
    findOne(id: number, userId: number): Promise<any>;
    update(id: number, userId: number, updateData: Partial<CreatePaymentMethodDto>): Promise<any>;
    remove(id: number, userId: number): Promise<any>;
    updateBalance(id: number, userId: number, amount: number, operation: 'add' | 'subtract'): Promise<any>;
    getByType(userId: number, type: string): Promise<any>;
}
