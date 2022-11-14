import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCollectionDescription1668448942708
  implements MigrationInterface
{
  name = 'AddCollectionDescription1668448942708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft"."collection" DROP COLUMN "description"`,
    );
  }
}
