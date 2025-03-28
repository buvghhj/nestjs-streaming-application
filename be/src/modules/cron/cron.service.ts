import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@/prisma/generated';
import { CronAbstract } from './cron-abstract';

@Injectable()
export class CronService {

    public constructor(private readonly cronAbstract: CronAbstract) { }

    //Tự động xóa tài khoản bị vô hiệu hóa sau 7 ngày
    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    public async deletedDeactivateAccount(user: User) {

        return await this.cronAbstract.deletedDeactivateAccount(user)

    }

    //Thông báo nhắc nhở bật xác thực 2 yếu tố cho tài khoản
    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    public async notifyUserEnableTwoFactor() {

        return await this.cronAbstract.notifyUserEnableTwoFactor()

    }

    //Thông báo kênh đã có hiệu đủ điều kiện tạo gói hội viên
    @Cron(CronExpression.EVERY_5_SECONDS)
    public async verifyChannel() {

        return await this.cronAbstract.verifyChannel()

    }

    //Tự động xóa thông báo đã đọc trên website sau 7 ngày
    @Cron(CronExpression.EVERY_10_SECONDS)
    public async deleteNotification() {

        return await this.cronAbstract.deleteNotification()

    }

}
