import { PrismaService } from "@/src/core/prisma/prisma.service"
import { PrismaPasswordRecovery } from "../orm/password-recovery-prisma"
import { MailService } from "@/src/modules/libs/mail/mail.service"
import { TelegramService } from "@/src/modules/libs/telegram/telegram.service"
import { Test, TestingModule } from "@nestjs/testing";
import { Request } from "express";
import { User } from "@/prisma/generated";
import { generateToken } from "@/src/shared/utils/generate-token.util";
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util";

jest.mock("@/src/shared/utils/session-metadata.util", () => ({

    getSessionMetadata: jest.fn(),

}));

jest.mock("@/src/shared/utils/generate-token.util", () => ({

    generateToken: jest.fn(),

}));

describe('Password Recovery', () => {

    let passwordRecoveryPrisma: PrismaPasswordRecovery

    let prismaMock: Partial<PrismaService>

    let mailMock: Partial<MailService>

    let telegramMock: Partial<TelegramService>

    beforeEach(async () => {

        prismaMock = {

            user: {

                findUnique: jest.fn(),

                update: jest.fn(),


            } as any,

            token: {

                findUnique: jest.fn(),

                delete: jest.fn(),


            } as any,

        }

        mailMock = { sendPasswordResetToken: jest.fn().mockResolvedValue(true) }

        telegramMock = { sendPasswordResetToken: jest.fn().mockResolvedValue(true) }

        const module: TestingModule = await Test.createTestingModule({

            providers: [

                PrismaPasswordRecovery,

                {

                    provide: PrismaService,

                    useValue: prismaMock

                },

                {

                    provide: MailService,

                    useValue: mailMock

                },

                {

                    provide: TelegramService,

                    useValue: telegramMock

                },

            ]

        }).compile()

        passwordRecoveryPrisma = module.get<PrismaPasswordRecovery>(PrismaPasswordRecovery)

    })

    describe('Reset Password', () => {

        it('should throw not found if account does not exist', async () => {

            const input = {

                email: 'wrongemail@example.com',

            };

            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null)

            await expect(passwordRecoveryPrisma.resetPassword({} as Request, input, 'user-agent')).rejects.toThrow('Không tìm thấy tài khoản!')

        })

        it('should send token via email & telegram', async () => {

            const mockUser: User = {

                id: "123",

                email: "test@example.com",

                telegramId: "456",

                notificationSettings: { telegramNotifications: true }

            } as any;

            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            (generateToken as jest.Mock).mockResolvedValue({ token: 'valid-token', user: mockUser });

            (getSessionMetadata as jest.Mock).mockReturnValue('metadata')

            await passwordRecoveryPrisma.resetPassword({} as Request, mockUser, 'user-agent');

            expect(telegramMock.sendPasswordResetToken).toHaveBeenCalledWith(

                "456",

                "valid-token",

                "metadata"

            )

            expect(mailMock.sendPasswordResetToken).toHaveBeenCalledWith(

                "test@example.com",

                "valid-token",

                "metadata"

            )

        })

    })

})