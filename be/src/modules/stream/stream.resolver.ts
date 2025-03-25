import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import * as  Upload from 'graphql-upload/Upload.js'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { StreamModel } from './models/stream.model';
import { FilterInput } from './inputs/filter.input';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { User } from '@/prisma/generated';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import { Authorization } from '@/src/shared/decorators/authorization.decorator';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { GenerateStreamTokenModel } from './models/generate-stream-token.model';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';

@Resolver('Stream')
export class StreamResolver {

  public constructor(private readonly streamService: StreamService) { }

  //Hiện thị tất cả các streams
  @Query(() => [StreamModel], { name: "findAllStreams" })
  public async findAll(@Args('filters') input: FilterInput) {

    return this.streamService.findAll(input)

  }

  //Hiển thị ngẫu nhiên các streams
  @Query(() => [StreamModel], { name: "findRandomStream" })
  public async findRandom() {

    return this.streamService.findRandom()

  }

  //Cập nhật thông tin stream
  @Authorization()
  @Mutation(() => Boolean, { name: "changeStreamInfo" })
  public async changStreamInfo(
    @Authorized() user: User,
    @Args('data') input: ChangeStreamInfoInput
  ) {

    return this.streamService.changeInfo(user, input)

  }

  //Cập nhật thumbnail của stream
  @Authorization()
  @Mutation(() => Boolean, { name: "changeThumbnail" })
  public async changeThumbnail(
    @Authorized() user: User,
    @Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe) thumbnail: Upload
  ) {

    return this.streamService.changeThumbnail(user, thumbnail)

  }

  //Xóa thumbnail của stream
  @Authorization()
  @Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
  public async removeThumbnail(@Authorized() user: User) {

    return this.streamService.removeThumbnail(user)

  }

  //Tạo token cấp quyền truy cập vào stream
  @Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
  public async generateToken(@Args('data') input: GenerateStreamTokenInput) {

    return this.streamService.generateToken(input)

  }

}
