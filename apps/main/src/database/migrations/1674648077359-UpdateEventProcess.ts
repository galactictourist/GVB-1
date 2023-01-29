import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventProcess1674648077359 implements MigrationInterface {
  name = 'UpdateEventProcess1674648077359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_process" ADD "contractStandard" character varying(50) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_process" DROP COLUMN "contractStandard"`,
    );
  }
}
