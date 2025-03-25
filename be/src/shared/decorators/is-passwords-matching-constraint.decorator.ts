import { NewPasswordInput } from "@/src/modules/auth/password-recovery/inputs/new-password.input";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {

    public validate(confirmPassword: string, args: ValidationArguments) {

        const object = args.object as NewPasswordInput

        return object.password === confirmPassword

    }

    public defaultMessage(validationArguments?: ValidationArguments) {

        return 'Mật khẩu xác nhận không chính xác!'

    }

}