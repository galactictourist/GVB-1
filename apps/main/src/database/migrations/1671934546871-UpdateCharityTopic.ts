import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCharityTopic1671934546871 implements MigrationInterface {
  name = 'UpdateCharityTopic1671934546871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ALTER COLUMN "wallet" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ALTER COLUMN "wallet" DROP NOT NULL`,
    );
  }
}
