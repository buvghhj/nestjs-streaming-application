import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { PrismaProfile } from './orm/profile-prisma';
import { ProfileAbstract } from './profile-abstract';

@Module({

  providers: [

    ProfileResolver,

    ProfileService,

    PrismaProfile,

    {

      provide: ProfileAbstract,

      useClass: PrismaProfile

    }

  ],

})
export class ProfileModule { }
