import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChannelService {

    public constructor(private readonly prismaService: PrismaService) { }

    //Hiển thị các kênh có lượt đăng ký cao
    public async findRecommendedChannels() {

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

    //Tìm kiếm kênh theo tên
    public async findByUsername(username: string) {

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

    //Hiển thị số lượng người đăng ký kênh
    public async findFollowersCountByChannel(channelId: string) {

        const followersCount = await this.prismaService.follow.count({

            where: {

                following: {

                    id: channelId

                }

            }

        })

        return followersCount

    }

    //Hiển thị các gói thành viên đã đăng ký của kênh
    public async findSponsorByChannel(channelId: string) {

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
