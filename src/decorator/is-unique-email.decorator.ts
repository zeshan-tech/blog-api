import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions } from 'class-validator';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';

@Injectable()
@ValidatorConstraint({ name: 'uniqueEmail', async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validate(email: string): Promise<boolean> {
    const emailExist = await this.userModel.findOne({ email });
    return !emailExist;
  }

  defaultMessage(): string {
    return `Email already exists`;
  }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueEmailConstraint,
    });
  };
}
