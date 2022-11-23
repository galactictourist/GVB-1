import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNft1669213526303 implements MigrationInterface {
  name = 'UpdateNft1669213526303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD "imageUri" character varying(200)`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD "description" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "nft"."nft" ADD "attributes" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD "metadataUri" character varying(200)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP COLUMN "metadataUri"`,
    );
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "attributes"`);
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "imageUri"`);
  }
}
