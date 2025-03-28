import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import Stripe from 'stripe';
import { TransactionStatus } from '@/prisma/generated';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';
import { StripeService } from '@/src/modules/libs/stripe/stripe.service';

@Injectable()
export class WebhookService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly livekitService: LivekitService,
        private readonly notificationService: NotificationService,
        private readonly telegramService: TelegramService,
        private readonly stripeSerivce: StripeService,
        private readonly configService: ConfigService,
    ) { }

    public async receiveWebhookLivekit(body: string, authorization: string) {


        const event = this.livekitService.receiver.receive(body, authorization, true)

        if (event.event === 'ingress_started') {

            console.log('STREAM STARTED: ', event.ingressInfo.url)

            const stream = await this.prismaService.stream.findFirst({

                where: {

                    ingressId: event.ingressInfo.ingressId,

                    isLive: false

                },
                include: {

                    user: true

                }

            })

            if (!stream) {

                console.log('Stream not found for ingressId:', event.ingressInfo.ingressId)

                return

            }

            await this.prismaService.stream.update({

                where: {

                    ingressId: event.ingressInfo.ingressId,

                    isLive: false

                },
                data: {

                    isLive: true

                }

            })

            const followers = await this.prismaService.follow.findMany({

                where: {

                    followingId: stream.userId,

                    follower: {

                        isDeactivated: false

                    },

                },
                include: {

                    follower: {

                        include: {

                            notificationSettings: true

                        }

                    }

                }

            })

            for (const follow of followers) {

                const follower = follow.follower

                if (follower.notificationSettings?.siteNotifications) {

                    await this.notificationService.createStreamStart(follower.id, stream.user)

                }

                if (follower.notificationSettings?.telegramNotifications && follower.telegramId) {

                    await this.telegramService.sendStreamStart(follower.telegramId, stream.user)

                }

            }

        }

        if (event.event === 'ingress_ended') {

            const stream = await this.prismaService.stream.update({

                where: {

                    ingressId: event.ingressInfo.ingressId

                },
                data: {

                    isLive: false

                }

            })

            await this.prismaService.chatMessage.deleteMany({

                where: {

                    streamId: stream.id

                }

            })

        }

    }

    public async receiveWebhookStripe(event: Stripe.Event) {

        const session = event.data.object as Stripe.Checkout.Session

        if (event.type === 'checkout.session.completed') {

            const planId = session.metadata.planId

            const userId = session.metadata.userId

            const channelId = session.metadata.channelId

            const expiresAt = new Date()

            expiresAt.setDate(expiresAt.getDay() + 30)

            const sponsorshipSubscription = await this.prismaService.sponsorshipSubscription.create({

                data: {

                    expiresAt,

                    planId,

                    userId,

                    channelId

                },
                include: {

                    plan: true,

                    user: true,

                    channel: {

                        include: {

                            notificationSettings: true

                        }

                    }

                }

            })

            await this.prismaService.transaction.updateMany({

                where: {

                    stripeSubscriptionId: session.id,

                    status: TransactionStatus.PENDING

                },
                data: {

                    status: TransactionStatus.SUCCESS

                }

            })

            if (sponsorshipSubscription.channel.notificationSettings.siteNotifications) {

                await this.notificationService.createNewSponsorship(

                    sponsorshipSubscription.channel.id,

                    sponsorshipSubscription.plan,

                    sponsorshipSubscription.user

                )

            }

            if (sponsorshipSubscription.channel.notificationSettings.telegramNotifications && sponsorshipSubscription.channel.telegramId) {

                await this.telegramService.sendNewSponsorship(

                    sponsorshipSubscription.channel.telegramId,

                    sponsorshipSubscription.plan,

                    sponsorshipSubscription.user

                )

            }

        }

        if (event.type === 'checkout.session.async_payment_failed') {

            await this.prismaService.transaction.updateMany({

                where: {

                    stripeSubscriptionId: session.id,

                },
                data: {

                    status: TransactionStatus.FAILED

                }

            })

        }

    }

    public constructorStripeEvent(payload: any, signature: any) {

        return this.stripeSerivce.webhooks.constructEvent(

            payload,

            signature,

            this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')

        )

    }

}
