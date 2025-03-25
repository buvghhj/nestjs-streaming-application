import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlanService } from './plan.service';
import { SponsorshipPlanModel } from './models/sponsorship-plan.model';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';
import { CreateSponsorshipPlanInput } from './inputs/create-sponsorship-plan.inut';

@Resolver('Plan')
export class PlanResolver {

  public constructor(private readonly planService: PlanService) { }

  //Hiển thị các gói hội viên của tôi
  @Authorization()
  @Query(() => [SponsorshipPlanModel], { name: 'findMySponsorshipPlans' })
  public async findMyPlans(@Authorized() user: User) {

    return this.planService.findMyPlans(user)

  }

  //Tạo gói hội viên
  @Authorization()
  @Mutation(() => Boolean, { name: "createSponsorshipPlan" })
  public async createSponsorshipPlan(
    @Authorized() user: User,
    @Args('data') input: CreateSponsorshipPlanInput
  ) {

    return this.planService.create(user, input)

  }

  //Xóa gói hôi viên
  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSponsorshipPlan' })
  public async removeSponsorshipPlan(@Args('planId') planId: string) {

    return this.planService.remove(planId)

  }

}
