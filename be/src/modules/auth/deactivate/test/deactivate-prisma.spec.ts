import { PrismaService } from "@/src/core/prisma/prisma.service"
import { PrismaDeactivate } from "../orm/deactivate-prisma"
import { Test, TestingModule } from "@nestjs/testing"
import { RedisService } from "@/src/core/redis/redis.service"
import { TelegramService } from "@/src/modules/libs/telegram/telegram.service"
import { MailService } from "@/src/modules/libs/mail/mail.service"
import { ConfigService } from "@nestjs/config"
import { hash, verify } from "argon2"
import { BadRequestException } from "@nestjs/common"
import { Request } from 'express';
import { TokenType, User } from "@/prisma/generated"
import { destroySession } from "@/src/shared/utils/session.util";
import { generateToken } from "@/src/shared/utils/generate-token.util"
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util"
import { SessionMetadata } from "@/src/shared/types/session-metadata.types"

jest.mock('argon2', () => ({

    verify: jest.fn(),

    hash: jest.fn(),

}));

jest.mock("@/src/shared/utils/generate-token.util", () => ({

    generateToken: jest.fn(),

}));

jest.mock("@/src/shared/utils/session-metadata.util", () => ({

    getSessionMetadata: jest.fn(),

}));

jest.mock("@/src/shared/utils/session.util", () => ({

    destroySession: jest.fn().mockResolvedValue(undefined),

}));


describe('Deactivate Account Prisma', () => {

    let deactivatePrisma: PrismaDeactivate

    let prismaMock: Partial<PrismaService>

    let configMock: Partial<ConfigService>

    let mailMock: Partial<MailService>

    let telegramMock: Partial<TelegramService>

    let redisMock: Partial<RedisService>

    beforeEach(async () => {

        prismaMock = {

            user: {

                findUnique: jest.fn(),
                update: jest.fn(),

            } as any,

            token: {

                findUnique: jest.fn(),

                delete: jest.fn()

            } as any

        }

        mailMock = { sendDeactivateToken: jest.fn().mockResolvedValue(true) }

        telegramMock = { sendDeactivateToken: jest.fn().mockResolvedValue(true) }

        redisMock = {
            keys: jest.fn().mockResolvedValue([]),
            del: jest.fn().mockResolvedValue(1)
        };

        const module: TestingModule = await Test.createTestingModule({

            providers: [

                PrismaDeactivate,

                {

                    provide: PrismaService,

                    useValue: prismaMock

                },

                {

                    provide: ConfigService,

                    useValue: configMock

                },

                {

                    provide: MailService,

                    useValue: mailMock

                },

                {

                    provide: TelegramService,

                    useValue: telegramMock

                },

                {

                    provide: RedisService,

                    useValue: redisMock

                }

            ],

        }).compile()

        deactivatePrisma = module.get<PrismaDeactivate>(PrismaDeactivate)

    })

    describe('Deactivate Account', () => {

        it('should throw BadRequestException if email does not match', async () => {

            const mockUser = {

                id: '123',

                email: 'user@example.com',

                password: 'hashed_password'

            } as unknown as User

            const input = {

                email: 'wrong@example.com',

                password: 'password123',

                token: ''

            }

            await expect(deactivatePrisma.deactivate({} as Request, input, mockUser, 'user-agent'))
                .rejects.toThrow(BadRequestException)

        })

        it('should throw BadRequestException if password is incorrect', async () => {

            const mockUser = {

                id: '123',

                email: 'user@example.com',

                password: 'hashed_password'

            } as unknown as User

            const input = {

                email: 'user@example.com',

                password: 'wrong_password',

                token: ''

            };

            (verify as jest.Mock).mockResolvedValue(false);

            await expect(deactivatePrisma.deactivate({} as Request, input, mockUser, 'user-agent'))
                .rejects.toThrow(BadRequestException)

            expect(verify).toHaveBeenCalledWith('hashed_password', 'wrong_password')

        })

        it('should send deactivation token if no token is provided', async () => {

            const mockUser = {

                id: '123',

                email: 'user@example.com',

                password: 'hashed_password'

            } as unknown as User

            const input = {

                email: 'user@example.com',

                password: 'correct_password',

                token: ''

            };

            (verify as jest.Mock).mockResolvedValue(true);

            jest.spyOn(deactivatePrisma, 'sendDeactivateToken').mockResolvedValue(undefined);

            const result = await deactivatePrisma.deactivate({} as Request, input, mockUser, 'user-agent')

            expect(result).toEqual({ message: 'Mã xác nhận đã được gửi qua email và telegram!' })

            expect(deactivatePrisma.sendDeactivateToken).toHaveBeenCalledWith({}, mockUser, 'user-agent')

        })

        it('should validate token and return user if token is provided', async () => {

            const mockUser = {

                id: '123',

                email: 'user@example.com',

                password: 'hashed_password'

            } as unknown as User

            const input = {

                email: 'user@example.com',

                password: 'correct_password',

                token: 'valid_token'

            };

            (verify as jest.Mock).mockResolvedValue(true);

            jest.spyOn(deactivatePrisma, 'validateDeactivateToken').mockResolvedValue(undefined);

            const result = await deactivatePrisma.deactivate({} as Request, input, mockUser, 'user-agent')

            expect(result).toEqual({ user: mockUser })

            expect(deactivatePrisma.validateDeactivateToken).toHaveBeenCalledWith({}, 'valid_token')

        })

    })

    describe('Validate Deactivate Token', () => {

        it('should throw not found if token does not exist', async () => {

            (prismaMock.token.findUnique as jest.Mock).mockResolvedValue(null)

            await expect(deactivatePrisma.validateDeactivateToken({} as Request, 'invalid-token')).rejects.toThrow('Không tìm thấy mã xác nhận!')

        })

        it('should throw BadRequestException if token has expired', async () => {

            (prismaMock.token.findUnique as jest.Mock).mockResolvedValue({

                token: 'valid-token',

                expiresIn: new Date(Date.now() - 10000),

                userId: '123'

            });

            jest.spyOn(deactivatePrisma, "clearSession").mockResolvedValue(undefined);
            (destroySession as jest.Mock).mockResolvedValue(undefined);

            (prismaMock.user.update as jest.Mock).mockResolvedValueOnce({ id: "123" });

            await expect(deactivatePrisma.validateDeactivateToken({} as Request, 'valid-token')).rejects.toThrow("Mã xác nhận này đã hết hạn!")

        })

    })

    describe('Send Deactivate Token', () => {

        it("should throw NotFoundException if token does not exist", async () => {

            (prismaMock.token.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(deactivatePrisma.validateDeactivateToken({} as Request, "invalid_token"))
                .rejects.toThrow("Không tìm thấy mã xác nhận!")

        })

        it("should throw BadRequestException if token has expired", async () => {

            (prismaMock.token.findUnique as jest.Mock).mockResolvedValue({

                token: "valid_token",

                expiresIn: new Date(Date.now() - 10000),

                userId: "123",

            })

            await expect(deactivatePrisma.validateDeactivateToken({} as Request, "valid_token"))
                .rejects.toThrow("Mã xác nhận này đã hết hạn!")

        })

        it("should deactivate user and delete token if valid", async () => {

            const mockUser = {

                id: "123",

                isDeactivated: false

            };

            const mockToken = {

                id: "token123",

                token: "valid_token",

                expiresIn: new Date(Date.now() + 10000),

                userId: "123",

            };

            (prismaMock.token.findUnique as jest.Mock).mockResolvedValue({

                token: "valid_token",

                expiresIn: new Date(Date.now() + 10000),

                userId: "123",

            });

            (prismaMock.token.findUnique as jest.Mock).mockResolvedValue(mockToken);

            (prismaMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, isDeactivated: true });

            (prismaMock.token.delete as jest.Mock).mockResolvedValue(undefined);

            jest.spyOn(deactivatePrisma, "clearSession").mockResolvedValue(undefined);

            (destroySession as jest.Mock).mockResolvedValue(undefined);

            await expect(deactivatePrisma.validateDeactivateToken({} as Request, "valid_token"))
                .resolves.toBeUndefined()

            expect(prismaMock.user.update).toHaveBeenCalledWith({

                where: { id: "123" },

                data: { isDeactivated: true, deactivatedAt: expect.any(Date) },

            })

            expect(prismaMock.token.delete).toHaveBeenCalledWith({
                where: { id: mockToken.id, type: TokenType.DEACTIVATE_ACCOUNT },
            })

        })

        it("should send deactivate token via email & tele", async () => {

            const mockUser: User = {

                id: "123",

                email: "test@example.com",

                telegramId: "456",

                notificationSettings: { telegramNotifications: true }

            } as any;

            (generateToken as jest.Mock).mockResolvedValue({ token: "valid_token", user: mockUser });

            (getSessionMetadata as jest.Mock).mockReturnValue("metadata");

            await deactivatePrisma.sendDeactivateToken({} as Request, mockUser, "mock-user-agent");

            expect(telegramMock.sendDeactivateToken).toHaveBeenCalledWith(

                "456",

                "valid_token",

                "metadata",


            )

            expect(mailMock.sendDeactivateToken).toHaveBeenCalledWith(

                "test@example.com",

                "valid_token",

                "metadata"

            )

        })

        it("should send deactivate token via Telegram if enabled", async () => {

            const mockUser: User = {

                id: "123",

                email: "test@example.com",

                telegramId: "456",

                notificationSettings: { telegramNotifications: true },

            } as any

            (generateToken as jest.Mock).mockResolvedValue({ token: "valid_token", user: mockUser });

            (getSessionMetadata as jest.Mock).mockReturnValue("metadata");

            await expect(deactivatePrisma.sendDeactivateToken({} as Request, mockUser, "userAgent"))
                .resolves.toBe(true)

            expect(telegramMock.sendDeactivateToken).toHaveBeenCalledWith(

                "456",

                "valid_token",

                "metadata"

            )

        })

    })

})