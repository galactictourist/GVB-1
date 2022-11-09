import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1667648421107 implements MigrationInterface {
  name = 'Update1667648421107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" DROP CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ALTER COLUMN "parentId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ALTER COLUMN "ownerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_941622072386aeece5112fe0db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_6c7967d2df644874a310f312511"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ALTER COLUMN "collectionId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ALTER COLUMN "ownerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ADD CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d" FOREIGN KEY ("parentId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_941622072386aeece5112fe0db2" FOREIGN KEY ("collectionId") REFERENCES "nft"."collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "nft"."nft" DROP CONSTRAINT "FK_941622072386aeece5112fe0db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" DROP CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ALTER COLUMN "ownerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ALTER COLUMN "collectionId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_6c7967d2df644874a310f312511" FOREIGN KEY ("ownerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."nft" ADD CONSTRAINT "FK_941622072386aeece5112fe0db2" FOREIGN KEY ("collectionId") REFERENCES "nft"."collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ALTER COLUMN "ownerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ALTER COLUMN "parentId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ADD CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d" FOREIGN KEY ("parentId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
