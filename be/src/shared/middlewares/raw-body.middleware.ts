import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as  getRawBody from 'raw-body'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {

    public use(req: Request, res: Response, next: NextFunction) {

        if (!req.readable) {

            return next(new BadRequestException('Dữ liệu không hợp lệ từ yêu cầu!'))

        }

        getRawBody(req, { encoding: 'utf-8' }).then(rawBody => {

            req.body = rawBody

            next()

        }).catch(error => {

            throw new BadRequestException('Lỗi', error)

            next(error)

        })

    }

}