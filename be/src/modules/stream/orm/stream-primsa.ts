import { Injectable, NotFoundException } from "@nestjs/common";
import { StreamAbstract } from "../stream-abstract";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { StorageService } from "../../libs/storage/storage.service";
import { ConfigService } from "@nestjs/config";
import { User } from "@/prisma/generated";
import { FilterInput } from "../inputs/filter.input";
import { ChangeStreamInfoInput } from "../inputs/change-stream-info.input";
import * as sharp from 'sharp'
import * as  Upload from 'graphql-upload/Upload.js'
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { GenerateStreamTokenInput } from "../inputs/generate-stream-token.input";
import { AccessToken } from "livekit-server-sdk";

@Injectable()
export class PrismaStream extends StreamAbstract {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService
    ) {

        super()

    }

    public async findAll(input: FilterInput): Promise<any> {


        const { take, skip, searchTerm } = input

        const whereClause = searchTerm ? this.findBySearchTermFilter(searchTerm) : undefined

        const streams = await this.prismaService.stream.findMany({

            take: take ?? 12,

            skip: skip ?? 0,

            where: {

                user: {

                    isDeactivated: false

                },

                ...whereClause

            },
            include: {

                user: true,

                category: true

            },
            orderBy: {

                createdAt: 'desc'

            }

        })

        return streams

    }

    public async findRandom(): Promise<any> {

        const total = await this.prismaService.stream.count({

            where: {

                user: {

                    isDeactivated: false

                }

            }

        })

        const randomIndexs = new Set<number>()

        while (randomIndexs.size < 4) {

            const randomIndex = Math.floor(Math.random() * total)


            randomIndexs.add(randomIndex)

        }

        const streams = await this.prismaService.stream.findMany({

            where: {

                user: {

                    isDeactivated: false

                }

            },
            include: {

                user: true,

                category: true

            },
            take: total,

            skip: 0

        })

        return Array.from(randomIndexs).map(index => streams[index])

    }

    public async changeInfo(user: User, input: ChangeStreamInfoInput): Promise<any> {

        const { title, categoryId } = input

        await this.prismaService.stream.update({

            where: {

                userId: user.id

            },
            data: {

                title,

                category: {

                    connect: {

                        id: categoryId

                    }

                }

            }

        })

        return true

    }

    public async changeThumbnail(user: User, file: Upload): Promise<any> {

        const stream = await this.findByUserId(user)

        if (stream.thumbnailUrl) {

            await this.storageService.remove(stream.thumbnailUrl)

        }

        const chunks: Buffer[] = []

        for await (const chunk of file.createReadStream()) {

            chunks.push(chunk)

        }

        const buffer = Buffer.concat(chunks)

        const fileName = `streams/${user.username}.webp`

        const bucketName = this.configService.getOrThrow<string>('S3_AWS_BUCKET_NAME')

        const region = this.configService.getOrThrow<string>('S3_AWS_REGION')

        let processedBuffer: Buffer

        if (file.filename && file.filename.endsWith('.gif')) {

            processedBuffer = await sharp(buffer, { animated: true }).resize(1280, 720).webp().toBuffer()

        } else {

            processedBuffer = await sharp(buffer).resize(1280, 720).webp().toBuffer()

        }


        await this.storageService.upload(processedBuffer, fileName, "image/webp", ObjectCannedACL.public_read)

        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`

        await this.prismaService.stream.update({

            where: {

                userId: user.id

            },
            data: {

                thumbnailUrl: fileUrl

            }

        })

        return true

    }

    public async removeThumbnail(user: User): Promise<any> {

        const stream = await this.findByUserId(user)

        if (!stream.thumbnailUrl) {

            return

        }

        await this.storageService.remove(stream.thumbnailUrl)

        await this.prismaService.stream.update({

            where: {

                userId: user.id

            },
            data: {

                thumbnailUrl: null

            }

        })

        return true

    }

    public async generateToken(input: GenerateStreamTokenInput): Promise<any> {

        const { userId, channelId } = input

        let self: { id: string, username: string }

        const user = await this.prismaService.user.findUnique({

            where: {

                id: userId

            }

        })

        if (user) {

            self = {

                id: user.id,

                username: user.username

            }

        } else {

            self = {

                id: userId,

                username: `Người xem ${Math.floor(Math.random() * 100000)}`

            }

        }

        const channel = await this.prismaService.user.findUnique({

            where: {

                id: channelId

            }

        })

        if (!channel) {

            throw new NotFoundException('Không tìm thấy kênh!')

        }

        const isHost = self.id === channel.id

        const token = new AccessToken(

            this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),

            this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),

            {
                identity: isHost ? `Host-${self.id}` : self.id.toString(),

                name: self.username

            }

        )

        token.addGrant({

            room: channel.id,

            roomJoin: true,

            canPublish: false,

        })

        return {

            token: token.toJwt()

        }

    }

    public async findBySearchTermFilter(searchTerm: string): Promise<any> {

        return {

            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    user: {
                        username: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                },
            ]

        }

    }

    public async findByUserId(user: User): Promise<any> {

        const stream = await this.prismaService.stream.findUnique({

            where: {

                userId: user.id

            }

        })

        return stream

    }

}