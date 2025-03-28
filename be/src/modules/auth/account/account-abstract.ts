import { User } from "@/prisma/generated";
import { CreateUserInput } from "./inputs/create-user.input";
import { ChangeEmailInput } from "./inputs/change-email.input";
import { ChangePasswordInput } from "./inputs/change-password.input";

export abstract class AccountServiceAbstract {

    abstract me(id: string): Promise<User | null>

    abstract createUser(input: CreateUserInput): Promise<boolean>

    abstract changeEmail(user: User, input: ChangeEmailInput): Promise<boolean>

    abstract changePassword(user: User, input: ChangePasswordInput): Promise<boolean>

}
