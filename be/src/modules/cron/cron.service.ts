import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { User } from '@/prisma/generated';
import { StorageService } from '@/src/libs/storage/storage.service';
import { TelegramService } from '@/src/libs/telegram/telegram.service';
import { MailService } from '@/src/libs/mail/mail.service';

@Injectable()
export class CronService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly storageService: StorageService,
        private readonly telegramService: TelegramService,
        private readonly notificationService: NotificationService
    ) { }

    //Tự động xóa tài khoản bị vô hiệu hóa sau 7 ngày
    // @Cron(CronExpression.EVERY_DAY_AT_1AM)
    public async deletedDeactivateAccount(user: User) {

        const sevenDaysAgo = new Date()

        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const deactivatedAccounts = await this.prismaService.user.findMany({

            where: {

                isDeactivated: true,

                deactivatedAt: {

                    lte: sevenDaysAgo

                }

            },

            include: {

                notificationSettings: true,

                stream: true

            }

        })

        for (const user of deactivatedAccounts) {

            await this.mailService.sendAccountDeletion(user.email)

            if (user.notificationSettings.telegramNotifications && user.telegramId) {

                await this.telegramService.sendAccountDeletion(user.telegramId)

            }

            if (user.avatar) {

                this.storageService.remove(user.avatar)

            }

            if (user.stream.thumbnailUrl) {

                this.storageService.remove(user.stream.thumbnailUrl)

            }

        }

        await this.prismaService.user.deleteMany({

            where: {

                isDeactivated: true,

                deactivatedAt: {

                    lte: sevenDaysAgo

                }

            }

        })

    }

    //Thông báo nhắc nhở bật xác thực 2 yếu tố cho tài khoản
    // @Cron(CronExpression.EVERY_DAY_AT_1AM)
    public async notifyUserEnableTwoFactor() {

        const users = await this.prismaService.user.findMany({

            where: {
                // id: '12c5bb2b-20b0-4504-a09d-3b716441c8ed',
                isTotpEnabled: false

            },
            include: {

                notificationSettings: true

            }

        })

        for (const user of users) {

            await this.mailService.sendEnableTwoFactor(user.email)

            if (user.notificationSettings?.siteNotifications) {

                await this.notificationService.createEnableTwoFactor(user.id)

            }

            if (user.notificationSettings?.telegramNotifications && user.telegramId) {

                await this.telegramService.sendEnableTwoFactor(user.telegramId)

            }

        }

    }

    //Thông báo kênh đã có hiệu đủ điều kiện tạo gói hội viên
    @Cron(CronExpression.EVERY_5_SECONDS)
    public async verifyChannel() {

        const users = await this.prismaService.user.findMany({

            include: {

                notificationSettings: true

            }

        })

        for (const user of users) {

            const followerCount = await this.prismaService.follow.count({

                where: {

                    followingId: user.id

                }

            })

            if (followerCount >= 10 && !user.isVerified) {

                await this.prismaService.user.update({

                    where: {

                        id: user.id

                    },
                    data: {

                        isVerified: true

                    }

                })

                await this.mailService.sendVerifyChannel(user.email)

                if (user.notificationSettings?.siteNotifications) {

                    await this.notificationService.createVerifyChannel(user.id)

                }

                if (user.notificationSettings?.telegramNotifications && user.telegramId) {

                    await this.telegramService.sendVerifyChannel(user.telegramId)

                }

            }

        }

    }

    //Tự động xóa thông báo đã đọc trên website sau 7 ngày
    // @Cron(CronExpression.EVERY_10_SECONDS)
    public async deleteNotification() {

        const sevenDaysAgo = new Date()

        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        await this.prismaService.notification.deleteMany({

            where: {

                isRead: true,

                createdAt: {

                    lte: sevenDaysAgo

                }

            }

        })

    }

}
