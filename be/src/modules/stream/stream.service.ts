import * as  Upload from 'graphql-upload/Upload.js'
import { Injectable } from '@nestjs/common';
import { FilterInput } from './inputs/filter.input';
import type { User } from '@/prisma/generated';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { StreamAbstract } from './stream-abstract';

@Injectable()
export class StreamService {

    public constructor(private readonly streamAbstract: StreamAbstract) { }

    //Hiện thị tất cả các streams
    public async findAll(input: FilterInput = {}) {

        return await this.streamAbstract.findAll(input)

    }

    //Hiển thị ngẫu nhiên các streams
    public async findRandom() {

        return await this.streamAbstract.findRandom()

    }

    //Cập nhật thông tin stream
    public async changeInfo(user: User, input: ChangeStreamInfoInput) {

        return await this.streamAbstract.changeInfo(user, input)

    }

    //Cập nhật thumbnail của stream
    public async changeThumbnail(user: User, file: Upload) {

        return await this.streamAbstract.changeThumbnail(user, file)

    }

    //Xóa thumbnail của stream
    public async removeThumbnail(user: User) {

        return await this.streamAbstract.removeThumbnail(user)

    }

    //Tạo token cấp quyền truy cập vào stream
    public async generateToken(input: GenerateStreamTokenInput) {

        return await this.streamAbstract.generateToken(input)

    }

}
