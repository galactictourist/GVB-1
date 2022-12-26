import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseElement } from '~/main/lib/database/base-element';
import { UserEntity } from '../../user/entity/user.entity';
import { StorageLabel, StorageLocation } from '../types';

@Entity({ name: 'storage' })
@Index('storage_ownerId_label_idx', ['ownerId', 'label'])
export class StorageEntity extends BaseElement {
  @Column('uuid', { nullable: true })
  ownerId: string | null;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  owner: UserEntity | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: StorageLocation.S3,
  })
  location: StorageLocation;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  label: StorageLabel;

  @Column({
    length: 200,
  })
  originalname: string;

  @Column({
    length: 50,
    nullable: true,
  })
  mimetype?: string;

  @Column({
    length: 200,
  })
  path: string;

  @Column({
    length: 250,
    nullable: true,
  })
  url?: string;

  @Column('int')
  size: number;
}
