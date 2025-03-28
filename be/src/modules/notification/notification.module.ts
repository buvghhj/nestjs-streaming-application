import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { PrismaNotification } from './orm/notification-prisma';
import { NotificationAbstract } from './notification-abstract';

@Module({

  providers: [

    NotificationResolver,

    NotificationService,

    PrismaNotification,

    {

      provide: NotificationAbstract,

      useClass: PrismaNotification

    }

  ],

  exports: [

    NotificationService,

    PrismaNotification

  ]

})
export class NotificationModule { }
