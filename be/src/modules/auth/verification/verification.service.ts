import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { VerificationInput } from './inputs/verification.input';
import { TokenType, User } from '@/prisma/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { saveSession } from '@/src/shared/utils/session.util';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { MailService } from '@/src/libs/mail/mail.service';

@Injectable()
export class VerificationService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) { }

    //Xác thực tài khoản người dùng
    public async verify(req: Request, input: VerificationInput, userAgent: string) {

        const { token } = input

        const existingToken = await this.prismaService.token.findUnique({

            where: {

                token,

                type: TokenType.EMAIL_VERIFY

            }

        })

        if (!existingToken) {

            throw new NotFoundException('Không tìm thấy mã xác thực!')

        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {

            throw new BadRequestException('Mã xác thực đã hết hạn!')

        }

        const user = await this.prismaService.user.update({

            where: {

                id: existingToken.userId

            },
            data: {

                isEmailVerified: true

            }

        })

        await this.prismaService.token.delete({

            where: {

                id: existingToken.id,

                type: TokenType.EMAIL_VERIFY

            }

        })

        const metadata = getSessionMetadata(req, userAgent)

        return saveSession(req, user, metadata)

    }

    //Gửi mã xác thực tài khoản qua email
    public async sendVerifyEmailToken(user: User) {

        const verifyToken = await generateToken(this.prismaService, user, TokenType.EMAIL_VERIFY)

        await this.mailService.sendVerifyEmailToken(user.email, verifyToken.token)

        return true

    }

}
