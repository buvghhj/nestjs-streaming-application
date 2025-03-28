import { User } from "@/prisma/generated";
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input";
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input";
import { FilterInput } from "./inputs/filter.input";
import * as  Upload from 'graphql-upload/Upload.js'

export abstract class StreamAbstract {

    abstract findBySearchTermFilter(searchTerm: string): Promise<any>

    abstract findByUserId(user: User): Promise<any>

    abstract findAll(input: FilterInput): Promise<any>

    abstract findRandom(): Promise<any>

    abstract changeInfo(user: User, input: ChangeStreamInfoInput): Promise<any>

    abstract changeThumbnail(user: User, file: Upload): Promise<any>

    abstract removeThumbnail(user: User): Promise<any>

    abstract generateToken(input: GenerateStreamTokenInput): Promise<any>

}