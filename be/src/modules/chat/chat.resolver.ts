import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { PubSub } from 'graphql-subscriptions'
import { ChatModel } from './models/chat.model';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { SendMessageInput } from './inputs/send-message.input';
import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { ChangeChatSettingInput } from './inputs/change-chat-setting.input';

@Resolver('Chat')
export class ChatResolver {

  private readonly pubSub: PubSub

  public constructor(private readonly chatService: ChatService) {

    this.pubSub = new PubSub()

  }

  //Hiển thị tất cả tin nhắn của stream
  @Query(() => [ChatModel], { name: "findChatMessageByStream" })
  public async findMessageByStream(@Args('streamId') streamId: string) {

    return this.chatService.findMessagesByStream(streamId)

  }

  //Gửi tin nhắn vào stream
  @Authorization()
  @Mutation(() => ChatModel, { name: "sendMessage" })
  public async sendMessage(
    @Authorized('id') userId: string,
    @Args('data') input: SendMessageInput
  ) {

    const message = await this.chatService.sendMessage(userId, input)

    this.pubSub.publish('CHAT_MESSAGE_ADDED', { chatMessagesAdded: message })

    return message

  }

  //Tạo luồng chat
  @Subscription(() => ChatModel, { name: 'chatMessagesAdded', filter: (payload, variables) => payload.chatMessagesAdded.streamId === variables.streamId })
  public chatMessagesAdded(@Args('streamId') streamId: string) {

    return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')

  }

  //Cài đặt stream
  @Authorization()
  @Mutation(() => Boolean, { name: "changeChatSettings" })
  public async changeChatSettings(
    @Authorized() user: User,
    @Args('data') input: ChangeChatSettingInput
  ) {

    return this.chatService.changeSettings(user, input)

  }

}
