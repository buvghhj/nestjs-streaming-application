import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoryService {

    public constructor(private readonly prismaService: PrismaService) { }

    //Hiển thị tất cả categories
    public async findAll() {

        const categories = await this.prismaService.category.findMany({

            orderBy: {

                createdAt: 'desc'

            },

            include: {

                streams: {

                    include: {

                        user: true,

                        category: true

                    }

                }

            }

        })

        return categories

    }

    //Hiển thị ngẫu nhiên categories
    public async findRandom() {

        const total = await this.prismaService.category.count()

        const randomIndexs = new Set<number>()

        while (randomIndexs.size < 7) {

            const randomIndex = Math.floor(Math.random() * total)


            randomIndexs.add(randomIndex)

        }

        const categories = await this.prismaService.category.findMany({

            include: {

                streams: {

                    include: {

                        user: true,

                        category: true

                    }

                }

            },

            take: total,

            skip: 0,

        })

        return Array.from(randomIndexs).map(index => categories[index])

    }

    //Hiển thị category theo slug
    public async findBySlug(slug: string) {

        const category = await this.prismaService.category.findUnique({

            where: {

                slug

            },
            include: {

                streams: {

                    include: {

                        user: true,

                        category: true

                    }

                }

            }

        })

        if (!category) {

            throw new NotFoundException('Không tìm thấy thể loại yêu cầu!')

        }

        return category

    }

}
