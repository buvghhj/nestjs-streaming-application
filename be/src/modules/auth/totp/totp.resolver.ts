import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TotpService } from './totp.service';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';
import { TotpModel } from './models/totp.model';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { EnableTotpInput } from './inputs/enable-totp.input';

@Resolver('Totp')
export class TotpResolver {

  public constructor(private readonly totpService: TotpService) { }

  //Tạo mã QR cho TOTP
  @Authorization()
  @Query(() => TotpModel, { name: 'generateTotpSecret' })
  public async generate(@Authorized() user: User) {

    return this.totpService.generate(user)

  }

  //Bật xác thực TOTP
  @Authorization()
  @Mutation(() => Boolean, { name: 'enableTotp' })
  public async enable(
    @Authorized() user: User,
    @Args('data') input: EnableTotpInput
  ) {

    return this.totpService.enable(user, input)

  }

  //Tắt xác thực TOTP
  @Authorization()
  @Mutation(() => Boolean, { name: 'disableTotp' })
  public async disable(@Authorized() user: User) {

    return this.totpService.disable(user)

  }

}
