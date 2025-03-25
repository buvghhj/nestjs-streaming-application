import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { hash, verify } from 'argon2'
import { VerificationService } from '../verification/verification.service';
import { User } from '@/prisma/generated';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';

@Injectable()
export class AccountService {

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly verificationSerivce: VerificationService
  ) { }

  //Get current user
  public async me(id: string) {

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

  //Create user
  public async createUser(input: CreateUserInput) {

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

            title: `Kênh ${username}`

          }

        }

      }

    })

    await this.verificationSerivce.sendVerifyEmailToken(user)

    return true

  }

  //Edit email
  public async changeEmail(user: User, input: ChangeEmailInput) {

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

  //Edit password
  public async changePassword(user: User, input: ChangePasswordInput) {

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
