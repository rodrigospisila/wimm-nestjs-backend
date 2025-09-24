import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
export declare class WalletGroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createWalletGroupDto: CreateWalletGroupDto): Promise<any>;
    findAll(userId: number): Promise<any>;
    findOne(id: number, userId: number): Promise<any>;
    update(id: number, userId: number, updateData: Partial<CreateWalletGroupDto>): Promise<any>;
    remove(id: number, userId: number): Promise<any>;
    createDefaultWalletGroups(userId: number): Promise<any[]>;
}
