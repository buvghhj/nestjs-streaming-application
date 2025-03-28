import { Injectable } from '@nestjs/common';
import { CategoryAbstract } from './category-abstract';

@Injectable()
export class CategoryService {

    public constructor(private readonly categoryAbstract: CategoryAbstract) { }

    //Hiển thị tất cả categories
    public async findAll() {

        return await this.categoryAbstract.findAll()

    }

    //Hiển thị ngẫu nhiên categories
    public async findRandom() {

        return await this.categoryAbstract.findRandom()

    }

    //Hiển thị category theo slug
    public async findBySlug(slug: string) {

        return await this.categoryAbstract.findBySlug(slug)

    }

}
