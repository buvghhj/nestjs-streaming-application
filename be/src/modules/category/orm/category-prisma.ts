import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryAbstract } from "../category-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class PrismaCategory extends CategoryAbstract {

    constructor(private readonly prismaService: PrismaService) {

        super()

    }

    public async findAll(): Promise<any> {

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

    public async findRandom(): Promise<any> {

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

    public async findBySlug(slug: string): Promise<any> {

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