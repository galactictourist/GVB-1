import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import eip55 from 'eip55';

@ValidatorConstraint()
export class IsEip55AddressValidator implements ValidatorConstraintInterface {
  validate(address: string) {
    return address ? eip55.verify(address.toLowerCase(), true) : false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} must be a valid EIP55 address`;
  }
}

export function IsEip55Address(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEip55Address',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEip55AddressValidator,
    });
  };
}
