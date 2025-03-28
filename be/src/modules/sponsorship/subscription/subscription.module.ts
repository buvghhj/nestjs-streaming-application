import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';
import { PrismaSubscription } from './orm/subscription-prisma';
import { SubscriptionAbstract } from './subscription-abstract';

@Module({

  providers: [

    SubscriptionResolver,

    SubscriptionService,

    PrismaSubscription,

    {

      provide: SubscriptionAbstract,

      useClass: PrismaSubscription

    }

  ],

})
export class SubscriptionModule { }
