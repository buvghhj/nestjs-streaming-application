import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { TransactionModel } from './models/transaction.model';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';
import { MakePaymentModel } from './models/make-payment.model';

@Resolver('Transaction')
export class TransactionResolver {

  public constructor(private readonly transactionService: TransactionService) { }

  //Hiển thị tất cả các giao dịch hiện có
  @Authorization()
  @Query(() => [TransactionModel], { name: "findMyTransactions" })
  public async findMyTransactions(@Authorized() user: User) {

    return this.transactionService.findMyTransactions(user)

  }

  //Thanh toán gói hội viên
  @Authorization()
  @Mutation(() => MakePaymentModel, { name: "makePaymentPlan" })
  public async makePlayment(
    @Authorized() user: User,
    @Args('planId') planId: string
  ) {

    return this.transactionService.makePayment(user, planId)

  }

}
