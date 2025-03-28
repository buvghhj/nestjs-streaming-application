import { AccountServiceAbstract } from "../account-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2'
import { User } from '@/prisma/generated';
import { CreateUserInput } from "../inputs/create-user.input";
import { ChangeEmailInput } from "../inputs/change-email.input";
import { ChangePasswordInput } from "../inputs/change-password.input";
import { VerificationService } from "../../verification/verification.service";

@Injectable()
export class PrismaAccount extends AccountServiceAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly verificationService: VerificationService
    ) {

        super()

    }

    public async me(id: string): Promise<User | null> {

        const user = await this.prismaService.user.findUnique({

            where: {

                id

            },
            include: {

                socialLinks: true,

                stream: true,

                notificationSettings: true,

                sponsorshipPlans: true,

                sponsorshipSubscriptions: true

            }

        })

        return user

    }

    public async createUser(input: CreateUserInput): Promise<boolean> {

        const { username, email, password } = input

        const isUsernameExists = await this.prismaService.user.findUnique({

            where: {

                username

            }

        })

        if (isUsernameExists) {

            throw new ConflictException('Tên đăng nhập đã tồn tại!')

        }

        const isEmailExists = await this.prismaService.user.findUnique({

            where: {

                email

            }

        })

        if (isEmailExists) {

            throw new ConflictException('Địa chỉ email đã tồn tại!')

        }

        const user = await this.prismaService.user.create({

            data: {

                username,

                email,

                password: await hash(password),

                displayName: username,

                stream: {

                    create: {

                        title: `Kênh của ${username}`

                    }

                }

            }

        })

        await this.verificationService.sendVerifyEmailToken(user)

        return true

    }

    public async changeEmail(user: User, input: ChangeEmailInput): Promise<boolean> {

        const { email } = input

        await this.prismaService.user.update({

            where: {

                id: user.id

            },
            data: {

                email

            }

        })

        return true

    }

    public async changePassword(user: User, input: ChangePasswordInput): Promise<boolean> {

        const { oldPassword, newPassword, confirmNewPassword } = input

        const isValidPassword = await verify(user.password, oldPassword)

        if (!isValidPassword) {

            throw new UnauthorizedException('Thông tin mật khẩu cũ không chính xác!')

        }

        if (newPassword !== confirmNewPassword) {

            throw new BadRequestException('Xác nhận mật khẩu mới không chính xác!')

        }

        await this.prismaService.user.update({

            where: {

                id: user.id

            },

            data: {

                password: await hash(newPassword)

            }

        })

        return true

    }

}