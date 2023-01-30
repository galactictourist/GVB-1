import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCollectionImage1675044845344 implements MigrationInterface {
  name = 'AddCollectionImage1675044845344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collection" ADD "imageStorageId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_8a3d79c95e237610fee70dfde90" FOREIGN KEY ("imageStorageId") REFERENCES "storage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_8a3d79c95e237610fee70dfde90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" DROP COLUMN "imageStorageId"`,
    );
  }
}
