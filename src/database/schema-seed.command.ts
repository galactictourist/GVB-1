import { Command, CommandRunner } from 'nest-commander';
import { EntityManager } from 'typeorm';

@Command({ name: 'db:schema-seed', description: 'Create schemas' })
export class DatabaseSchemaSeedCommand extends CommandRunner {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async run() {
    await this.entityManager.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
    await this.entityManager.query(`CREATE SCHEMA IF NOT EXISTS "user"`);
    await this.entityManager.query(`CREATE SCHEMA IF NOT EXISTS "nft"`);
    await this.entityManager.query(`CREATE SCHEMA IF NOT EXISTS "charity"`);
    await this.entityManager.query(`CREATE SCHEMA IF NOT EXISTS "marketplace"`);
  }
}
