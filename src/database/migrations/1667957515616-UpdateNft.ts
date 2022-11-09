import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNft1667957515616 implements MigrationInterface {
  name = 'UpdateNft1667957515616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_941622072386aeece5112fe0db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ALTER COLUMN "collectionId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_941622072386aeece5112fe0db2" FOREIGN KEY ("collectionId") REFERENCES "nft"."collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_941622072386aeece5112fe0db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ALTER COLUMN "collectionId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_941622072386aeece5112fe0db2" FOREIGN KEY ("collectionId") REFERENCES "nft"."collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
