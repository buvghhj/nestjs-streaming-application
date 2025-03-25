import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

@InputType()
export class DeactivateAccountInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    @Length(6, 6)
    public token?: string

}