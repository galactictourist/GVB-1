import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNft1671871248075 implements MigrationInterface {
  name = 'UpdateNft1671871248075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "quantity" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD "remainingQuantity" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "FK_6c7967d2df644874a310f312511"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ALTER COLUMN "ownerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ALTER COLUMN "status" SET DEFAULT 'LISTING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "FK_6c7967d2df644874a310f312511" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "FK_6c7967d2df644874a310f312511"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ALTER COLUMN "ownerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "FK_6c7967d2df644874a310f312511" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP COLUMN "remainingQuantity"`,
    );
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "quantity"`);
  }
}
