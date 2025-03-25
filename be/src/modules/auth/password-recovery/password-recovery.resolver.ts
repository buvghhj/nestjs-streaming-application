import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PasswordRecoveryService } from './password-recovery.service';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { NewPasswordInput } from './inputs/new-password.input';

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {

  public constructor(private readonly passwordRecoveryService: PasswordRecoveryService) { }

  //Lấy lại - cài lại mật khẩu
  @Mutation(() => Boolean, { name: 'resetPassword' })
  public async resetPassword(
    @Context() { req }: GqlContext,
    @Args('data') input: ResetPasswordInput,
    @UserAgent() userAgent: string
  ) {

    return this.passwordRecoveryService.resetPassword(req, input, userAgent)

  }

  //Đặt mật khẩu mới
  @Mutation(() => Boolean, { name: 'newPassword' })
  public async newPassword(@Args('data') input: NewPasswordInput) {

    return this.passwordRecoveryService.newPassword(input)

  }

}
