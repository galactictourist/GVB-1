import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCharityTopicCountryCode1677120930508
  implements MigrationInterface
{
  name = 'RemoveCharityTopicCountryCode1677120930508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP CONSTRAINT "charity_topic_uq"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP COLUMN "countryCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD CONSTRAINT "charity_topic_uq2" UNIQUE ("charityId", "topicId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP CONSTRAINT "charity_topic_uq2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD "countryCode" character varying(2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD CONSTRAINT "charity_topic_uq" UNIQUE ("charityId", "topicId", "countryCode")`,
    );
  }
}
