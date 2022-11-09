import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNftName1667977650589 implements MigrationInterface {
  name = 'AddNftName1667977650589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD "name" character varying(200) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "name"`);
  }
}
