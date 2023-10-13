import { MigrationInterface, QueryRunner } from "typeorm";

export class CollectionTableOwnerAdmin1697181662674 implements MigrationInterface {
    name = 'CollectionTableOwnerAdmin1697181662674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_71af9149c567d79c9532f7e47d0"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_71af9149c567d79c9532f7e47d0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
