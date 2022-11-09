import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNft1667945712228 implements MigrationInterface {
  name = 'UpdateNft1667945712228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft"."nft" ADD "charityId" uuid`);
    await queryRunner.query(`ALTER TABLE "nft"."nft" ADD "topicId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "topicId"`);
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "charityId"`);
  }
}
