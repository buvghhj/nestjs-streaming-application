import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { TransactionAbstract } from "../transaction-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "@/src/modules/libs/stripe/stripe.service";
import { User } from "@/prisma/generated";

@Injectable()
export class PrismaTransaction extends TransactionAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly stripeService: StripeService
    ) {

        super()

    }

    public async findMyTransactions(user: User): Promise<any> {

        const transactions = await this.prismaService.transaction.findMany({

            where: {

                userId: user.id

            },
            include: {

                user: true

            }

        })

        return transactions

    }

    public async makePayment(user: User, planId: string): Promise<any> {

        const plan = await this.prismaService.sponsorshipPlan.findUnique({

            where: {

                id: planId

            },
            include: {

                channel: true

            }

        })

        if (!plan) {

            throw new NotFoundException('Không tìm thấy gói hội viên!')

        }

        if (user.id === plan.channel.id) {

            throw new ConflictException('Bạn không thể mua gói hội viên của mình!')

        }

        const existingSubscription = await this.prismaService.sponsorshipSubscription.findFirst({

            where: {

                userId: user.id,

                channelId: plan.channel.id

            }

        })

        if (existingSubscription) {

            throw new ConflictException('Bạn đã mua gói hội viên này rồi!')

        }

        const customer = await this.stripeService.customers.create({

            name: user.displayName,

            email: user.email

        })

        const successUrl = `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/success?price=${encodeURIComponent(plan.price)}&username=${encodeURIComponent(plan.channel.username)}`

        const cancelUrl = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

        const session = await this.stripeService.checkout.sessions.create({

            payment_method_types: ['card'],

            line_items: [

                {
                    price_data: {

                        currency: 'usd',

                        product_data: {

                            name: plan.title,

                        },

                        unit_amount: Math.round(plan.price * 100),

                        recurring: {

                            interval: 'month'

                        }

                    },
                    quantity: 1
                }

            ],

            mode: 'subscription',

            success_url: successUrl,

            cancel_url: cancelUrl,

            customer: customer.id,

            metadata: {

                planId: plan.id,

                userId: user.id,

                channelId: plan.channel.id

            }

        })

        await this.prismaService.transaction.create({

            data: {

                amount: plan.price,

                currency: session.currency,

                stripeSubscriptionId: session.id,

                user: {

                    connect: {

                        id: user.id

                    }

                }

            }

        })

        return { url: session.url }

    }

}