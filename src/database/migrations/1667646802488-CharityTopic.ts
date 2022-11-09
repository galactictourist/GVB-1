import { MigrationInterface, QueryRunner } from 'typeorm';

export class CharityTopic1667646802488 implements MigrationInterface {
  name = 'CharityTopic1667646802488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "charity"."charity_topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "charityId" uuid NOT NULL, "topicId" uuid NOT NULL, "countryCode" character varying NOT NULL, "network" character varying(20), "wallet" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e5c796dafdc30175e21dcabc297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."charity_topic" ADD CONSTRAINT "FK_ad11bc238b6ad7004af1f67d627" FOREIGN KEY ("charityId") REFERENCES "charity"."charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."charity_topic" ADD CONSTRAINT "FK_14f0568a8b9d3b50d2a2a3b4b9d" FOREIGN KEY ("topicId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity"."charity_topic" DROP CONSTRAINT "FK_14f0568a8b9d3b50d2a2a3b4b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."charity_topic" DROP CONSTRAINT "FK_ad11bc238b6ad7004af1f67d627"`,
    );
    await queryRunner.query(`DROP TABLE "charity"."charity_topic"`);
  }
}
