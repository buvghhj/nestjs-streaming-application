import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis {

  public constructor(private readonly confiService: ConfigService) {

    super(confiService.getOrThrow<string>('REDIS_URI'))

  }

}
