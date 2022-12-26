import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventProcessTable1672028493173
  implements MigrationInterface
{
  name = 'CreateEventProcessTable1672028493173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_process" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "network" character varying(20) NOT NULL, "scAddress" character varying(50) NOT NULL, "eventName" character varying(50) NOT NULL, "beginBlockNumber" integer, "endBlockNumber" integer, "status" character varying(20) NOT NULL, CONSTRAINT "event_process_uq" UNIQUE ("network", "scAddress", "eventName"), CONSTRAINT "PK_bfecfe907c0d5573bb9d0d57257" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event_process"`);
  }
}
