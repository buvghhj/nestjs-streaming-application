import { User } from '@/prisma/generated';
import { Injectable } from '@nestjs/common';
import { EnableTotpInput } from './inputs/enable-totp.input';
import { TotpAbstract } from './totp.abstract';

@Injectable()
export class TotpService {

    public constructor(private readonly totpAbstract: TotpAbstract) { }

    //Tạo mã QR cho TOTP
    public async generate(user: User) {

        return await this.totpAbstract.generate(user)

    }

    //Bật xác thực TOTP
    public async enable(user: User, input: EnableTotpInput) {

        return await this.totpAbstract.enable(user, input)

    }

    //Tắt xác thực TOTP
    public async disable(user: User) {

        return await this.totpAbstract.disable(user)

    }

}
