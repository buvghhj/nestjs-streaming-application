import { Request } from "express";
import { ResetPasswordInput } from "./inputs/reset-password.input";
import { NewPasswordInput } from "./inputs/new-password.input";

export abstract class PasswordRecoveryAbstract {

    abstract resetPassword(req: Request, input: ResetPasswordInput, userAgent: string): Promise<boolean>

    abstract newPassword(input: NewPasswordInput): Promise<boolean>

}