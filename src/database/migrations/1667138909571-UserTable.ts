import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1667138909571 implements MigrationInterface {
  name = 'UserTable1667138909571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wallet" character varying(50), "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"."user"`);
  }
}
