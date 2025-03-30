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
import { User } from "@/prisma/generated"

jest.mock('argon2', () => ({

    verify: jest.fn(),

    hash: jest.fn(),

}))

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

            } as any

        }

        mailMock = { sendDeactivateToken: jest.fn() }

        telegramMock = { sendDeactivateToken: jest.fn() }

        redisMock = { get: jest.fn(), set: jest.fn(), del: jest.fn() }

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

})