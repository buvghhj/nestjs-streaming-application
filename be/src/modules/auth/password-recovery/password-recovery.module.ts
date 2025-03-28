import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryResolver } from './password-recovery.resolver';
import { PrismaPasswordRecovery } from './orm/password-recovery-prisma';
import { PasswordRecoveryAbstract } from './password-recovery-abstract';

@Module({

  providers: [

    PasswordRecoveryResolver,

    PasswordRecoveryService,

    PrismaPasswordRecovery,

    {

      provide: PasswordRecoveryAbstract,

      useClass: PrismaPasswordRecovery

    }

  ]

})
export class PasswordRecoveryModule { }
