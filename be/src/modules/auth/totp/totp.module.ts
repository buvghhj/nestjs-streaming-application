import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TotpResolver } from './totp.resolver';
import { PrismaTotp } from './orm/totp-prisma';
import { TotpAbstract } from './totp.abstract';

@Module({

  providers: [

    TotpResolver,

    TotpService,

    PrismaTotp,

    {

      provide: TotpAbstract,

      useClass: PrismaTotp

    }

  ],

})
export class TotpModule { }
