import { User } from "@/prisma/generated";
import { EnableTotpInput } from "./inputs/enable-totp.input";

export abstract class TotpAbstract {

    abstract generate(user: User): Promise<{}>

    abstract enable(user: User, input: EnableTotpInput): Promise<boolean>

    abstract disable(user: User): Promise<boolean>

}