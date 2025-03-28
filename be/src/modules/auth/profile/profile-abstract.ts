import { User } from "@/prisma/generated";
import * as  Upload from 'graphql-upload/Upload.js'
import { ChangeProfileInfoInput } from "./inputs/change-profile-info.input";
import { SocialLinkInput, SocialLinkOrderInput } from "./inputs/social-link.input";

export abstract class ProfileAbstract {

    abstract changeAvatar(user: User, file: Upload): Promise<boolean>

    abstract removeAvatar(user: User): Promise<boolean>

    abstract changeInfo(user: User, input: ChangeProfileInfoInput): Promise<boolean>

    abstract createSocialLink(user: User, input: SocialLinkInput): Promise<boolean>

    abstract findSocialLink(user: User): Promise<{}>

    abstract reorderSocialLinks(list: SocialLinkOrderInput[]): Promise<boolean>

    abstract updateSocialLink(id: string, input: SocialLinkInput): Promise<boolean>

    abstract removeSocialLink(id: string): Promise<boolean>

}