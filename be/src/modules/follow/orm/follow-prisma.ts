import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { FollowAbstract } from "../follow-abstract";
import { User } from "@/prisma/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { NotificationService } from "../../notification/notification.service";
import { TelegramService } from "../../libs/telegram/telegram.service";

@Injectable()
export class PrismaFollow extends FollowAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly notificationService: NotificationService,
        private readonly telegramService: TelegramService
    ) {

        super()

    }

    public async findMyFollowers(user: User): Promise<any> {

        const followers = await this.prismaService.follow.findMany({

            where: {

                followingId: user.id

            },
            include: {

                follower: true

            },
            orderBy: {

                createdAt: 'desc'

            },

        })

        return followers

    }

    public async findMyFollowings(user: User): Promise<any> {

        const followings = await this.prismaService.follow.findMany({

            where: {

                followerId: user.id

            },
            include: {

                following: true

            },
            orderBy: {

                createdAt: 'desc'

            },

        })

        return followings

    }

    public async follow(user: User, channelId: string): Promise<any> {

        const channel = await this.prismaService.user.findUnique({

            where: {

                id: channelId

            }

        })

        if (!channel) {

            throw new NotFoundException('Không tìm thấy kênh!')

        }

        if (channel.id === user.id) {

            throw new ConflictException('Bạn không thể theo dõi kênh mình!')

        }

        const existingFollow = await this.prismaService.follow.findFirst({

            where: {

                followerId: user.id,

                followingId: channel.id

            }

        })

        if (existingFollow) {

            throw new ConflictException('Bạn đã đăng ký kênh này rồi!')

        }

        const follow = await this.prismaService.follow.create({

            data: {

                followerId: user.id,

                followingId: channel.id

            },
            include: {

                follower: true,

                following: {

                    include: {

                        notificationSettings: true

                    }

                }

            }

        })

        //Thông báo website
        if (follow.following.notificationSettings?.siteNotifications) {

            await this.notificationService.createNewFollowing(follow.following.id, follow.follower)

        }

        //Thông báo telegram bot
        if (follow.following.notificationSettings?.telegramNotifications && follow.following.telegramId) {

            await this.telegramService.sendNewFollowing(follow.following.telegramId, follow.follower)

        }

        return true

    }

    public async unFollow(user: User, channelId: string): Promise<any> {


        const channel = await this.prismaService.user.findUnique({

            where: {

                id: channelId

            }

        })

        if (!channel) {

            throw new NotFoundException('Không tìm thấy kênh!')

        }

        if (channel.id === user.id) {

            throw new ConflictException('Bạn không thể huy theo dõi kênh mình!')

        }

        const existingUnFollow = await this.prismaService.follow.findFirst({

            where: {

                followerId: user.id,

                followingId: channel.id

            }

        })

        if (!existingUnFollow) {

            throw new ConflictException('Bạn chưa theo dõi kênh nào!')

        }

        await this.prismaService.follow.delete({

            where: {

                id: existingUnFollow.id,

                followerId: user.id,

                followingId: channel.id

            }

        })

        return true

    }

}