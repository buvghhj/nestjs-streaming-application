import { User } from "@/prisma/generated"
import { Request } from "express"
import { SessionMetadata } from "../types/session-metadata.types"
import { InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export const saveSession = (req: Request, user: User, metadata: SessionMetadata) => {

    return new Promise((resolve, reject) => {

        req.session.createdAt = new Date()

        req.session.userId = user.id

        req.session.metadata = metadata

        req.session.save(err => {

            if (err) {


                return reject(new InternalServerErrorException('Session không được lưu!'))

            }

            resolve(user)

        })

    })

}

export const destroySession = (req: Request, configService: ConfigService) => {

    return new Promise((resolve, reject) => {

        req.session.destroy(err => {

            if (err) {

                return reject(new InternalServerErrorException('Không thể kết thúc session!'))

            }

            req.res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))

            resolve(true)

        })

    })

}