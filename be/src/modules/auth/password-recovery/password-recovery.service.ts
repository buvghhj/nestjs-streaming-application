import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { NewPasswordInput } from './inputs/new-password.input';
import { PasswordRecoveryAbstract } from './password-recovery-abstract';

@Injectable()
export class PasswordRecoveryService {

    public constructor(private readonly passwordRecoveryAbstract: PasswordRecoveryAbstract) { }

    //Lấy lại - cài lại mật khẩu
    public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {

        return await this.passwordRecoveryAbstract.resetPassword(req, input, userAgent)

    }

    //Đặt mật khẩu mới
    public async newPassword(input: NewPasswordInput) {

        return await this.passwordRecoveryAbstract.newPassword(input)

    }

}
