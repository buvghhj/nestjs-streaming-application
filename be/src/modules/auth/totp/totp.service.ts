import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';
import { TOTP } from 'otpauth'
import * as QRCode from 'qrcode';
import { EnableTotpInput } from './inputs/enable-totp.input';

@Injectable()
export class TotpService {

    public constructor(private readonly prismaService: PrismaService) { }

    //Tạo mã QR cho TOTP
    public async generate(user: User) {

        const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 14)

        const totp = new TOTP({

            issuer: "TanStream",

            label: `${user.email}`,

            algorithm: 'SHA1',

            digits: 6,

            secret

        })

        const otpAuthUrl = totp.toString()

        const qrcodeUrl = await QRCode.toDataURL(otpAuthUrl)

        return { qrcodeUrl, secret }

    }

    //Bật xác thực TOTP
    public async enable(user: User, input: EnableTotpInput) {

        const { secret, pin } = input

        const totp = new TOTP({

            issuer: "TanStream",

            label: `${user.email}`,

            algorithm: 'SHA1',

            digits: 6,

            secret

        })

        const delta = totp.validate({ token: pin })

        if (delta === null) {

            throw new BadRequestException('Mã xác thực không chính xác!')

        }

        await this.prismaService.user.update({

            where: {

                id: user.id,

            },

            data: {

                isTotpEnabled: true,

                totpSecret: secret

            }

        })

        return true

    }

    //Tắt xác thực TOTP
    public async disable(user: User) {

        await this.prismaService.user.update({

            where: {

                id: user.id,

            },

            data: {

                isTotpEnabled: false,

                totpSecret: null

            }

        })

        return true

    }

}
