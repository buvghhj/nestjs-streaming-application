import { Body, Controller, Headers, HttpCode, HttpStatus, Post, RawBody, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {

  public constructor(private readonly webhookService: WebhookService) { }

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookLivekit(
    @Body() body: string,
    @Headers('authorization') authorization: string
  ) {

    // console.log('📩 Webhook received:', body)

    // console.log('🔑 Authorization:', authorization)

    if (!authorization) {

      throw new UnauthorizedException('Unauthorization!')

    }

    return this.webhookService.receiveWebhookLivekit(body, authorization)

  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookStripe(
    @RawBody() rawBody: string,
    @Headers('stripe-signature') sig: string
  ) {

    if (!sig) {

      throw new UnauthorizedException('Unauthorization!')

    }

    const event = this.webhookService.constructorStripeEvent(rawBody, sig)

    await this.webhookService.receiveWebhookStripe(event)

  }
}
