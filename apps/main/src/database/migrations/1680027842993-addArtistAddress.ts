import { MigrationInterface, QueryRunner } from "typeorm";

export class addArtistAddress1680027842993 implements MigrationInterface {
    name = 'addArtistAddress1680027842993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" ADD "artistAddress" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "artistAddress"`);
    }

}
