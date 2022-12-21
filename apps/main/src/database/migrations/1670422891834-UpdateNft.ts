import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNft1670422891834 implements MigrationInterface {
  name = 'UpdateNft1670422891834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft" ADD "rawMetadata" jsonb`);
    await queryRunner.query(`ALTER TABLE "nft" ADD "properties" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "nft" ADD "immutable" character varying(10) NOT NULL DEFAULT 'NO'`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD "mintedTxId" character varying(66)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "mintedTxId"`);
    await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "immutable"`);
    await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "properties"`);
    await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "rawMetadata"`);
  }
}
