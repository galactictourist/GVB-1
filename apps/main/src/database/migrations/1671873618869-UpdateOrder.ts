import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrder1671873618869 implements MigrationInterface {
  name = 'UpdateOrder1671873618869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PLACED'`,
    );
  }
}
