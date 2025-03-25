import { Query, Resolver } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { SponsorshipSubscriptionModel } from './models/sponsorship-subscription.model';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';

@Resolver('Subscription')
export class SubscriptionResolver {

  public constructor(private readonly subscriptionService: SubscriptionService) { }

  //Hiển thị những hội viên của tôi
  @Authorization()
  @Query(() => [SponsorshipSubscriptionModel], { name: 'findMySponsors' })
  public async findMySponsors(@Authorized() user: User) {

    return this.subscriptionService.findMySponsors(user)

  }

}
