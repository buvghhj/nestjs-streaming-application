import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "@/src/modules/stream/models/stream.model";
import { FollowModel } from "@/src/modules/follow/models/follow.model";
import { User } from "@/prisma/generated";
import { NotificationModel } from "@/src/modules/notification/models/notifications.model";
import { NotificationSettingsModel } from "@/src/modules/notification/models/notification-settings.model";
import { SponsorshipPlanModel } from "@/src/modules/sponsorship/plan/models/sponsorship-plan.model";
import { SponsorshipSubscriptionModel } from "@/src/modules/sponsorship/subscription/models/sponsorship-subscription.model";

@ObjectType()
export class UserModel implements User {

    @Field(() => ID)
    public id: string

    @Field(() => String)
    public email: string

    @Field(() => String)
    public password: string

    @Field(() => String)
    public username: string

    @Field(() => String)
    public displayName: string

    @Field(() => String, { nullable: true })
    public avatar: string

    @Field(() => String, { nullable: true })
    public bio: string

    @Field(() => String, { nullable: true })
    public telegramId: string

    @Field(() => Boolean)
    public isVerified: boolean

    @Field(() => Boolean)
    public isEmailVerified: boolean

    @Field(() => Boolean)
    public isTotpEnabled: boolean

    @Field(() => String, { nullable: true })
    public totpSecret: string

    @Field(() => Boolean)
    public isDeactivated: boolean

    @Field(() => Date, { nullable: true })
    public deactivatedAt: Date

    @Field(() => [SocialLinkModel])
    public socialLinks: SocialLinkModel[]

    @Field(() => StreamModel)
    public stream: StreamModel

    @Field(() => [FollowModel])
    public followers: FollowModel[]

    @Field(() => [FollowModel])
    public followings: FollowModel[]

    @Field(() => [NotificationModel])
    public notifications: NotificationModel[]

    @Field(() => NotificationSettingsModel, { nullable: true })
    public notificationSettings: NotificationSettingsModel

    @Field(() => [SponsorshipPlanModel])
    public sponsorshipPlans: SponsorshipPlanModel[]

    @Field(() => [SponsorshipSubscriptionModel])
    public sponsorshipSubscriptions: SponsorshipPlanModel[]

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date

}