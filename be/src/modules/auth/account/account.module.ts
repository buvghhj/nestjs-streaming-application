import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { VerificationModule } from '../verification/verification.module';
import { AccountServiceAbstract } from './account-abstract'
import { PrismaAccount } from './orms/account-prisma';

@Module({

  providers: [

    AccountResolver,

    AccountService,

    PrismaAccount,

    {

      provide: AccountServiceAbstract,

      useClass: PrismaAccount

    }

  ],

  imports: [

    VerificationModule

  ]

})
export class AccountModule { }
