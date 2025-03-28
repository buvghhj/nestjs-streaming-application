import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PlanAbstract } from "../plan-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { StripeService } from "@/src/modules/libs/stripe/stripe.service";
import { User } from "@/prisma/generated";
import { CreateSponsorshipPlanInput } from "../inputs/create-sponsorship-plan.inut";

@Injectable()
export class PrismaPlan extends PlanAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly stripeService: StripeService
    ) {

        super()

    }

    public async findMyPlans(user: User): Promise<any> {

        const plans = await this.prismaService.sponsorshipPlan.findMany({

            where: {

                channelId: user.id

            },
            include: {

                channel: true

            }

        })

        return plans

    }

    public async create(user: User, input: CreateSponsorshipPlanInput): Promise<any> {

        const { title, description, price } = input

        const channel = await this.prismaService.user.findUnique({

            where: {

                id: user.id

            }

        })

        if (!channel.isVerified) {

            throw new ForbiddenException('Tài khoản của bạn chưa đủ điều kiện tạo gói hội viên!')

        }

        const stripePlan = await this.stripeService.plans.create({

            amount: Math.round(price * 100),

            currency: 'usd',

            interval: 'month',

            product: {

                name: title

            }

        })

        await this.prismaService.sponsorshipPlan.create({

            data: {

                title,

                description,

                price,

                stripeProductId: stripePlan.product.toString(),

                stripePlanId: stripePlan.id,

                channel: {

                    connect: {

                        id: user.id

                    }

                }

            }

        })

        return true

    }

    public async remove(planId: string): Promise<any> {


        const plan = await this.prismaService.sponsorshipPlan.findUnique({

            where: {

                id: planId

            }

        })

        if (!plan) {

            throw new NotFoundException('Không tìm thấy gói hội viên!')

        }

        await this.stripeService.plans.del(plan.stripePlanId)

        await this.stripeService.products.del(plan.stripeProductId)

        await this.prismaService.sponsorshipPlan.delete({

            where: {

                id: plan.id

            }

        })

        return true

    }

}