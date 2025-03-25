import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { NotificationModule } from '../notification/notification.module';

@Module({

  providers: [

    FollowResolver,

    FollowService

  ],

  imports: [

    NotificationModule

  ]

})
export class FollowModule { }
