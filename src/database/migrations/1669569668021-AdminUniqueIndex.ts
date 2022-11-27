import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminUniqueIndex1669569668021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "admin_username_uq" ON "admin" (lower(username))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "admin_username_uq"`);
  }
}
