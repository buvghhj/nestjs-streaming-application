import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowModel } from './models/follow.model';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';

@Resolver('Follow')
export class FollowResolver {

  public constructor(private readonly followService: FollowService) { }

  //Hiển thị người theo dõi của tôi
  @Authorization()
  @Query(() => [FollowModel], { name: "findMyFollowers" })
  public async findMyFollowers(@Authorized() user: User) {

    return this.followService.findMyFollowers(user)

  }

  //Hiển thị người tôi theo dõi
  @Authorization()
  @Query(() => [FollowModel], { name: "findMyFollowings" })
  public async findMyFollowings(@Authorized() user: User) {

    return this.followService.findMyFollowings(user)

  }

  //Theo dõi kênh
  @Authorization()
  @Mutation(() => Boolean, { name: "followChannel" })
  public async follow(
    @Authorized() user: User,
    @Args('channelId') channelId: string
  ) {

    return this.followService.follow(user, channelId)

  }

  //Hủy theo dõi
  @Authorization()
  @Mutation(() => Boolean, { name: "unFollowChannel" })
  public async unFollow(
    @Authorized() user: User,
    @Args('channelId') channelId: string
  ) {

    return this.followService.unFollow(user, channelId)

  }

}
