import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBatchEntity1698317691937 implements MigrationInterface {
    name = 'CreateBatchEntity1698317691937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "collectionId" uuid NOT NULL, "charityId" uuid NOT NULL, "charityShare" integer NOT NULL, CONSTRAINT "PK_57da3b830b57bec1fd329dcaf43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "batch_charityId_idx" ON "batch" ("charityId") `);
        await queryRunner.query(`CREATE INDEX "batch_collectionId_idx" ON "batch" ("collectionId") `);
        await queryRunner.query(`ALTER TABLE "sale" ADD "batchId" uuid`);
        await queryRunner.query(`CREATE INDEX "sale_batch_idx" ON "sale" ("batchId") `);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_aaa7d2488de225e0bc77e9bfbd8" FOREIGN KEY ("batchId") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_aaa7d2488de225e0bc77e9bfbd8"`);
        await queryRunner.query(`DROP INDEX "public"."sale_batch_idx"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "batchId"`);
        await queryRunner.query(`DROP INDEX "public"."batch_collectionId_idx"`);
        await queryRunner.query(`DROP INDEX "public"."batch_charityId_idx"`);
        await queryRunner.query(`DROP TABLE "batch"`);
    }

}
