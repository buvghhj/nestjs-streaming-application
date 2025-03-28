import { Injectable } from '@nestjs/common';
import { User } from '@/prisma/generated';
import { CreateSponsorshipPlanInput } from './inputs/create-sponsorship-plan.inut';
import { PlanAbstract } from './plan-abstract';

@Injectable()
export class PlanService {

    public constructor(private readonly planAbstract: PlanAbstract) { }

    //Hiển thị các gói hội viên của tôi
    public async findMyPlans(user: User) {

        return await this.planAbstract.findMyPlans(user)

    }

    //Tạo gói hội viên
    public async create(user: User, input: CreateSponsorshipPlanInput) {

        return await this.planAbstract.create(user, input)

    }

    //Xóa gói hôi viên
    public async remove(planId: string) {

        return await this.planAbstract.remove(planId)

    }

}
