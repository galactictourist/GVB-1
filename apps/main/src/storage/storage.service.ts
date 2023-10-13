import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, FindOptionsWhere } from 'typeorm';
import { uuid } from '~/main/lib';
import { cleanUpFilename } from '~/main/lib/file';
import { S3Service } from '~/main/shared/s3.service';
import { StorageEntity } from './entity/storage.entity';
import { StorageRepository } from './repository/storage.repository';
import { StorageLocation } from './types';

@Injectable()
export class StorageService {
  constructor(
    private readonly storageRepository: StorageRepository,
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
  ) {}

  private generatePath(originalname: string, uuidName?: string) {
    const name = uuidName || uuid();
    return (
      name.slice(0, 2) +
      '/' +
      name.slice(2, 4) +
      '/' +
      name +
      '-' +
      cleanUpFilename(originalname).slice(-150)
    );
  }

  async getStorage(where: FindOptionsWhere<StorageEntity>) {
    const storage = await this.storageRepository.findOneByOrFail(where);
    return storage;
  }

  async storePublicReadFile(
    file: Express.Multer.File,
    defaults?: DeepPartial<StorageEntity>,
  ): Promise<StorageEntity> {
    const uuidName = uuid();
    const s3Info = await this.s3Service.uploadPublicRead(
      this.generatePath(file.originalname, uuidName),
      file.buffer,
    );

    const storageEntity: StorageEntity = this.storageRepository.create({
      ...defaults,
      id: uuidName,
      url: s3Info.url,
      path: s3Info.storagePath,
      location: StorageLocation.S3,
      size: file.size,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    await storageEntity.save();
    return storageEntity;
  }

  async storePublicFiles(
    files: Array<Express.Multer.File>,
    defaults?: DeepPartial<StorageEntity>,
  ): Promise<StorageEntity[]> {
    const storageEntities: StorageEntity[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uuidName = uuid();
      const s3Info = await this.s3Service.uploadPublicRead(
        this.generatePath(file.originalname, uuidName),
        file.buffer,
      );

      const storageEntity: StorageEntity = this.storageRepository.create({
        ...defaults,
        id: uuidName,
        url: s3Info.url,
        path: s3Info.storagePath,
        location: StorageLocation.S3,
        size: file.size,
        mimetype: file.mimetype,
        originalname: file.originalname,
      });
      storageEntities.push(storageEntity);
    }

    return await this.dataSource.manager.save(storageEntities);
  }
}
