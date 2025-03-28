import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamResolver } from './stream.resolver';
import { IngressModule } from './ingress/ingress.module';
import { PrismaStream } from './orm/stream-primsa';
import { StreamAbstract } from './stream-abstract';

@Module({

  providers: [

    StreamResolver,

    StreamService,

    PrismaStream,

    {

      provide: StreamAbstract,

      useClass: PrismaStream

    }

  ],

  imports: [

    IngressModule

  ],

})
export class StreamModule { }
