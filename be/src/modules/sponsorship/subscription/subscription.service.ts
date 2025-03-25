import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {

    public constructor(private readonly prismaService: PrismaService) { }

    //Hiển thị những hội viên của tôi
    public async findMySponsors(user: User) {

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
