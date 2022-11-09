import { MigrationInterface, QueryRunner } from 'typeorm';

export class Charity1667643395002 implements MigrationInterface {
  name = 'Charity1667643395002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "charity"."topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentId" uuid, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "charity"."charity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fbdd8ba5b5a6504618b8b1ab295" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ADD CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d" FOREIGN KEY ("parentId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" DROP CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d"`,
    );
    await queryRunner.query(`DROP TABLE "charity"."charity"`);
    await queryRunner.query(`DROP TABLE "charity"."topic"`);
  }
}
