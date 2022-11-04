import { MigrationInterface, QueryRunner } from 'typeorm';

export class Nft1667536700245 implements MigrationInterface {
  name = 'Nft1667536700245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "nft"."collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'DRAFT', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "nft"."nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "network" character varying(20) NOT NULL, "scAddress" character varying(50) NOT NULL, "tokenId" character varying(200) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "nft"."nft"`);
    await queryRunner.query(`DROP TABLE "nft"."collection"`);
  }
}
