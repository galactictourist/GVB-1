import { MigrationInterface, QueryRunner } from 'typeorm';
import { AdminRole, AdminStatus } from '~/main/user/types';

export class InsertSuperAdmin1669606086531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "admin" ("username", "password", "role", "status") VALUES ('root', '$2a$12$2AQML.1jOi1sG58ZbpMrSus6cGgIi/aWGo663QwMU82Jz4HquiQTW', '${AdminRole.SUPER_ADMIN}', '${AdminStatus.ACTIVE}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "admin" WHERE "username" = 'root'`);
  }
}
