import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSale1671933532417 implements MigrationInterface {
  name = 'UpdateSale1671933532417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "charityWallet" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "charityWallet"`);
  }
}
