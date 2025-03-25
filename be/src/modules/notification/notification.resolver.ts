import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';
import { NotificationModel } from './models/notifications.model';
import { ChangeNotificationSettingsResponse } from './models/notification-settings.model';
import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';

@Resolver('Notification')
export class NotificationResolver {

  public constructor(private readonly notificationService: NotificationService) { }

  //Hiển thị số lượng thông báo(chưa đọc)
  @Authorization()
  @Query(() => Number, { name: "findUnReadCountNotification" })
  public async findUnReadCountNotification(@Authorized() user: User) {

    return this.notificationService.findUnReadCount(user)

  }

  //Hiển thị thông báo (đánh dấu đã đọc)
  @Authorization()
  @Query(() => [NotificationModel], { name: "findNotificationsByUser" })
  public async findNotificationsByUser(@Authorized() user: User) {

    return this.notificationService.findByUser(user)

  }

  //Tùy chỉnh cài đặt thông báo (bật,tắt thông báo trên website hoặc telegram)
  @Authorization()
  @Mutation(() => ChangeNotificationSettingsResponse, { name: "changeNotificationSettings" })
  public async changeNotificationSettings(
    @Authorized() user: User,
    @Args('data') input: ChangeNotificationSettingsInput
  ) {

    return this.notificationService.changeSettings(user, input)

  }

}
