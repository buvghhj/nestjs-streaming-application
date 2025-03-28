import { User } from "@/prisma/generated";

export abstract class FollowAbstract {

    abstract findMyFollowers(user: User): Promise<any>

    abstract findMyFollowings(user: User): Promise<any>

    abstract follow(user: User, channelId: string): Promise<any>

    abstract unFollow(user: User, channelId: string): Promise<any>

}