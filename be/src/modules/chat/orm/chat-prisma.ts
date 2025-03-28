import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ChatAbstract } from "../chat-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { SendMessageInput } from "../inputs/send-message.input";
import { User } from "@/prisma/generated";
import { ChangeChatSettingInput } from "../inputs/change-chat-setting.input";

@Injectable()
export class PrismaChat extends ChatAbstract {

    constructor(private readonly prismaService: PrismaService) {

        super()

    }

    public async findMessagesByStream(streamId: string): Promise<any> {

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

    public async sendMessage(userId: string, input: SendMessageInput): Promise<any> {

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

    public async changeSettings(user: User, input: ChangeChatSettingInput): Promise<any> {

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