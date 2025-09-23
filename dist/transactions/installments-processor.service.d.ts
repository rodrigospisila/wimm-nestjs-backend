import { PrismaService } from '../prisma/prisma.service';
export declare class InstallmentsProcessorService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processInstallments(): Promise<void>;
    private processInstallment;
    private processCreditCardInstallment;
    private processFixedInstallment;
    private onInstallmentCompleted;
    private createCompletionNotification;
    processInstallmentsManually(): Promise<void>;
    processUserInstallments(userId: number): Promise<void>;
    generateMonthlyReport(year: number, month: number): Promise<any>;
    getUpcomingInstallments(userId: number, days?: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        paymentMethodId: number;
        categoryId: number;
        subcategoryId: number | null;
        notes: string | null;
        tags: string | null;
        userId: number;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        currentInstallment: number;
    }[]>;
}
