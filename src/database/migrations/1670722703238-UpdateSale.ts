import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSale1670722703238 implements MigrationInterface {
  name = 'UpdateSale1670722703238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" ADD "requestId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sale" ADD "expiredAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "expiredAt"`);
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "requestId"`);
  }
}
