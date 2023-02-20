import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { StorageRepository } from '../repository/storage.repository';
import { StorageLabel } from '../types';

interface IsStorageIdOptions {
  label?: StorageLabel;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStorageIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly storageRepository: StorageRepository) {}

  async validate(storageId: string, validationArguments: ValidationArguments) {
    console.log('validationArguments', validationArguments);
    const options = validationArguments.constraints[0] as IsStorageIdOptions;
    const count = await this.storageRepository.countBy({
      id: storageId,
      label: options.label,
    });
    return count > 0;
  }

  defaultMessage(): string {
    return 'The storage ID is invalid';
  }
}

export function IsStorageId(
  options?: IsStorageIdOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStorageId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsStorageIdValidator,
    });
  };
}
