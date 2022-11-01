import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUniqueIndex1667138932962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_uq" ON "user"."user" (lower(wallet))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "user"."user_uq"`);
  }
}
