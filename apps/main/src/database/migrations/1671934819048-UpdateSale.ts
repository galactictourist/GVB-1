import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSale1671934819048 implements MigrationInterface {
  name = 'UpdateSale1671934819048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale" ALTER COLUMN "currency" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale" ALTER COLUMN "currency" DROP NOT NULL`,
    );
  }
}
