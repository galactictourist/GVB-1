import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageStorageToNft1671600635182 implements MigrationInterface {
  name = 'AddImageStorageToNft1671600635182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft" ADD "imageStorageId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "FK_6e95e53d02bd90ba4ebcd498887" FOREIGN KEY ("imageStorageId") REFERENCES "storage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "FK_6e95e53d02bd90ba4ebcd498887"`,
    );
    await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "imageStorageId"`);
  }
}
