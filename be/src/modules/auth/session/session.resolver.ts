import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { LoginInput } from './inputs/login.input';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { SessionModel } from './models/session.models';
import { AuthModel } from '../account/models/auth.model';

@Resolver('Session')
export class SessionResolver {

  public constructor(private readonly sessionService: SessionService) { }

  //Hiển thị tất cả thông tin session đang được lưu 
  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  public async findByUser(@Context() { req }: GqlContext) {

    return this.sessionService.findByUser(req)

  }

  //Hiển thị thông tin session hiện tại  được lưu 
  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  public async findCurrent(@Context() { req }: GqlContext) {

    return this.sessionService.findCurrent(req)

  }

  //Đăng nhập
  @Mutation(() => AuthModel, { name: 'loginUser' })
  public async login(
    @Context() { req }: GqlContext,
    @Args('data') input: LoginInput,
    @UserAgent() userAgent: string
  ) {

    return this.sessionService.login(req, input, userAgent)

  }

  //Đăng xuất
  @Authorization()
  @Mutation(() => Boolean, { name: 'logoutUser' })
  public async logout(@Context() { req }: GqlContext) {

    return this.sessionService.logout(req)

  }

  // Xóa cookie session khỏi trình duyệt
  @Mutation(() => Boolean, { name: 'clearSessionCookies' })
  public async clearSession(@Context() { req }: GqlContext) {

    return this.sessionService.clearSession(req)

  }

  //Xóa session trong Redis theo sessionId
  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async remove(@Context() { req }: GqlContext, @Args('sessionId') id: string) {

    return this.sessionService.remove(req, id)

  }

}
