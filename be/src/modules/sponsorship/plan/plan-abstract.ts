import { User } from "@/prisma/generated";
import { CreateSponsorshipPlanInput } from "./inputs/create-sponsorship-plan.inut";

export abstract class PlanAbstract {

    abstract findMyPlans(user: User): Promise<any>

    abstract create(user: User, input: CreateSponsorshipPlanInput): Promise<any>

    abstract remove(planId: string): Promise<any>

}