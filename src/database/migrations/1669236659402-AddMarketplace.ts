import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMarketplace1669236659402 implements MigrationInterface {
  name = 'AddMarketplace1669236659402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "marketplace"."sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "network" character varying(20) NOT NULL, "currency" character varying(50), "price" numeric(36,18) DEFAULT '0', "nftId" uuid NOT NULL, "charityId" uuid, "topicId" uuid, "countryCode" character varying, "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "marketplace"."order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sellerId" uuid NOT NULL, "buyerId" uuid NOT NULL, "saleId" uuid NOT NULL, "nftId" uuid NOT NULL, "quantity" integer NOT NULL, "network" character varying(20) NOT NULL, "currency" character varying(50), "price" numeric(36,18) DEFAULT '0', "total" numeric(36,18) DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'PLACED', "charityId" uuid, "topicId" uuid, "charityWallet" character varying(100), "txId" character varying(100), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" ADD CONSTRAINT "FK_bf176f13c0bce3c693b24523794" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" ADD CONSTRAINT "FK_bb4ebac5e8dd75aa3118a0f3a68" FOREIGN KEY ("nftId") REFERENCES "nft"."nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" ADD CONSTRAINT "FK_9aa59fdb7ee313b3760625e4a0f" FOREIGN KEY ("charityId") REFERENCES "charity"."charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" ADD CONSTRAINT "FK_29ab1c75bf26d42702fd0d73bde" FOREIGN KEY ("topicId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" ADD CONSTRAINT "FK_41ad44b78b3c2565a34ac6e7155" FOREIGN KEY ("saleId") REFERENCES "marketplace"."sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" ADD CONSTRAINT "FK_e53b57164b9c9bbdda6257da3f5" FOREIGN KEY ("nftId") REFERENCES "nft"."nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" ADD CONSTRAINT "FK_c7182965d1a753af4c435818abd" FOREIGN KEY ("charityId") REFERENCES "charity"."charity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" ADD CONSTRAINT "FK_f07e3d6e07a415eda9537238fdd" FOREIGN KEY ("topicId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" DROP CONSTRAINT "FK_f07e3d6e07a415eda9537238fdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" DROP CONSTRAINT "FK_c7182965d1a753af4c435818abd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" DROP CONSTRAINT "FK_e53b57164b9c9bbdda6257da3f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" DROP CONSTRAINT "FK_41ad44b78b3c2565a34ac6e7155"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" DROP CONSTRAINT "FK_29ab1c75bf26d42702fd0d73bde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" DROP CONSTRAINT "FK_9aa59fdb7ee313b3760625e4a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" DROP CONSTRAINT "FK_bb4ebac5e8dd75aa3118a0f3a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marketplace"."sale" DROP CONSTRAINT "FK_bf176f13c0bce3c693b24523794"`,
    );
    await queryRunner.query(`DROP TABLE "marketplace"."order"`);
    await queryRunner.query(`DROP TABLE "marketplace"."sale"`);
  }
}
