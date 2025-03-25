import { NotificationType, SponsorshipPlan, TokenType, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';
import { generateToken } from '@/src/shared/utils/generate-token.util';

@Injectable()
export class NotificationService {

    public constructor(private readonly prismaService: PrismaService) { }

    //Hiển thị số lượng tin nhắn (chưa đọc)
    public async findUnReadCount(user: User) {

        const messagesCount = await this.prismaService.notification.count({

            where: {

                isRead: false,

                userId: user.id

            }

        })

        return messagesCount

    }

    //Hiển thị thông báo (đánh dấu đã đọc)
    public async findByUser(user: User) {

        await this.prismaService.notification.updateMany({

            where: {

                isRead: false,

                userId: user.id

            },
            data: {

                isRead: true

            }

        })

        const notifications = await this.prismaService.notification.findMany({

            where: {

                userId: user.id

            },
            orderBy: {

                createdAt: 'desc'

            }

        })

        return notifications

    }

    public async createStreamStart(userId: string, channel: User) {

        const notification = await this.prismaService.notification.create({

            data: {

                message: `
                    <b className="font-medium">Don't miss out!</b>
                    <p>
                        Join the channel
                        <a href='/${channel.username} className="font-medium"'>
                        ${channel.displayName}
                        </a>
                    </p>
                   `,
                type: NotificationType.STREAM_START,
                user: {

                    connect: {

                        id: userId

                    }

                }

            }

        })

        return notification

    }

    public async createNewFollowing(userId: string, follower: User) {

        const notification = await this.prismaService.notification.create({

            data: {

                message: `
                    <b className="font-medium">You have 1 new subscriber!</b>
                    <p>
                        This is the user
                        <a href='/${follower.username} className="font-medium"'>
                        ${follower.displayName}
                        </a>
                    </p>
                   `,
                type: NotificationType.NEW_FOLLOWER,
                user: {

                    connect: {

                        id: userId

                    }

                }

            }

        })

        return notification

    }

    public async createNewSponsorship(userId: string, plan: SponsorshipPlan, sponsor: User) {

        const notification = await this.prismaService.notification.create({

            data: {

                message: `
                    <b className="font-medium">You have 1 new sponsorship!</b>
                    <p>
                        This is the user
                        <a href='/${sponsor.username} className="font-medium"'>
                        ${sponsor.displayName}
                        </a>

                        has been bought plan <strong>${plan.title}</strong>
                    </p>
                `,
                type: NotificationType.NEW_SPONSORSHIP,
                user: {

                    connect: {

                        id: userId

                    }

                }

            }

        })

        return notification

    }

    public async createEnableTwoFactor(userId: string) {

        const notification = await this.prismaService.notification.create({

            data: {

                message: `
                    <b className="font-medium">Keep it safe!</b>
                    <p>
                      Enable 2-factor authentication in your account settings for added security
                    </p>
                `,
                type: NotificationType.ENABLE_TWO_FACTOR,
                userId

            }

        })

        return notification

    }

    public async createVerifyChannel(userId: string) {

        const notification = await this.prismaService.notification.create({

            data: {

                message: `
                    <b className="font-medium">Your channel has been verified!</b>
                    <p>
                      Verification badges confirm your channel's identity and improve credibility with viewers.
                    </p>
                `,
                type: NotificationType.VERIFIED_CHANNEL,
                userId

            }

        })

        return notification

    }

    //Tùy chỉnh cài đặt thông báo (bật tắt thông báo trên website hoặc teplegram)
    public async changeSettings(user: User, input: ChangeNotificationSettingsInput) {

        const { siteNotifications, telegramNotifications } = input

        const notificationSettings = await this.prismaService.notificationSettings.upsert({

            where: {

                userId: user.id

            },
            create: {

                siteNotifications,

                telegramNotifications,

                user: {

                    connect: {

                        id: user.id

                    }

                }

            },
            update: {

                siteNotifications,

                telegramNotifications

            },
            include: {

                user: true

            }

        })

        if (notificationSettings.telegramNotifications && !notificationSettings.user.telegramId) {

            const telegramAuthToken = await generateToken(this.prismaService, user, TokenType.TELEGRAM_AUTH)

            return {

                notificationSettings,

                telegramAuthToken: telegramAuthToken.token

            }

        }

        if (!notificationSettings.telegramNotifications && notificationSettings.user.telegramId) {

            await this.prismaService.user.update({

                where: {

                    id: user.id

                },
                data: {

                    telegramId: null

                }

            })

            return { notificationSettings }

        }

        return { notificationSettings }

    }

}
