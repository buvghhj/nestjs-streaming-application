import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import * as  Upload from 'graphql-upload/Upload.js'
import * as sharp from 'sharp'
import { User } from '@/prisma/generated';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { StorageService } from '@/src/libs/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { ObjectCannedACL } from '@aws-sdk/client-s3';

@Injectable()
export class ProfileService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService,
    ) { }

    //Cập nhật ảnh đại diện
    public async changeAvatar(user: User, file: Upload) {

        if (user.avatar) {

            await this.storageService.remove(user.avatar)

        }

        const chunks: Buffer[] = []

        for await (const chunk of file.createReadStream()) {

            chunks.push(chunk)

        }

        const buffer = Buffer.concat(chunks)

        const fileName = `channels/${user.username}.webp`

        const bucketName = this.configService.getOrThrow<string>('S3_AWS_BUCKET_NAME')

        const region = this.configService.getOrThrow<string>('S3_AWS_REGION')

        let processedBuffer: Buffer

        if (file.filename && file.filename.endsWith('.gif')) {

            processedBuffer = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer()

        } else {

            processedBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer()

        }

        await this.storageService.upload(processedBuffer, fileName, "image/webp", ObjectCannedACL.public_read)

        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`

        await this.prismaService.user.update({

            where: {

                id: user.id

            },
            data: {

                avatar: fileUrl

            }

        })

        return true

    }

    //Xóa ảnh đại diện
    public async removeAvatar(user: User) {

        if (!user.avatar) {

            return

        }

        await this.storageService.remove(user.avatar)

        await this.prismaService.user.update({

            where: {

                id: user.id

            },
            data: {

                avatar: null

            }

        })

        return true

    }

    //Cập nhật thông tin cá nhân
    public async changeInfo(user: User, input: ChangeProfileInfoInput) {

        const { username, displayName, bio } = input

        const usernameExists = await this.prismaService.user.findUnique({

            where: {

                username

            }

        })

        if (usernameExists && username !== user.username) {

            throw new ConflictException('Tên đăng nhập đã tồn tại!')

        }

        await this.prismaService.user.update({

            where: {

                id: user.id

            },
            data: {

                username,

                displayName,

                bio

            }

        })

        return true

    }

    //Tạo social link
    public async createSocialLink(user: User, input: SocialLinkInput) {

        const { title, url } = input

        const lastSocialLink = await this.prismaService.socialLink.findFirst({

            where: {

                userId: user.id

            },
            orderBy: {

                position: 'desc'

            }

        })

        const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

        await this.prismaService.socialLink.create({

            data: {

                title,

                url,

                position: newPosition,

                user: {

                    connect: {

                        id: user.id

                    }

                }

            }

        })

        return true

    }

    //Hiển thị tất cả social link
    public async findSocialLink(user: User) {

        const socialLinks = await this.prismaService.socialLink.findMany({

            where: {

                userId: user.id

            },
            orderBy: {

                position: 'asc'

            }

        })

        return socialLinks

    }

    //Sắp xếp lại social link
    public async reorderSocialLinks(list: SocialLinkOrderInput[]) {

        if (!list.length) {

            return

        }

        const updatePromises = list.map(socialLink => {

            return this.prismaService.socialLink.update({

                where: {

                    id: socialLink.id

                },
                data: {

                    position: socialLink.position

                }

            })

        })

        await Promise.all(updatePromises)

        return true

    }

    //Sửa thông tin social link
    public async updateSocialLink(id: string, input: SocialLinkInput) {

        const { title, url } = input

        await this.prismaService.socialLink.update({

            where: {

                id

            },
            data: {

                title,

                url

            }

        })

        return true

    }

    //Xóa social link
    public async removeSocialLink(id: string) {

        await this.prismaService.socialLink.delete({

            where: {

                id

            }

        })

        return true

    }

}
