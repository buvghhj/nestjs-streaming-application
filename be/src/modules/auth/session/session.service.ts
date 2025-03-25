import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';
import { TOTP } from 'otpauth';

@Injectable()
export class SessionService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly verificationService: VerificationService
    ) { }

    //Hiển thị tất cả thông tin session được lưu ở đâu
    public async findByUser(req: Request) {

        const userId = req.session.userId

        if (!userId) {

            throw new NotFoundException('Không tìm thấy thông tin đăng nhập!')

        }

        const keys = await this.redisService.keys('*')

        const userSessions = []

        for (const key of keys) {

            const sessionData = await this.redisService.get(key)

            if (sessionData) {

                const session = JSON.parse(sessionData)

                if (session.userId === userId) {

                    userSessions.push({

                        ...session,

                        id: key.split(':')[1]

                    })

                }

            }

        }

        userSessions.sort((a, b) => b.createdAt - a.createdAt)

        return userSessions.filter(session => session.id !== req.session.id)

    }

    //Hiển thị thông tin session hiện tại  được lưu 
    public async findCurrent(req: Request) {

        const sessionId = req.session.id

        const sessionData = await this.redisService.get(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`)

        const session = JSON.parse(sessionData)

        return {

            ...session,

            id: sessionId

        }

    }

    //Đăng nhập
    public async login(req: Request, input: LoginInput, userAgent: string) {

        const { login, password, pin } = input

        const user = await this.prismaService.user.findFirst({

            where: {

                OR: [

                    { username: { equals: login } },
                    { email: { equals: login } },

                ]

            }

        })

        if (!user) {

            throw new NotFoundException('Thông tin tài khoản hoặc mật khẩu không chính xác!')

        }

        if (user.isDeactivated) {

            throw new BadRequestException('Tài khoản của bạn đã bị vô hiệu hóa tạm thời!')

        }

        const isValidPass = await verify(user.password, password)

        if (!isValidPass) {

            throw new UnauthorizedException('Thông tin tài khoản hoặc mật khẩu không chính xác!')

        }

        if (!user.isEmailVerified) {

            await this.verificationService.sendVerifyEmailToken(user)

            throw new BadRequestException('Tài khoản của bạn chưa đươc xác thực email, hãy kiểm tra email của bạn!')

        }

        if (user.isTotpEnabled) {

            if (!pin) {

                return { message: 'Bạn đã bật bảo mật 2 bước, cần nhập mã xác thực để hoàn tất đăng nhập!' }

            }

            const totp = new TOTP({

                issuer: "TanStream",

                label: `${user.email}`,

                algorithm: 'SHA1',

                digits: 6,

                secret: user.totpSecret

            })

            const delta = totp.validate({ token: pin })

            if (delta === null) {

                return { message: 'Mã xác nhận không chính xác!' }

            }

        }

        const metadata = getSessionMetadata(req, userAgent)

        const session = await saveSession(req, user, metadata);

        return { user, session }

    }

    //Đăng xuất
    public async logout(req: Request) {

        return destroySession(req, this.configService)

    }

    // Xóa cookie session khỏi trình duyệt
    public async clearSession(req: Request) {

        req.res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))

        return true

    }

    // Xóa session trong Redis
    public async remove(req: Request, id: string) {

        if (req.session.id === id) {

            throw new ConflictException(`Không thể xóa session hiện tại!`)

        }

        await this.redisService.del(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`)

        return true

    }

}
