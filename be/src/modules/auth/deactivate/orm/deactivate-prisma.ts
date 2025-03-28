import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DeactivateAbstract } from "../deactivate-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { TokenType, User } from "@/prisma/generated";
import { Request } from "express";
import { DeactivateAccountInput } from "../inputs/deactivate-account.input";
import { verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { generateToken } from "@/src/shared/utils/generate-token.util";
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util";
import { MailService } from "@/src/modules/libs/mail/mail.service";
import { TelegramService } from "@/src/modules/libs/telegram/telegram.service";
import { destroySession } from "@/src/shared/utils/session.util";
import { RedisService } from "@/src/core/redis/redis.service";

@Injectable()
export class PrismaDeactivate extends DeactivateAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService,
        private readonly redisService: RedisService
    ) {

        super()

    }

    public async deactivate(req: Request, input: DeactivateAccountInput, user: User, userAgent: string): Promise<{}> {

        const { email, password, token } = input

        if (user.email !== email) {

            throw new BadRequestException('Thông tin tài khoản không chính xác!')

        }

        const isValidPassword = await verify(user.password, password)

        if (!isValidPassword) {

            throw new BadRequestException('Thông tin tài khoản không chính xác!')

        }

        if (!token) {

            await this.sendDeactivateToken(req, user, userAgent)

            return { message: 'Mã xác nhận đã được gửi qua email và telegram!' }

        }

        await this.validateDeactivateToken(req, token)

        return { user }

    }

    public async validateDeactivateToken(req: Request, token: string): Promise<any> {

        const existingToken = await this.prismaService.token.findUnique({

            where: {

                token,

                type: TokenType.DEACTIVATE_ACCOUNT

            }

        })

        if (!existingToken) {

            throw new NotFoundException('Không tìm thấy mã xác nhận!')

        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {

            throw new BadRequestException('Mã xác nhận này đã hết hạn!')

        }

        const user = await this.prismaService.user.update({

            where: {

                id: existingToken.userId

            },
            data: {

                isDeactivated: true,

                deactivatedAt: new Date()

            }

        })

        await this.prismaService.token.delete({

            where: {

                id: existingToken.id,

                type: TokenType.DEACTIVATE_ACCOUNT

            }

        })

        await this.clearSession(user.id)

        return destroySession(req, this.configService)

    }

    public async sendDeactivateToken(req: Request, user: User, userAgent: string): Promise<boolean> {

        const deactivateToken = await generateToken(this.prismaService, user, TokenType.DEACTIVATE_ACCOUNT, false)

        const metadata = getSessionMetadata(req, userAgent)

        //Mail
        await this.mailService.sendDeactivateToken(user.email, deactivateToken.token, metadata)

        //Telegram bot
        if (deactivateToken.user.notificationSettings.telegramNotifications && deactivateToken.user.telegramId) {

            await this.telegramService.sendDeactivateToken(deactivateToken.user.telegramId, deactivateToken.token, metadata)

        }

        return true

    }

    public async clearSession(userId: string): Promise<any> {

        const keys = await this.redisService.keys('*')

        for (const key of keys) {

            const sessionData = await this.redisService.get(key)

            if (sessionData) {

                const session = JSON.parse(sessionData)

                if (session.userId === userId) {

                    await this.redisService.del(key)

                }

            }

        }

    }

}