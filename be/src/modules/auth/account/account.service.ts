import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { User } from '@/prisma/generated';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';
import { AccountServiceAbstract } from './account-abstract';

@Injectable()
export class AccountService {

  public constructor(private readonly accountAbstract: AccountServiceAbstract) { }

  //Get current user
  public async me(id: string) {

    return this.accountAbstract.me(id)

  }

  //Create user
  public async createUser(input: CreateUserInput) {

    return await this.accountAbstract.createUser(input)

  }

  //Edit email
  public async changeEmail(user: User, input: ChangeEmailInput) {

    return await this.accountAbstract.changeEmail(user, input)

  }

  //Edit password
  public async changePassword(user: User, input: ChangePasswordInput) {

    return await this.accountAbstract.changePassword(user, input)

  }

}
