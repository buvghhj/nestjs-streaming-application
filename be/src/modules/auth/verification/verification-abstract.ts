import { Request } from "express";
import { VerificationInput } from "./inputs/verification.input";
import { User } from "@/prisma/generated";

export abstract class VerificationAbstract {

    abstract verify(req: Request, input: VerificationInput, userAgent: string): Promise<any>

    abstract sendVerifyEmailToken(user: User): Promise<boolean>

}