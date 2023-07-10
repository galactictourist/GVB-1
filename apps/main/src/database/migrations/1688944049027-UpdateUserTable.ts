import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1688944049027 implements MigrationInterface {
    name = 'UpdateUserTable1688944049027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "description" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "socialMedia" jsonb`);
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "tokenId"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "tokenId" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "tokenId"`);
        await queryRunner.query(`ALTER TABLE "nft" ADD "tokenId" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialMedia"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "description"`);
    }

}
