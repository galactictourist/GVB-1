import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUniqueIndexesStep21671935545808
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "sale_uq" ON "sale" ("network", lower("hash"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "order_uq" ON "order" ("network", lower("txId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "order_uq"`);
    await queryRunner.query(`DROP INDEX "sale_uq"`);
  }
}
