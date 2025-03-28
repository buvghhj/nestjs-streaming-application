import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanResolver } from './plan.resolver';
import { PrismaPlan } from './orm/plan-prisma';
import { PlanAbstract } from './plan-abstract';

@Module({

  providers: [

    PlanResolver,

    PlanService,

    PrismaPlan,

    {

      provide: PlanAbstract,

      useClass: PrismaPlan

    }

  ],

})
export class PlanModule { }
