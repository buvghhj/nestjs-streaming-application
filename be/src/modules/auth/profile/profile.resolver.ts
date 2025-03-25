import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import * as  Upload from 'graphql-upload/Upload.js'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { SocialLinkModel } from './models/social-link.model';

@Resolver('Profile')
export class ProfileResolver {

  public constructor(private readonly profileService: ProfileService) { }

  //Cập nhật ảnh đại diện
  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileAvatar' })
  public async changeAvatar(
    @Authorized() user: User,
    @Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe) avatar: Upload
  ) {

    return this.profileService.changeAvatar(user, avatar)

  }

  //Xóa ảnh đại diện
  @Authorization()
  @Mutation(() => Boolean, { name: 'removeProfileAvatar' })
  public async removeProfileAvatar(@Authorized() user: User) {

    return this.profileService.removeAvatar(user)

  }

  //Cập nhật thông tin các nhân
  @Authorization()
  @Mutation(() => Boolean, { name: 'changeInfoProfile' })
  public async changeInfo(
    @Authorized() user: User,
    @Args('data') input: ChangeProfileInfoInput
  ) {

    return this.profileService.changeInfo(user, input)

  }

  //Tạo social link
  @Authorization()
  @Mutation(() => Boolean, { name: 'createSocialLink' })
  public async createSocialLink(
    @Authorized() user: User,
    @Args('data') input: SocialLinkInput
  ) {

    return this.profileService.createSocialLink(user, input)

  }

  //Hiển thị tất cả social link
  @Authorization()
  @Query(() => [SocialLinkModel], { name: 'findSocialLink' })
  public async findSocialLink(@Authorized() user: User) {

    return this.profileService.findSocialLink(user)

  }

  //Sắp xếp lại social link
  @Authorization()
  @Mutation(() => Boolean, { name: 'reorderSocialLink' })
  public async reorderSocialLink(
    @Args('list', { type: () => [SocialLinkOrderInput] }) list: SocialLinkOrderInput[]
  ) {

    return this.profileService.reorderSocialLinks(list)

  }

  //Sửa thông tin social link
  @Authorization()
  @Mutation(() => Boolean, { name: 'updateSocialLink' })
  public async updateSocialLink(
    @Args('id') id: string,
    @Args('data') input: SocialLinkInput
  ) {

    return this.profileService.updateSocialLink(id, input)

  }

  //Xóa social link
  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSocialLink' })
  public async removeSocialLink(@Args('id') id: string) {

    return this.profileService.removeSocialLink(id)

  }

}
