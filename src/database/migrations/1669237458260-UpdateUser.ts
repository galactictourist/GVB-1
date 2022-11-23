import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1669237458260 implements MigrationInterface {
  name = 'UpdateUser1669237458260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user"."user" ADD "name" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"."user" DROP COLUMN "name"`);
  }
}
