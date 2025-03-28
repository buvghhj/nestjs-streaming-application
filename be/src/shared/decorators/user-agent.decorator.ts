import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

//Lấy dữ liệu của client từ req (browser, os, thiết bị,...)
export const UserAgent = createParamDecorator(

    (data: unknown, ctx: ExecutionContext) => {

        if (ctx.getType() === 'http') {

            const request = ctx.switchToHttp().getRequest() as Request

            return request.headers['user-agent']

        } else {

            const context = GqlExecutionContext.create(ctx)

            return context.getContext().req.headers['user-agent']

        }

    }

)