import { Module } from '@nestjs/common';
import { DeactivateService } from './deactivate.service';
import { DeactivateResolver } from './deactivate.resolver';
import { PrismaDeactivate } from './orm/deactivate-prisma';
import { DeactivateAbstract } from './deactivate-abstract';

@Module({

  providers: [

    DeactivateResolver,

    DeactivateService,

    PrismaDeactivate,

    {

      provide: DeactivateAbstract,

      useClass: PrismaDeactivate

    }

  ],

})
export class DeactivateModule { }
