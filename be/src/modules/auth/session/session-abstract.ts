import { Request } from "express";
import { LoginInput } from "./inputs/login.input";

export abstract class SessionAbstract {

    abstract findByUser(req: Request): Promise<any>

    abstract findCurrent(req: Request): Promise<any>

    abstract login(req: Request, input: LoginInput, userAgent: string): Promise<{}>

    abstract logout(req: Request): Promise<any>

    abstract clearSession(req: Request): Promise<boolean>

    abstract remove(req: Request, id: string): Promise<boolean>

}