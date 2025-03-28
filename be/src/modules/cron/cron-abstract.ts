import { User } from "@/prisma/generated";

export abstract class CronAbstract {

    abstract deletedDeactivateAccount(user: User): Promise<any>

    abstract notifyUserEnableTwoFactor(): Promise<any>

    abstract verifyChannel(): Promise<any>

    abstract deleteNotification(): Promise<any>

}