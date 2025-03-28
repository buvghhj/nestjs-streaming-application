import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { PrismaChannel } from './orm/channel-prisma';
import { ChannelAbstract } from './channel-abstract';

@Module({

  providers: [

    ChannelResolver,

    ChannelService,

    PrismaChannel,

    {

      provide: ChannelAbstract,

      useClass: PrismaChannel

    }

  ],

})
export class ChannelModule { }
