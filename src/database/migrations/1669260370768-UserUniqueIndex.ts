import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUniqueIndex1669260370768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_wallet_uq" ON "user" (lower(wallet))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "user_wallet_uq"`);
  }
}
