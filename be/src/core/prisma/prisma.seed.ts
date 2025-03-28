import { BadRequestException, Logger } from "@nestjs/common";
import { Prisma, PrismaClient } from '../../../prisma/generated'
import { hash } from "argon2";
import { categoriesData } from "./seed/data/categories.data";
import { streamTitle } from "./seed/data/streams.data";
import { usernames } from "./seed/data/users.data";

const prisma = new PrismaClient({

    transactionOptions: {

        maxWait: 5000,

        timeout: 20000,

        isolationLevel: Prisma.TransactionIsolationLevel.Serializable

    }

})

const main = async () => {

    try {

        Logger.log('Begin fill record in DB!')

        await prisma.$transaction([

            prisma.user.deleteMany(),

            prisma.socialLink.deleteMany(),

            prisma.stream.deleteMany(),

            prisma.category.deleteMany()

        ])

        await prisma.category.createMany({

            data: categoriesData

        })

        Logger.log('Categories has been created!')

        const categories = await prisma.category.findMany()

        const categoriesBySlug = Object.fromEntries(

            categories.map(category => [category.slug, category])

        )

        await prisma.$transaction(async tx => {

            for (const username of usernames) {

                const randomCategory = categoriesBySlug[

                    Object.keys(categoriesBySlug)[

                    Math.floor(Math.random() * Object.keys(categoriesBySlug).length)

                    ]

                ]

                const userExists = await tx.user.findUnique({

                    where: {

                        username

                    }

                })

                if (!userExists) {

                    const createdUser = await tx.user.create({

                        data: {

                            email: `${username}@tanstream.com`,

                            password: await hash('123456789'),

                            username,

                            displayName: username,

                            avatar: `/channels/${username}.webp`,

                            isEmailVerified: true,

                            socialLinks: {

                                createMany: {

                                    data: [

                                        {
                                            title: 'Telegram',
                                            url: `https://t.me/${username}`,
                                            position: 1
                                        },

                                        {
                                            title: 'Youtube',
                                            url: `https://youtube.com/${username}`,
                                            position: 2
                                        }

                                    ]

                                }

                            }

                        }

                    })

                    const randomTitles = streamTitle[randomCategory.slug]

                    const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)]

                    await tx.stream.create({

                        data: {

                            title: randomTitle,

                            thumbnailUrl: `/streams/${createdUser.username}.webp`,

                            user: {

                                connect: {

                                    id: createdUser.id

                                },

                            },

                            category: {

                                connect: {

                                    id: randomCategory.id

                                }

                            }
                        }

                    })

                    Logger.log(`User ${createdUser.username} has been created successfully!`)

                }

            }

        })

        Logger.log('Add record into Db successfully!')

    } catch (error) {

        Logger.error(error)

        throw new BadRequestException('Error fill record database!')

    } finally {

        Logger.log('Disconnecting database...')

        await prisma.$disconnect()

        Logger.log('Disconnected database successfully!')

    }

}

main()