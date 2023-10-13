import { MigrationInterface, QueryRunner } from "typeorm";

export class StorageTableOwnerAdmin1697182381033 implements MigrationInterface {
    name = 'StorageTableOwnerAdmin1697182381033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" DROP CONSTRAINT "FK_4aeb602026a5b626544c51eb407"`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_4aeb602026a5b626544c51eb407" FOREIGN KEY ("ownerId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" DROP CONSTRAINT "FK_4aeb602026a5b626544c51eb407"`);
        await queryRunner.query(`ALTER TABLE "storage" ADD CONSTRAINT "FK_4aeb602026a5b626544c51eb407" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
