import { ChatMessage } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.models";
import { StreamModel } from "../../stream/models/stream.model";

@ObjectType()
export class ChatModel implements ChatMessage {

    @Field(() => ID)
    public id: string

    @Field(() => String)
    public text: string

    @Field(() => UserModel)
    public user: UserModel

    @Field(() => String)
    public userId: string

    @Field(() => StreamModel, { nullable: true })
    public stream?: StreamModel

    @Field(() => String)
    public streamId: string

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date

}