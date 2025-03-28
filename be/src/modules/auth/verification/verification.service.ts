import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { VerificationInput } from './inputs/verification.input';
import { User } from '@/prisma/generated';
import { VerificationAbstract } from './verification-abstract';

@Injectable()
export class VerificationService {

    public constructor(private readonly verificationAbstract: VerificationAbstract) { }

    //Xác thực tài khoản người dùng
    public async verify(req: Request, input: VerificationInput, userAgent: string) {

        return await this.verificationAbstract.verify(req, input, userAgent)

    }

    //Gửi mã xác thực tài khoản qua email
    public async sendVerifyEmailToken(user: User) {

        return await this.verificationAbstract.sendVerifyEmailToken(user)

    }

}
