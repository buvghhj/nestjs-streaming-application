import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { TokenType } from '@/prisma/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { hash } from 'argon2';
import { MailService } from '@/src/libs/mail/mail.service';
import { TelegramService } from '@/src/libs/telegram/telegram.service';

@Injectable()
export class PasswordRecoveryService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService
    ) { }

    //Lấy lại - cài lại mật khẩu
    public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {

        const { email } = input

        const user = await this.prismaService.user.findUnique({

            where: {

                email

            },
            include: {

                notificationSettings: true

            }

        })

        if (!user) {

            throw new NotFoundException('Không tìm thấy tài khoản!')

        }

        const metadata = getSessionMetadata(req, userAgent)

        const resetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET)

        //Gửi thông báo qua email
        await this.mailService.sendPasswordResetToken(user.email, resetToken.token, metadata)

        //Gửi thông báo qua telegram bot
        if (resetToken.user.notificationSettings?.telegramNotifications && resetToken.user.telegramId) {

            await this.telegramService.sendPasswordResetToken(resetToken.user.telegramId, resetToken.token, metadata)

        }

        return true

    }

    //Đặt mật khẩu mới
    public async newPassword(input: NewPasswordInput) {

        const { password, token } = input

        const existingToken = await this.prismaService.token.findUnique({

            where: {

                token,

                type: TokenType.PASSWORD_RESET

            }

        })

        if (!existingToken) {

            throw new NotFoundException('Không tìm thấy mã xác nhận!')

        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {

            throw new BadRequestException('Mã xác nhận đã hết hạn!')

        }

        await this.prismaService.user.update({

            where: {

                id: existingToken.userId

            },
            data: {

                password: await hash(password)

            }

        })

        await this.prismaService.token.delete({

            where: {

                id: existingToken.id,

                type: TokenType.PASSWORD_RESET

            }

        })

        return true

    }

}
