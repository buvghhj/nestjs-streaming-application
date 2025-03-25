import { PrismaService } from '@/src/core/prisma/prisma.service';
import * as  Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FilterInput } from './inputs/filter.input';
import type { Prisma, User } from '@/prisma/generated';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { ChangeProfileInfoInput } from '../auth/profile/inputs/change-profile-info.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import { StorageService } from '@/src/libs/storage/storage.service';
import { ObjectCannedACL } from '@aws-sdk/client-s3';

@Injectable()
export class StreamService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService
    ) { }

    //Lọc tìm stream theo từ khóa
    private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {

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

    private async findByUserId(user: User) {

        const stream = await this.prismaService.stream.findUnique({

            where: {

                userId: user.id

            }

        })

        return stream

    }

    //Hiện thị tất cả các streams
    public async findAll(input: FilterInput = {}) {

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

    //Hiển thị ngẫu nhiên các streams
    public async findRandom() {

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

    //Cập nhật thông tin stream
    public async changeInfo(user: User, input: ChangeStreamInfoInput) {

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

    //Cập nhật thumbnail của stream
    public async changeThumbnail(user: User, file: Upload) {

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

    //Xóa thumbnail của stream
    public async removeThumbnail(user: User) {

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

    //Tạo token cấp quyền truy cập vào stream
    public async generateToken(input: GenerateStreamTokenInput) {

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

}
