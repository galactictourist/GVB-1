import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { SimplePaginationDto } from '~/types/dto/simple-pagination.dto';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  async deleteAll() {
    return this.createQueryBuilder().delete().where('1=1').execute();
  }

  async simplePaginate(
    where: FindOptionsWhere<T>,
    pagination: SimplePaginationDto | undefined,
  ) {
    const limit = pagination?.limit || 20;
    const page = pagination?.page || 1;
    const skip = (page - 1) * limit;
    const [data, total] = await this.findAndCount({ where, take: limit, skip });
    return {
      data,
      total,
      limit,
      page,
    };
  }
}
