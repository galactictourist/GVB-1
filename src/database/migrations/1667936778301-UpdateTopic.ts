import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTopic1667936778301 implements MigrationInterface {
  name = 'UpdateTopic1667936778301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" DROP CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ALTER COLUMN "parentId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ADD CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d" FOREIGN KEY ("parentId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" DROP CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ALTER COLUMN "parentId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity"."topic" ADD CONSTRAINT "FK_34dc9c84ae8d3ccee298d4c999d" FOREIGN KEY ("parentId") REFERENCES "charity"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
