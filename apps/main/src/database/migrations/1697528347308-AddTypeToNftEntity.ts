import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToNftEntity1697528347308 implements MigrationInterface {
    name = 'AddTypeToNftEntity1697528347308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" ADD "type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft" DROP COLUMN "type"`);
    }

}
