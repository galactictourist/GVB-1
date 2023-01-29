import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderUniqueIndex1674647511050 implements MigrationInterface {
  name = 'UpdateOrderUniqueIndex1674647511050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "order_uq"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "orderIndex" integer`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "order_uq" ON "order" ("network", lower("txId"), "orderIndex")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "order_uq"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderIndex"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "order_uq" ON "order" ("network", lower("txId"))`,
    );
  }
}
