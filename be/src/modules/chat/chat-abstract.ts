import { User } from "@/prisma/generated";
import { SendMessageInput } from "./inputs/send-message.input";
import { ChangeChatSettingInput } from "./inputs/change-chat-setting.input";

export abstract class ChatAbstract {

    abstract findMessagesByStream(streamId: string): Promise<any>

    abstract sendMessage(userId: string, input: SendMessageInput): Promise<any>

    abstract changeSettings(user: User, input: ChangeChatSettingInput): Promise<any>

}