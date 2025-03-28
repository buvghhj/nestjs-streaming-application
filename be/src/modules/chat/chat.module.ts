import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaChat } from './orm/chat-prisma';
import { ChatAbstract } from './chat-abstract';

@Module({

  providers: [

    ChatResolver,

    ChatService,

    PrismaChat,

    {

      provide: ChatAbstract,

      useClass: PrismaChat

    }

  ],

})
export class ChatModule { }
