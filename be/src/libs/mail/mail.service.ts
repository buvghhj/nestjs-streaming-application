import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { VerifyEmailTemplate } from './templates/verify-email.template';
import { ResetPasswordTemplate } from './templates/password-recovery.template';
import { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { DeactivateTemplate } from './templates/deactivate.template';
import { AccountDeletionTemplate } from './templates/account-deletion.template';
import { EnableTwoFactorTemplate } from './templates/enable-two-factor.template';
import { VerifyChannelTemplate } from './templates/verify-channel.template';

@Injectable()
export class MailService {

    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    private sendMail(email: string, subject: string, html: string) {

        return this.mailerService.sendMail({

            to: email,

            subject,

            html

        })

    }

    public async sendVerifyEmailToken(email: string, token: string) {

        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

        const html = await render(VerifyEmailTemplate({ domain, token }))

        return this.sendMail(email, "Xác thực tài khoản", html)

    }

    public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata) {

        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

        const html = await render(ResetPasswordTemplate({ domain, token, metadata }))

        return this.sendMail(email, "Lấy lại mật khẩu", html)

    }

    public async sendDeactivateToken(email: string, token: string, metadata: SessionMetadata) {

        const html = await render(DeactivateTemplate({ token, metadata }))

        return this.sendMail(email, "Vô hiệu hóa tài khoản", html)

    }

    public async sendAccountDeletion(email: string) {

        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

        const html = await render(AccountDeletionTemplate({ domain }))

        return this.sendMail(email, 'Xóa tài khoản', html)

    }

    public async sendEnableTwoFactor(email: string) {

        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

        const html = await render(EnableTwoFactorTemplate({ domain }))

        return this.sendMail(email, 'Bật bảo mật 2FA', html)

    }

    public async sendVerifyChannel(email: string) {

        const html = await render(VerifyChannelTemplate())

        return this.sendMail(email, 'Huy hiệu kênh', html)

    }

}
