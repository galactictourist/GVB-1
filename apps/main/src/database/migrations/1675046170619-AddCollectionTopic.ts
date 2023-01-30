import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCollectionTopic1675046170619 implements MigrationInterface {
  name = 'AddCollectionTopic1675046170619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "collection" ADD "topicId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_7383c24ae4860c4d09df2974930" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_7383c24ae4860c4d09df2974930"`,
    );
    await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "topicId"`);
  }
}
