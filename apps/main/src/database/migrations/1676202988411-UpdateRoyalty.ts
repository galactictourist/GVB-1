import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoyalty1676202988411 implements MigrationInterface {
  name = 'UpdateRoyalty1676202988411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft" ALTER COLUMN "royalty" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ALTER COLUMN "royalty" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft" ALTER COLUMN "royalty" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ALTER COLUMN "royalty" DROP NOT NULL`,
    );
  }
}
