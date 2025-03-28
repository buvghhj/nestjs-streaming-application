import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/prisma/generated';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { DeactivateAbstract } from './deactivate-abstract';

@Injectable()
export class DeactivateService {

    public constructor(private readonly deactivateAbstract: DeactivateAbstract) { }

    //Vô hiệu hóa tài khoản
    public async deactivate(req: Request, input: DeactivateAccountInput, user: User, userAgent: string) {

        return this.deactivateAbstract.deactivate(req, input, user, userAgent)

    }

}
