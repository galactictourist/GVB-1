import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1669260370767 implements MigrationInterface {
  name = 'Init1669260370767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "nonce" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(100) NOT NULL, "data" text NOT NULL, "expiredAt" TIMESTAMP, CONSTRAINT "UQ_35b9980d300e39a38b842da1a8e" UNIQUE ("code"), CONSTRAINT "PK_16620962f69fc3620001801e275" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "parentId" uuid, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "wallet" character varying(50), "imageUrl" character varying(200), "name" character varying(100), "countryCode" character varying(2), "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "description" character varying, "ownerId" uuid NOT NULL, "imageUrl" character varying(200), "status" character varying(20) NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "network" character varying(20), "scAddress" character varying(50), "tokenId" character varying(200), "name" character varying(200) NOT NULL, "imageUrl" character varying(200), "imageIpfsUrl" character varying(200), "description" character varying, "attributes" jsonb, "metadataIpfsUrl" character varying(200), "collectionId" uuid, "ownerId" uuid NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "creatorWallet" character varying(50), "royalty" integer, CONSTRAINT "nft_uq" UNIQUE ("network", "scAddress", "tokenId"), CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "network" character varying(20) NOT NULL, "currency" character varying(50), "price" numeric(36,18) NOT NULL DEFAULT '0', "nftId" uuid NOT NULL, "charityId" uuid, "topicId" uuid, "countryCode" character varying(2), "charityShare" integer, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "charity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_fbdd8ba5b5a6504618b8b1ab295" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "charity_topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "charityId" uuid NOT NULL, "topicId" uuid NOT NULL, "countryCode" character varying(2) NOT NULL, "network" character varying(20), "wallet" character varying(50), CONSTRAINT "PK_e5c796dafdc30175e21dcabc297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sellerId" uuid NOT NULL, "buyerId" uuid NOT NULL, "saleId" uuid NOT NULL, "nftId" uuid NOT NULL, "quantity" integer NOT NULL, "network" character varying(20) NOT NULL, "currency" character varying(50), "price" numeric(36,18) NOT NULL DEFAULT '0', "total" numeric(36,18) NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'PLACED', "charityId" uuid, "topicId" uuid, "countryCode" character varying(2), "charityShare" integer, "charityWallet" character varying(50), "txId" character varying(66), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d" FOREIGN KEY ("parentId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "FK_941622072386aeece5112fe0db2" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" ADD CONSTRAINT "FK_6c7967d2df644874a310f312511" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_bf176f13c0bce3c693b24523794" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_bb4ebac5e8dd75aa3118a0f3a68" FOREIGN KEY ("nftId") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_9aa59fdb7ee313b3760625e4a0f" FOREIGN KEY ("charityId") REFERENCES "charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_29ab1c75bf26d42702fd0d73bde" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD CONSTRAINT "FK_ad11bc238b6ad7004af1f67d627" FOREIGN KEY ("charityId") REFERENCES "charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" ADD CONSTRAINT "FK_14f0568a8b9d3b50d2a2a3b4b9d" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_41ad44b78b3c2565a34ac6e7155" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_e53b57164b9c9bbdda6257da3f5" FOREIGN KEY ("nftId") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_c7182965d1a753af4c435818abd" FOREIGN KEY ("charityId") REFERENCES "charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_f07e3d6e07a415eda9537238fdd" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_f07e3d6e07a415eda9537238fdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_c7182965d1a753af4c435818abd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_e53b57164b9c9bbdda6257da3f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_41ad44b78b3c2565a34ac6e7155"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP CONSTRAINT "FK_14f0568a8b9d3b50d2a2a3b4b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_topic" DROP CONSTRAINT "FK_ad11bc238b6ad7004af1f67d627"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_29ab1c75bf26d42702fd0d73bde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_9aa59fdb7ee313b3760625e4a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_bb4ebac5e8dd75aa3118a0f3a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" DROP CONSTRAINT "FK_bf176f13c0bce3c693b24523794"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "FK_6c7967d2df644874a310f312511"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nft" DROP CONSTRAINT "FK_941622072386aeece5112fe0db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "charity_topic"`);
    await queryRunner.query(`DROP TABLE "charity"`);
    await queryRunner.query(`DROP TABLE "sale"`);
    await queryRunner.query(`DROP TABLE "nft"`);
    await queryRunner.query(`DROP TABLE "collection"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "topic"`);
    await queryRunner.query(`DROP TABLE "nonce"`);
  }
}
