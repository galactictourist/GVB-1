import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { uuid } from '~/lib';
import { StorageRepository } from '../repository/storage.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStorageIdValidator implements ValidatorConstraintInterface {
  constructor(private storageRepository: StorageRepository) {}

  async validate(storageId: string, args?: ValidationArguments) {
    return true; // TODO implement
    console.log('storageId', storageId);
    console.log('args', args);
    const userId = uuid(); // TODO args?.object?.context.user.id;

    if (userId && Number.isInteger(storageId)) {
      const storage = await this.storageRepository.countBy({
        id: storageId,
        ownerId: userId,
      }); // Checking if comment belongs to selected user

      if (!storage) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'The storage does not belong to the user';
  }
}

export function IsStorageId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsStorageId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsStorageIdValidator,
    });
  };
}
