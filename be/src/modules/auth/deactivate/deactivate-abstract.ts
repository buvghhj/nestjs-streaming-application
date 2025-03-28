import { Request } from "express";
import { DeactivateAccountInput } from "./inputs/deactivate-account.input";
import { User } from "@/prisma/generated";

export abstract class DeactivateAbstract {

    abstract deactivate(req: Request, input: DeactivateAccountInput, user: User, userAgent: string): Promise<{}>

    abstract validateDeactivateToken(req: Request, token: string): Promise<any>

    abstract sendDeactivateToken(req: Request, user: User, userAgent: string): Promise<boolean>

    abstract clearSession(userId: string): Promise<any>

}