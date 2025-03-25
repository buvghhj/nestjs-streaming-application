import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { UserModel } from '../auth/account/models/user.models';
import { SponsorshipSubscriptionModel } from '../sponsorship/subscription/models/sponsorship-subscription.model';

@Resolver('Channel')
export class ChannelResolver {

  public constructor(private readonly channelService: ChannelService) { }

  //Hiển thị các kênh có lượt đăng ký cao
  @Query(() => [UserModel], { name: 'findRecommendedChannels' })
  public async findRecommendedChannels() {

    return this.channelService.findRecommendedChannels()

  }

  //Tìm kiếm kênh theo tên
  @Query(() => UserModel, { name: 'findChannelByUsername' })
  public async findByUsername(@Args('username') username: string) {

    return this.channelService.findByUsername(username)

  }

  //Hiển thị số lượng người đăng ký của kênh
  @Query(() => Number, { name: 'findFollowersCountByChannel' })
  public async findFollowersCountByChannel(@Args('channelId') channelId: string) {

    return this.channelService.findFollowersCountByChannel(channelId)

  }

  //Hiển thị các gói thành viên đã đăng ký của kênh
  @Query(() => [SponsorshipSubscriptionModel], { name: 'findSponsorByChannel' })
  public async findSponsorByChannel(@Args('channelId') channelId: string) {

    return this.channelService.findSponsorByChannel(channelId)

  }

}
