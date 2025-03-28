import { TypeLiveKitOption } from "@/src/modules/libs/livekit/types/livekit.type";
import { ConfigService } from "@nestjs/config";

export const getLiveKitConfig = (configService: ConfigService): TypeLiveKitOption => {

    return {

        apiUrl: configService.getOrThrow<string>('LIVEKIT_API_URL'),

        apiKey: configService.getOrThrow<string>('LIVEKIT_API_KEY'),

        apiSecret: configService.getOrThrow<string>('LIVEKIT_API_SECRET')

    }

}