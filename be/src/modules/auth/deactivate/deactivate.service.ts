import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenType, User } from '@/prisma/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { destroySession } from '@/src/shared/utils/session.util';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { verify } from 'argon2';
import { MailService } from '@/src/libs/mail/mail.service';
import { TelegramService } from '@/src/libs/telegram/telegram.service';
import { RedisService } from '@/src/core/redis/redis.service';

@Injectable()
export class DeactivateService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService,
        private readonly redisService: RedisService
    ) { }

    //Vô hiệu hóa tài khoản
    public async deactivate(req: Request, input: DeactivateAccountInput, user: User, userAgent: string) {

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

    //Xác thực token vô hiệu hóa tài khoản
    private async validateDeactivateToken(req: Request, token: string) {

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

    //Gửi thông báo vô hiệu hóa tài khoản qua email và telegram bot
    private async sendDeactivateToken(req: Request, user: User, userAgent: string) {

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

    private async clearSession(userId: string) {

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
