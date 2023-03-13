import { MigrationInterface, QueryRunner } from "typeorm";

export class updateNftTable1678728151631 implements MigrationInterface {
    name = 'updateNftTable1678728151631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "nft_network_mintedTxId_uq"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "tokenUri" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "isMinted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP INDEX "public"."nft_uq"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "tokenId"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "tokenId" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "nft" ALTER COLUMN "immutable" SET DEFAULT 'YES'`);
        await queryRunner.query(`CREATE INDEX "IDX_c1704d25e65c5ccce57e470c6c" ON "nft" ("name", "isMinted", "tokenUri") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c1704d25e65c5ccce57e470c6c"`);
        await queryRunner.query(`ALTER TABLE "nft" ALTER COLUMN "immutable" SET DEFAULT 'NO'`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "tokenId"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "tokenId" character varying(200)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "nft_uq" ON "nft" ("network", "tokenId") `);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "isMinted"`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "tokenUri"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "nft_network_mintedTxId_uq" UNIQUE ("network", "mintedTxId")`);
    }

}
