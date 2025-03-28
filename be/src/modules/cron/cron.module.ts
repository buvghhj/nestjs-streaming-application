import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule'
import { NotificationService } from '../notification/notification.service';
import { PrismaNotification } from '../notification/orm/notification-prisma';
import { NotificationAbstract } from '../notification/notification-abstract';
import { PrismaCron } from './orm/cron-prisma';
import { CronAbstract } from './cron-abstract';

@Module({

  imports: [

    ScheduleModule.forRoot(),

  ],

  providers: [

    CronService,

    NotificationService,

    PrismaNotification,

    PrismaCron,

    {

      provide: CronAbstract,

      useClass: PrismaCron

    },

    {

      provide: NotificationAbstract,

      useClass: PrismaNotification

    }

  ],

})
export class CronModule { }
