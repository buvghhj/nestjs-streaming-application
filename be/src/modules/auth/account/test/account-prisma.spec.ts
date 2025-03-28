import { PrismaService } from "@/src/core/prisma/prisma.service"
import { PrismaAccount } from "../orms/account-prisma"
import { Test, TestingModule } from "@nestjs/testing"
import { VerificationService } from "../../verification/verification.service"
import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common"
import { hash, verify } from "argon2"
import { User } from "@/prisma/generated"

jest.mock('argon2', () => ({

    verify: jest.fn(),

    hash: jest.fn(),

}))

describe('Account Prisma', () => {

    let accountPrisma: PrismaAccount

    let prismaMock: Partial<PrismaService>

    let verificationMock: Partial<VerificationService>

    beforeEach(async () => {

        prismaMock = {

            user: {

                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),

            } as any

        }

        verificationMock = { sendVerifyEmailToken: jest.fn() }

        const module: TestingModule = await Test.createTestingModule({

            providers: [

                PrismaAccount,

                {

                    provide: PrismaService,

                    useValue: prismaMock

                },

                {

                    provide: VerificationService,

                    useValue: verificationMock

                }

            ],

        }).compile()

        accountPrisma = module.get<PrismaAccount>(PrismaAccount)

    })

    describe('Get Current User & Get Not User', () => {

        it('should return user with all relations', async () => {

            const mockUser = {
                id: '123',
                email: 'test@example.com',
                socialLinks: [{ id: '1', platform: 'Twitter', link: 'https://twitter.com/test' }],
                stream: { id: 'stream123', title: 'Live Stream' },
                notificationSettings: { id: 'notif123', emailNotifications: true },
                sponsorshipPlans: [{ id: 'plan123', name: 'Gold Plan' }],
                sponsorshipSubscriptions: [{ id: 'sub123', planId: 'plan123' }],
            };

            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

            const result = await accountPrisma.me('123')

            expect(result).toEqual(mockUser)

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({

                where: { id: '123' },

                include: {
                    socialLinks: true,
                    stream: true,
                    notificationSettings: true,
                    sponsorshipPlans: true,
                    sponsorshipSubscriptions: true
                }

            })

        })

        it('should return null if user not found', async () => {

            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null)

            const result = await accountPrisma.me('not-found-id')

            expect(result).toBeNull()

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({

                where: { id: 'not-found-id' },

                include: {
                    socialLinks: true,
                    stream: true,
                    notificationSettings: true,
                    sponsorshipPlans: true,
                    sponsorshipSubscriptions: true
                }

            })

        })

    })

    describe('Validattion & Create User', () => {

        it('should throw ConflictException if username exists', async () => {

            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({ id: '123' })

            await expect(accountPrisma.createUser({

                username: 'testuser',

                email: 'test@example.com',

                password: '123456789'

            })).rejects.toThrow(ConflictException)

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({

                where: { username: 'testuser' }

            })

        })

        it('should throw ConflictException if email exists', async () => {

            (prismaMock.user.findUnique as jest.Mock)

                .mockResolvedValueOnce(null)

                .mockResolvedValueOnce({ id: '123' })

            await expect(accountPrisma.createUser({

                username: 'testuser',

                email: 'test@example.com',

                password: '123456'

            })).rejects.toThrow(ConflictException);

            expect(prismaMock.user.findUnique).toHaveBeenNthCalledWith(1, { where: { username: 'testuser' } })

            expect(prismaMock.user.findUnique).toHaveBeenNthCalledWith(2, { where: { email: 'test@example.com' } })

        })

        it('should create user and return true', async () => {

            const mockUser = {
                id: '123',
                username: 'testuser',
                email: 'test@example.com',
                password: '123456789',
            };

            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

            (hash as jest.Mock).mockResolvedValue('123456789');

            (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

            const result = await accountPrisma.createUser({ username: 'testuser', email: 'test@example.com', password: '123456789' })

            expect(result).toBe(true)

            expect(prismaMock.user.create).toHaveBeenCalledWith({

                data: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: expect.any(String),
                    displayName: 'testuser',
                    stream: { create: { title: 'Kênh của testuser' } },
                }

            })

            expect(verificationMock.sendVerifyEmailToken).toHaveBeenCalledWith(mockUser)

        })

    })

    describe('Change Email', () => {

        it('should update email and return true', async () => {

            const mockUser: User = { id: '123', email: 'old@example.com' } as User

            const newEmail = 'new@example.com';

            (prismaMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, email: newEmail });

            const result = await accountPrisma.changeEmail(mockUser, { email: newEmail });

            expect(result).toBe(true)

            expect(prismaMock.user.update).toHaveBeenCalledWith({

                where: { id: '123' },

                data: { email: newEmail }

            })

        })

        it('should throw an error if update fails', async () => {

            const mockUser: User = { id: '123', email: 'old@example.com' } as User

            const newEmail = 'new@example.com';

            (prismaMock.user.update as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(accountPrisma.changeEmail(mockUser, { email: newEmail })).rejects.toThrow('Database error')

        })

    })

    describe('Change Password', () => {

        it('should throw UnauthorizedException if old password is incorrect', async () => {

            const mockUser: User = { id: '123', password: 'hashed_old_password' } as User;

            (verify as jest.Mock).mockResolvedValue(false);

            await expect(accountPrisma.changePassword(mockUser, {

                oldPassword: 'wrong_old_password',

                newPassword: 'newPass123',

                confirmNewPassword: 'newPass123',

            })).rejects.toThrow(UnauthorizedException)

            expect(verify).toHaveBeenCalledWith('hashed_old_password', 'wrong_old_password')

        })

        it('should throw BadRequestException if new password and confirmation do not match', async () => {

            const mockUser: User = { id: '123', password: 'hashed_old_password' } as User;

            (verify as jest.Mock).mockResolvedValue(true);

            await expect(accountPrisma.changePassword(mockUser, {

                oldPassword: 'correct_old_password',

                newPassword: 'newPass123',

                confirmNewPassword: 'wrongConfirmPass',

            })).rejects.toThrow(BadRequestException)

        })

        it('should update password and return true', async () => {

            const mockUser: User = { id: '123', password: 'hashed_old_password' } as User;

            (verify as jest.Mock).mockResolvedValue(true);

            (hash as jest.Mock).mockResolvedValue('hashed_new_password');

            (prismaMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, password: 'hashed_new_password' });


            const result = await accountPrisma.changePassword(mockUser, {

                oldPassword: 'correct_old_password',

                newPassword: 'newPass123',

                confirmNewPassword: 'newPass123',

            })

            expect(result).toBe(true)

            expect(verify).toHaveBeenCalledWith('hashed_old_password', 'correct_old_password')

            expect(prismaMock.user.update).toHaveBeenCalledWith({

                where: { id: '123' },

                data: { password: 'hashed_new_password' }

            })

        })

    })

})


