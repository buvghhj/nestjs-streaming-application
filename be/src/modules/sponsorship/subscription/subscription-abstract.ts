import { User } from "@/prisma/generated";

export abstract class SubscriptionAbstract {

    abstract findMySponsors(user: User): Promise<any>

}