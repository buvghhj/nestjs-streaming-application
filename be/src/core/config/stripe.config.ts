import { TypeStripeOptions } from "@/src/modules/libs/stripe/types/stripe.type";
import { ConfigService } from "@nestjs/config";

export const getStripeConfig = (configService: ConfigService): TypeStripeOptions => {

    return {

        apiSecretKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),

        config: {

            apiVersion: '2025-02-24.acacia'

        }

    }

}