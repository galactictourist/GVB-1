import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStorageIndex1671591919171 implements MigrationInterface {
  name = 'CreateStorageIndex1671591919171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "storage_ownerId_label_idx" ON "storage" ("ownerId", "label") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."storage_ownerId_label_idx"`);
  }
}
