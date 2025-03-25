import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { VerificationModule } from '../verification/verification.module';

@Module({

  providers: [

    SessionResolver,

    SessionService

  ],

  imports: [

    VerificationModule

  ]

})
export class SessionModule { }
