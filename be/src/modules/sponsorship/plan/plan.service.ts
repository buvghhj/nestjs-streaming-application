import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/prisma/generated';
import { CreateSponsorshipPlanInput } from './inputs/create-sponsorship-plan.inut';
import { StripeService } from '@/src/libs/stripe/stripe.service';

@Injectable()
export class PlanService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly stripeService: StripeService
    ) { }

    //Hiển thị các gói hội viên của tôi
    public async findMyPlans(user: User) {

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

    //Tạo gói hội viên
    public async create(user: User, input: CreateSponsorshipPlanInput) {

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

    //Xóa gói hôi viên
    public async remove(planId: string) {

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
