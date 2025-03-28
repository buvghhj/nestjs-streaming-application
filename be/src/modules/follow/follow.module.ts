import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { NotificationModule } from '../notification/notification.module';
import { PrismaFollow } from './orm/follow-prisma';
import { FollowAbstract } from './follow-abstract';

@Module({

  providers: [

    FollowResolver,

    FollowService,

    PrismaFollow,

    {

      provide: FollowAbstract,

      useClass: PrismaFollow

    }

  ],

  imports: [

    NotificationModule

  ]

})
export class FollowModule { }
