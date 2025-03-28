import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaTransaction } from './orm/transaction-prisma';
import { TransactionAbstract } from './transaction-abstract';

@Module({

  providers: [

    TransactionResolver,

    TransactionService,

    PrismaTransaction,

    {

      provide: TransactionAbstract,

      useClass: PrismaTransaction

    }

  ],

})
export class TransactionModule { }
