import { Injectable } from '@nestjs/common';
import { SendMessageInput } from './inputs/send-message.input';
import { User } from '@/prisma/generated';
import { ChangeChatSettingInput } from './inputs/change-chat-setting.input';
import { ChatAbstract } from './chat-abstract';

@Injectable()
export class ChatService {

    public constructor(private readonly chatAbstract: ChatAbstract) { }

    //Hiển thị tất cả tin nhắn của stream
    public async findMessagesByStream(streamId: string) {

        return await this.chatAbstract.findMessagesByStream(streamId)

    }

    //Gửi tin nhắn vào stream
    public async sendMessage(userId: string, input: SendMessageInput) {

        return await this.chatAbstract.sendMessage(userId, input)

    }

    //Cài đặt stream
    public async changeSettings(user: User, input: ChangeChatSettingInput) {

        return await this.chatAbstract.changeSettings(user, input)

    }

}
