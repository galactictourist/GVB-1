import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlockchainNetwork, getEnabledBlockchainNetworks } from '../blockchain';

@ValidatorConstraint()
@Injectable()
export class IsActiveNetworkConstraint implements ValidatorConstraintInterface {
  validate(network: BlockchainNetwork) {
    return getEnabledBlockchainNetworks()[network] ? true : false;
  }

  defaultMessage(): string {
    return 'The network must be valid and active';
  }
}

export function IsActiveNetwork(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isActiveNetwork',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsActiveNetworkConstraint,
    });
  };
}
