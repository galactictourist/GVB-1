import { ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  async deleteAll() {
    return this.createQueryBuilder().delete().where('1=1').execute();
  }
}
