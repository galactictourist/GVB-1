import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexes1671847150076 implements MigrationInterface {
  name = 'CreateIndexes1671847150076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "topic_parentId_idx" ON "topic" ("parentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "user_status_idx" ON "user" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "collection_status_idx" ON "collection" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "collection_ownerId_idx" ON "collection" ("ownerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "nft_collectionId_idx" ON "nft" ("collectionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "nft_imageStorageId_idx" ON "nft" ("imageStorageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "nft_status_idx" ON "nft" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "nft_ownerId_idx" ON "nft" ("ownerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sale_status_idx" ON "sale" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sale_expiredAt_idx" ON "sale" ("expiredAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sale_topicId_idx" ON "sale" ("topicId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sale_charityId_idx" ON "sale" ("charityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sale_nftId_idx" ON "sale" ("nftId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sale_userId_idx" ON "sale" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "charity_status_idx" ON "charity" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_status_idx" ON "order" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_topicId_idx" ON "order" ("topicId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_charityId_idx" ON "order" ("charityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_nftId_idx" ON "order" ("nftId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_saleId_idx" ON "order" ("saleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_buyerId_idx" ON "order" ("buyerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "order_sellerId_idx" ON "order" ("sellerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD CONSTRAINT "charity_topic_uq" UNIQUE ("charityId", "topicId", "countryCode")`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "nft_network_mintedTxId_uq" UNIQUE ("network", "mintedTxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "sale_uq" UNIQUE ("network", "hash")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "order_uq" UNIQUE ("network", "txId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "order_uq"`);
    await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "sale_uq"`);
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "nft_network_mintedTxId_uq"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP CONSTRAINT "charity_topic_uq"`,
    );
    await queryRunner.query(`DROP INDEX "public"."order_sellerId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."order_buyerId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."order_saleId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."order_nftId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."order_charityId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."order_topicId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."order_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."charity_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."sale_userId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."sale_nftId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."sale_charityId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."sale_topicId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."sale_expiredAt_idx"`);
    await queryRunner.query(`DROP INDEX "public"."sale_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."nft_ownerId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."nft_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."nft_imageStorageId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."nft_collectionId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."collection_ownerId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."collection_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."user_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."topic_parentId_idx"`);
  }
}
