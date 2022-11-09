import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1667973421537 implements MigrationInterface {
  name = 'Update1667973421537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_5a38e98491b54485022da90f372" FOREIGN KEY ("charityId") REFERENCES "charity"."charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_04b6fb1393d36bb46cef4e355af" FOREIGN KEY ("topicId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_04b6fb1393d36bb46cef4e355af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_5a38e98491b54485022da90f372"`,
    );
  }
}
