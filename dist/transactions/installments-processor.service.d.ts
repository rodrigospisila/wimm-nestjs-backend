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
    getUpcomingInstallments(userId: number, days?: number): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.CategoryType;
            description: string | null;
            color: string;
            icon: string;
            userId: number;
            monthlyBudget: number | null;
            parentCategoryId: number | null;
        };
        creditCard: {
            name: string;
            id: number;
            userId: number;
            limit: number;
            dueDay: number;
            closingDay: number;
            bankCode: string | null;
        } | null;
        transactions: {
            id: number;
            description: string;
            date: Date;
            amount: number;
            categoryId: number;
            creditCardId: number;
            installmentId: number | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        isActive: boolean;
        categoryId: number;
        notes: string | null;
        tags: string | null;
        startDate: Date;
        totalAmount: number;
        installmentCount: number;
        installmentType: import("@prisma/client").$Enums.InstallmentType;
        creditCardId: number | null;
        currentInstallment: number;
    })[]>;
}
