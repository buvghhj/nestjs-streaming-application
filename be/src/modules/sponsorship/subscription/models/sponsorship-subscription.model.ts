import { SponsorshipSubscription } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SponsorshipPlanModel } from "../../plan/models/sponsorship-plan.model";
import { UserModel } from "@/src/modules/auth/account/models/user.models";

@ObjectType()
export class SponsorshipSubscriptionModel implements SponsorshipSubscription {

    @Field(() => ID)
    public id: string

    @Field(() => Date)
    public expiresAt: Date

    @Field(() => SponsorshipPlanModel)
    public plan: SponsorshipPlanModel

    @Field(() => String)
    public planId: string

    @Field(() => UserModel)
    public user: UserModel

    @Field(() => String)
    public userId: string

    @Field(() => UserModel)
    public channel: UserModel

    @Field(() => String)
    public channelId: string

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date

}