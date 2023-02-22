import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTopic1676926398417 implements MigrationInterface {
  name = 'UpdateTopic1676926398417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" ADD "imageStorageId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD "imageUrl" character varying(200)`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_a3f2a8979ead719eedc69848f55" FOREIGN KEY ("imageStorageId") REFERENCES "storage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_a3f2a8979ead719eedc69848f55"`,
    );
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "imageUrl"`);
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "imageStorageId"`);
  }
}
