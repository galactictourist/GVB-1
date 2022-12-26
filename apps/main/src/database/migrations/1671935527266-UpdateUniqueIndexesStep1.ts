import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUniqueIndexesStep11671935527266
  implements MigrationInterface
{
  name = 'UpdateUniqueIndexesStep11671935527266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "sale_uq"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "order_uq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "order_uq" UNIQUE ("network", "txId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "sale_uq" UNIQUE ("network", "hash")`,
    );
  }
}
