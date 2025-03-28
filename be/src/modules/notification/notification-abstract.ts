import { SponsorshipPlan, User } from "@/prisma/generated";
import { ChangeNotificationSettingsInput } from "./inputs/change-notification-settings.input";

export abstract class NotificationAbstract {

    abstract findUnReadCount(user: User): Promise<any>

    abstract findByUser(user: User): Promise<any>

    abstract createStreamStart(userId: string, channel: User): Promise<any>

    abstract createNewFollowing(userId: string, follower: User): Promise<any>

    abstract createNewSponsorship(userId: string, plan: SponsorshipPlan, sponsor: User): Promise<any>

    abstract createEnableTwoFactor(userId: string): Promise<any>

    abstract createVerifyChannel(userId: string): Promise<any>

    abstract changeSettings(user: User, input: ChangeNotificationSettingsInput): Promise<any>

}