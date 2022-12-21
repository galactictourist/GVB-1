import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStorageTable1671591670391 implements MigrationInterface {
  name = 'CreateStorageTable1671591670391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "storage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, "location" character varying(20) NOT NULL DEFAULT 's3', "label" character varying(100), "originalname" character varying(200) NOT NULL, "mimetype" character varying(50), "path" character varying(200) NOT NULL, "url" character varying(250), "size" integer NOT NULL, CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "storage" ADD CONSTRAINT "FK_4aeb602026a5b626544c51eb407" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storage" DROP CONSTRAINT "FK_4aeb602026a5b626544c51eb407"`,
    );
    await queryRunner.query(`DROP TABLE "storage"`);
  }
}
