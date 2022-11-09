import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNft1667977326220 implements MigrationInterface {
  name = 'UpdateNft1667977326220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD "currency" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD "price" numeric(36,18) DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "currency"`);
  }
}
