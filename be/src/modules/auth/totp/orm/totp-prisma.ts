import { BadRequestException, Injectable } from "@nestjs/common";
import { TotpAbstract } from "../totp.abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { User } from "@/prisma/generated";
import { encode } from 'hi-base32';
import { randomBytes } from 'crypto';
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';
import { EnableTotpInput } from "../inputs/enable-totp.input";

@Injectable()
export class PrismaTotp extends TotpAbstract {

    constructor(private readonly prismaService: PrismaService) {

        super()

    }

    public async generate(user: User): Promise<{}> {

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

    public async enable(user: User, input: EnableTotpInput): Promise<boolean> {

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

    public async disable(user: User): Promise<boolean> {


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