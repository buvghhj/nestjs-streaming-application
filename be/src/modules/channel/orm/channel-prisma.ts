import { Injectable, NotFoundException } from "@nestjs/common";
import { ChannelAbstract } from "../channel-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class PrismaChannel extends ChannelAbstract {

    constructor(private readonly prismaService: PrismaService) {

        super()

    }

    public async findRecommendedChannels(): Promise<any> {

        const channels = await this.prismaService.user.findMany({

            where: {

                isDeactivated: false

            },
            orderBy: {

                followings: {

                    _count: 'desc'

                }

            },
            include: {

                stream: true

            },

            take: 12

        })

        return channels

    }

    public async findByUsername(username: string): Promise<any> {

        const channel = await this.prismaService.user.findUnique({

            where: {

                username,

                isDeactivated: false

            },
            include: {

                socialLinks: {

                    orderBy: {

                        position: 'asc'

                    }

                },
                stream: {

                    include: {

                        category: true,
                        chatMessages: true

                    }

                },
                followings: true,

                sponsorshipPlans: true,

                sponsorshipSubscriptions: true

            }

        })

        if (!channel) {

            throw new NotFoundException('Không tìm thấy kênh phù hợp!')

        }

        return channel

    }

    public async findFollowersCountByChannel(channelId: string): Promise<number> {

        const followersCount = await this.prismaService.follow.count({

            where: {

                following: {

                    id: channelId

                }

            }

        })

        return followersCount

    }

    public async findSponsorByChannel(channelId: string): Promise<any> {

        const channel = await this.prismaService.user.findUnique({

            where: {

                id: channelId

            }

        })

        if (!channel) {

            throw new NotFoundException('Không có kênh phù hợp!')

        }

        const sponsors = await this.prismaService.sponsorshipSubscription.findMany({

            where: {

                channelId: channel.id

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