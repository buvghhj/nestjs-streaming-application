import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { PrismaCategory } from './orm/category-prisma';
import { CategoryAbstract } from './category-abstract';

@Module({

  providers: [

    CategoryService,

    CategoryResolver,

    PrismaCategory,

    {

      provide: CategoryAbstract,

      useClass: PrismaCategory

    }

  ],

})
export class CategoryModule { }
