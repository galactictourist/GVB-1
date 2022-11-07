import { MigrationInterface, QueryRunner } from 'typeorm';

export class Owner1667540000383 implements MigrationInterface {
  name = 'Owner1667540000383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ADD "ownerId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "nft"."nft" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_6c7967d2df644874a310f312511" FOREIGN KEY ("ownerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_6c7967d2df644874a310f312511"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`,
    );
    await queryRunner.query(`ALTER TABLE "nft"."nft" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" DROP COLUMN "ownerId"`,
    );
  }
}
