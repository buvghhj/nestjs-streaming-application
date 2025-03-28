import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { VerificationModule } from '../verification/verification.module';
import { PrismaSession } from './orm/session-prisma';
import { SessionAbstract } from './session-abstract';

@Module({

  providers: [

    SessionResolver,

    SessionService,

    PrismaSession,

    {

      provide: SessionAbstract,

      useClass: PrismaSession

    }

  ],

  imports: [

    VerificationModule

  ]

})
export class SessionModule { }
