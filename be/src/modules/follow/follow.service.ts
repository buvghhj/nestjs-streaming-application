import { User } from '@/prisma/generated';
import { Injectable } from '@nestjs/common';
import { FollowAbstract } from './follow-abstract';

@Injectable()
export class FollowService {

    public constructor(private readonly followAbstract: FollowAbstract) { }

    //Hiển thị người theo dõi của tôi
    public async findMyFollowers(user: User) {

        return await this.followAbstract.findMyFollowers(user)

    }

    //Hiển thị người tôi theo dõi
    public async findMyFollowings(user: User) {

        return await this.followAbstract.findMyFollowings(user)

    }

    //Theo dõi kênh
    public async follow(user: User, channelId: string) {

        return await this.followAbstract.follow(user, channelId)

    }

    //Hủy theo dõi
    public async unFollow(user: User, channelId: string) {

        return await this.followAbstract.unFollow(user, channelId)

    }

}
