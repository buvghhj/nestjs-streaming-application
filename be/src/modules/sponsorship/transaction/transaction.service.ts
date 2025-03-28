import { Injectable } from '@nestjs/common';
import { User } from '@/prisma/generated';
import { TransactionAbstract } from './transaction-abstract';

@Injectable()
export class TransactionService {

    public constructor(private readonly transactionAbstract: TransactionAbstract) { }

    //Hiển thị tất cả các giao dịch hiện có
    public async findMyTransactions(user: User) {

        return await this.transactionAbstract.findMyTransactions(user)

    }

    //Thanh toán gói hội viên
    public async makePayment(user: User, planId: string) {

        return await this.transactionAbstract.makePayment(user, planId)

    }

}
