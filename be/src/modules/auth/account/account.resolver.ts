import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.models';
import { CreateUserInput } from './inputs/create-user.input';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { ChangeEmailInput } from './inputs/change-email.input';
import type { User } from '@/prisma/generated';
import { ChangePasswordInput } from './inputs/change-password.input';

@Resolver('Account')
export class AccountResolver {

  public constructor(private readonly accountService: AccountService) { }

  //Get current user
  @Authorization()
  @Query(() => UserModel, { name: 'findProfile' })
  public async findAll(@Authorized('id') id: string) {

    return this.accountService.me(id)

  }

  //Create user
  @Mutation(() => Boolean, { name: 'createUser' })
  public async createUser(@Args('data') input: CreateUserInput) {

    return this.accountService.createUser(input)

  }

  //Edit email
  @Authorization()
  @Mutation(() => Boolean, { name: 'changeEmail' })
  public async changeEmail(
    @Authorized() user: User,
    @Args('data') input: ChangeEmailInput
  ) {

    return this.accountService.changeEmail(user, input)

  }

  //Edit password
  @Authorization()
  @Mutation(() => Boolean, { name: 'changePassword' })
  public async changePassword(
    @Authorized() user: User,
    @Args('data') input: ChangePasswordInput
  ) {

    return this.accountService.changePassword(user, input)

  }

}
