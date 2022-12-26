import { MigrationInterface, QueryRunner } from 'typeorm';

export class NftUniqueIndex1671870113944 implements MigrationInterface {
  name = 'NftUniqueIndex1671870113944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "nft_uq"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "nft_uq" ON "nft" ("network", lower("scAddress"), "tokenId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "nft_uq"`);
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "nft_uq" UNIQUE ("network", "scAddress", "tokenId")`,
    );
  }
}
