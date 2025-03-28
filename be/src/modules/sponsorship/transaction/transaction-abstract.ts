import { User } from "@/prisma/generated";

export abstract class TransactionAbstract {

    abstract findMyTransactions(user: User): Promise<any>

    abstract makePayment(user: User, planId: string): Promise<any>

}