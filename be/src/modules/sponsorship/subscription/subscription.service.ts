import { User } from '@/prisma/generated';
import { Injectable } from '@nestjs/common';
import { SubscriptionAbstract } from './subscription-abstract';

@Injectable()
export class SubscriptionService {

    public constructor(private readonly subscriptionAbstract: SubscriptionAbstract) { }

    //Hiển thị những hội viên của tôi
    public async findMySponsors(user: User) {

        return await this.subscriptionAbstract.findMySponsors(user)

    }

}
