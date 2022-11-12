import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueNonceCode1668249152800 implements MigrationInterface {
  name = 'UniqueNonceCode1668249152800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."nonce" ADD CONSTRAINT "UQ_35b9980d300e39a38b842da1a8e" UNIQUE ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."nonce" DROP CONSTRAINT "UQ_35b9980d300e39a38b842da1a8e"`,
    );
  }
}
