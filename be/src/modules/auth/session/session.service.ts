import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/src/core/redis/redis.service';
import { VerificationService } from '../verification/verification.service';
import { SessionAbstract } from './session-abstract';

@Injectable()
export class SessionService {

    public constructor(
        private readonly sessionAbstract: SessionAbstract,
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly verificationService: VerificationService
    ) { }

    //Hiển thị tất cả thông tin session được lưu ở đâu
    public async findByUser(req: Request) {

        return await this.sessionAbstract.findByUser(req)

    }

    //Hiển thị thông tin session hiện tại  được lưu 
    public async findCurrent(req: Request) {

        return await this.sessionAbstract.findCurrent(req)

    }

    //Đăng nhập
    public async login(req: Request, input: LoginInput, userAgent: string) {

        return await this.sessionAbstract.login(req, input, userAgent)

    }

    //Đăng xuất
    public async logout(req: Request) {

        return await this.sessionAbstract.logout(req)
    }

    // Xóa cookie session khỏi trình duyệt
    public async clearSession(req: Request) {

        return this.sessionAbstract.clearSession(req)

    }

    // Xóa session trong Redis
    public async remove(req: Request, id: string) {

        return this.sessionAbstract.remove(req, id)

    }

}
