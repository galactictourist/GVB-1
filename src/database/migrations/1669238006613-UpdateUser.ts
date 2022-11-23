import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1669238006613 implements MigrationInterface {
  name = 'UpdateUser1669238006613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user"."user" ADD "countryCode" character varying(2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user"."user" DROP COLUMN "countryCode"`,
    );
  }
}
