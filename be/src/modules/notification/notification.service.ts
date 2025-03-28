import { SponsorshipPlan, User } from '@/prisma/generated';
import { Injectable } from '@nestjs/common';
import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';
import { NotificationAbstract } from './notification-abstract';

@Injectable()
export class NotificationService {

    public constructor(private readonly notificationAbstract: NotificationAbstract) { }

    //Hiển thị số lượng tin nhắn (chưa đọc)
    public async findUnReadCount(user: User) {

        return await this.notificationAbstract.findUnReadCount(user)

    }

    //Hiển thị thông báo (đánh dấu đã đọc)
    public async findByUser(user: User) {

        return await this.notificationAbstract.findByUser(user)

    }

    public async createStreamStart(userId: string, channel: User) {

        return await this.notificationAbstract.createStreamStart(userId, channel)

    }

    public async createNewFollowing(userId: string, follower: User) {

        return await this.notificationAbstract.createNewFollowing(userId, follower)

    }

    public async createNewSponsorship(userId: string, plan: SponsorshipPlan, sponsor: User) {

        return await this.notificationAbstract.createNewSponsorship(userId, plan, sponsor)

    }

    public async createEnableTwoFactor(userId: string) {

        return await this.notificationAbstract.createEnableTwoFactor(userId)

    }

    public async createVerifyChannel(userId: string) {

        return await this.notificationAbstract.createVerifyChannel(userId)

    }

    //Tùy chỉnh cài đặt thông báo (bật tắt thông báo trên website hoặc teplegram)
    public async changeSettings(user: User, input: ChangeNotificationSettingsInput) {

        return await this.notificationAbstract.changeSettings(user, input)

    }

}
