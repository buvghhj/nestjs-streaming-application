import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { PrismaVerification } from './orm/verification-prisma';
import { VerificationAbstract } from './verification-abstract';

@Module({

  providers: [

    VerificationResolver,

    VerificationService,

    PrismaVerification,

    {

      provide: VerificationAbstract,

      useClass: PrismaVerification

    }

  ],

  exports: [

    VerificationService

  ]

})
export class VerificationModule { }
