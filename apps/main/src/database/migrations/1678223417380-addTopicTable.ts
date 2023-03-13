import { MigrationInterface, QueryRunner } from "typeorm";

export class addTopicTable1678223417380 implements MigrationInterface {
    name = 'addTopicTable1678223417380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic" ADD "isParent" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "isParent"`);
    }

}
