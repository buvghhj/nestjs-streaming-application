import { Module } from "@nestjs/common";
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { IS_DEV_ENV } from "../shared/utils/is-dev.util";
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from "@nestjs/apollo"
import { getGraphQLConfig } from "./config/graphql.config";
import { RedisModule } from './redis/redis.module';
import { AccountModule } from "../modules/auth/account/account.module";
import { SessionModule } from "../modules/auth/session/session.module";
import { VerificationModule } from "../modules/auth/verification/verification.module";
import { PasswordRecoveryModule } from "../modules/auth/password-recovery/password-recovery.module";
import { TotpModule } from "../modules/auth/totp/totp.module";
import { DeactivateModule } from "../modules/auth/deactivate/deactivate.module";
import { CronModule } from "../modules/cron/cron.module";
import { ProfileModule } from "../modules/auth/profile/profile.module";
import { StreamModule } from "../modules/stream/stream.module";
import { getLiveKitConfig } from "./config/livekit.config";
import { IngressModule } from "../modules/stream/ingress/ingress.module";
import { WebhookModule } from "../modules/webhook/webhook.module";
import { CategoryModule } from "../modules/category/category.module";
import { ChatModule } from "../modules/chat/chat.module";
import { FollowModule } from "../modules/follow/follow.module";
import { ChannelModule } from "../modules/channel/channel.module";
import { NotificationModule } from "../modules/notification/notification.module";
import { getStripeConfig } from "./config/stripe.config";
import { PlanModule } from "../modules/sponsorship/plan/plan.module";
import { SubscriptionModule } from "../modules/sponsorship/subscription/subscription.module";
import { TransactionModule } from "../modules/sponsorship/transaction/transaction.module";
import { LivekitModule } from "../libs/livekit/livekit.module";
import { StripeModule } from "../libs/stripe/stripe.module";
import { MailModule } from "../libs/mail/mail.module";
import { StorageModule } from "../libs/storage/storage.module";
import { TelegramModule } from "../libs/telegram/telegram.module";

@Module({

    imports: [

        ConfigModule.forRoot({

            ignoreEnvFile: !IS_DEV_ENV,

            isGlobal: true

        }),

        GraphQLModule.forRootAsync({

            driver: ApolloDriver,

            imports: [ConfigModule],

            useFactory: getGraphQLConfig,

            inject: [ConfigService]

        }),

        LivekitModule.registerAsync({

            imports: [ConfigModule],

            useFactory: getLiveKitConfig,

            inject: [ConfigService]

        }),

        StripeModule.registerAsync({

            imports: [ConfigModule],

            useFactory: getStripeConfig,

            inject: [ConfigService]

        }),

        PrismaModule,

        RedisModule,

        MailModule,

        StorageModule,

        TelegramModule,

        LivekitModule,

        StripeModule,

        CronModule,

        AccountModule,

        SessionModule,

        ProfileModule,

        VerificationModule,

        PasswordRecoveryModule,

        TotpModule,

        DeactivateModule,

        StreamModule,

        IngressModule,

        WebhookModule,

        CategoryModule,

        ChatModule,

        FollowModule,

        ChannelModule,

        NotificationModule,

        PlanModule,

        SubscriptionModule,

        TransactionModule

    ]

})
export class CoreModule { }