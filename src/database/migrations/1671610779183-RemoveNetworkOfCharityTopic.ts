import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNetworkOfCharityTopic1671610779183
  implements MigrationInterface
{
  name = 'RemoveNetworkOfCharityTopic1671610779183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP COLUMN "network"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD "network" character varying(20)`,
    );
  }
}
