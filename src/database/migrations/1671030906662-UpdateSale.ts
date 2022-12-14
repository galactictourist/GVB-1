import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSale1671030906662 implements MigrationInterface {
  name = 'UpdateSale1671030906662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "hash" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "UQ_93dc77736f3be60994ae48d9e44" UNIQUE ("hash")`,
    );
    await queryRunner.query(`ALTER TABLE "sale" ADD "signedData" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "signature" character varying(200)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "signature"`);
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "signedData"`);
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "UQ_93dc77736f3be60994ae48d9e44"`,
    );
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "hash"`);
  }
}
