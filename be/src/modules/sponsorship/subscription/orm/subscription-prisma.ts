import { Injectable } from "@nestjs/common";
import { SubscriptionAbstract } from "../subscription-abstract";
import { User } from "@/prisma/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class PrismaSubscription extends SubscriptionAbstract {

    constructor(private readonly prismaService: PrismaService) {

        super()

    }

    public async findMySponsors(user: User): Promise<any> {

        const sponsors = await this.prismaService.sponsorshipSubscription.findMany({

            where: {

                channelId: user.id

            },
            orderBy: {

                createdAt: 'desc'

            },
            include: {

                user: true,

                plan: true,

                channel: true

            }

        })

        return sponsors

    }


}