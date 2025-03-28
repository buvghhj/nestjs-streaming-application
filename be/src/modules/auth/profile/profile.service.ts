import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as  Upload from 'graphql-upload/Upload.js'
import { User } from '@/prisma/generated';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { ProfileAbstract } from './profile-abstract';

@Injectable()
export class ProfileService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly profileAbstract: ProfileAbstract
    ) { }

    //Cập nhật ảnh đại diện
    public async changeAvatar(user: User, file: Upload) {

        return await this.profileAbstract.changeAvatar(user, file)

    }

    //Xóa ảnh đại diện
    public async removeAvatar(user: User) {

        return await this.profileAbstract.removeAvatar(user)

    }

    //Cập nhật thông tin cá nhân
    public async changeInfo(user: User, input: ChangeProfileInfoInput) {

        return await this.changeInfo(user, input)

    }

    //Tạo social link
    public async createSocialLink(user: User, input: SocialLinkInput) {

        return await this.profileAbstract.createSocialLink(user, input)

    }

    //Hiển thị tất cả social link
    public async findSocialLink(user: User) {

        return await this.profileAbstract.findSocialLink(user)

    }

    //Sắp xếp lại social link
    public async reorderSocialLinks(list: SocialLinkOrderInput[]) {

        return await this.profileAbstract.reorderSocialLinks(list)

    }

    //Sửa thông tin social link
    public async updateSocialLink(id: string, input: SocialLinkInput) {

        return await this.profileAbstract.updateSocialLink(id, input)

    }

    //Xóa social link
    public async removeSocialLink(id: string) {

        return await this.profileAbstract.removeSocialLink(id)

    }

}
