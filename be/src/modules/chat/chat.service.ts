import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SendMessageInput } from './inputs/send-message.input';
import { User } from '@/prisma/generated';
import { ChangeChatSettingInput } from './inputs/change-chat-setting.input';

@Injectable()
export class ChatService {

    public constructor(private readonly prismaService: PrismaService) { }

    //Hiển thị tất cả tin nhắn của stream
    public async findMessagesByStream(streamId: string) {

        const messages = await this.prismaService.chatMessage.findMany({

            where: {

                streamId

            },
            include: {

                user: true

            },
            orderBy: {

                createdAt: 'desc'

            },

        })

        return messages

    }

    //Gửi tin nhắn vào stream
    public async sendMessage(userId: string, input: SendMessageInput) {

        const { text, streamId } = input

        const stream = await this.prismaService.stream.findUnique({

            where: {

                id: streamId

            },

        })

        if (!stream) {

            throw new NotFoundException('Không tìm thấy stream!')

        }

        if (!stream.isLive) {

            throw new BadRequestException('Stream hiện tại đang tắt!')

        }

        const message = await this.prismaService.chatMessage.create({

            data: {

                text,

                user: {

                    connect: {

                        id: userId

                    }

                },
                stream: {

                    connect: {

                        id: stream.id

                    }

                }

            },
            include: {

                stream: true,
                user: true

            }

        })

        return message

    }

    //Cài đặt stream
    public async changeSettings(user: User, input: ChangeChatSettingInput) {

        const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } = input

        await this.prismaService.stream.update({

            where: {

                userId: user.id

            },
            data: {

                isChatEnabled,

                isChatFollowersOnly,

                isChatPremiumFollowersOnly

            }

        })

        return true

    }

}
