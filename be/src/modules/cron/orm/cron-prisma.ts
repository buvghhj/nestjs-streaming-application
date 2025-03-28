import { Injectable } from "@nestjs/common";
import { CronAbstract } from "../cron-abstract";
import { User } from "@/prisma/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { MailService } from "../../libs/mail/mail.service";
import { StorageService } from "../../libs/storage/storage.service";
import { TelegramService } from "../../libs/telegram/telegram.service";
import { NotificationService } from "../../notification/notification.service";

@Injectable()
export class PrismaCron extends CronAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly storageService: StorageService,
        private readonly telegramService: TelegramService,
        private readonly notificationService: NotificationService
    ) {

        super()

    }

    public async deletedDeactivateAccount(user: User): Promise<any> {

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

    public async notifyUserEnableTwoFactor(): Promise<any> {

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

    public async verifyChannel(): Promise<any> {

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

    public async deleteNotification(): Promise<any> {

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