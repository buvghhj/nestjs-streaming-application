import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SessionAbstract } from "../session-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Request } from "express";
import { RedisService } from "@/src/core/redis/redis.service";
import { ConfigService } from "@nestjs/config";
import { LoginInput } from "../inputs/login.input";
import { verify } from "argon2";
import { VerificationService } from "../../verification/verification.service";
import { TOTP } from "otpauth";
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util";
import { destroySession, saveSession } from "@/src/shared/utils/session.util";

@Injectable()
export class PrismaSession extends SessionAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly verificationService: VerificationService
    ) {

        super()

    }

    public async findByUser(req: Request): Promise<any> {

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

    public async findCurrent(req: Request): Promise<any> {

        const sessionId = req.session.id

        const sessionData = await this.redisService.get(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`)

        const session = JSON.parse(sessionData)

        return {

            ...session,

            id: sessionId

        }

    }

    public async login(req: Request, input: LoginInput, userAgent: string): Promise<{}> {

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

    public async logout(req: Request): Promise<any> {

        return destroySession(req, this.configService)

    }

    public async clearSession(req: Request): Promise<boolean> {

        req.res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))

        return true

    }

    public async remove(req: Request, id: string): Promise<boolean> {

        if (req.session.id === id) {

            throw new ConflictException(`Không thể xóa session hiện tại!`)

        }

        await this.redisService.del(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`)

        return true

    }

}