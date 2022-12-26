import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { StorageRepository } from '../repository/storage.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStorageIdValidator implements ValidatorConstraintInterface {
  constructor(private storageRepository: StorageRepository) {}

  async validate(storageId: string) {
    const count = await this.storageRepository.countBy({ id: storageId });
    return count > 0;
  }

  defaultMessage(): string {
    return 'The storage ID is invalid';
  }
}

export function IsStorageId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStorageId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsStorageIdValidator,
    });
  };
}
