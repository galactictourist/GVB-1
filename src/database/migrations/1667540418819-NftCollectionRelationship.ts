import { MigrationInterface, QueryRunner } from 'typeorm';

export class NftCollectionRelationship1667540418819
  implements MigrationInterface
{
  name = 'NftCollectionRelationship1667540418819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft"."nft" ADD "collectionId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_941622072386aeece5112fe0db2" FOREIGN KEY ("collectionId") REFERENCES "nft"."collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_941622072386aeece5112fe0db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP COLUMN "collectionId"`,
    );
  }
}
