import { MigrationInterface, QueryRunner } from 'typeorm';

export class Admin1669569668020 implements MigrationInterface {
  name = 'Admin1669569668020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(50) NOT NULL, "password" character varying(200) NOT NULL, "role" character varying(20) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin"`);
  }
}
