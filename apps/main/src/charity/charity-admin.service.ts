import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { CreateCharityAdminDto } from './dto/create-charity-admin.dto';
import { CreateCharityTopicAdminDto } from './dto/create-charity-topic-admin.dto';
import { UpdateCharityAdminDto } from './dto/update-charity-admin.dto';
import { CharityTopicEntity } from './entity/charity-topic.entity';
import { CharityEntity } from './entity/charity.entity';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';
import { CharityStatus } from './types';

@Injectable()
export class CharityAdminService {
  constructor(
    private readonly charityRepository: CharityRepository,
    private readonly charityTopicRepository: CharityTopicRepository,
  ) {}

  async getCharities(where: FindOptionsWhere<CharityEntity> = {}) {
    const [data, count] = await this.charityRepository.findAndCountBy(where);
    return { data, count };
  }

  async getActiveCharities() {
    const [data, count] = await this.charityRepository.findAndCountBy({
      status: CharityStatus.ACTIVE,
    });
    return { data, count };
  }

  async createCharity(createCharityDto: CreateCharityAdminDto) {
    const charity = this.charityRepository.create({
      name: createCharityDto.name,
      status: createCharityDto.status || CharityStatus.ACTIVE,
    });
    await charity.save();
    return charity;
  }

  async createCharityTopic(
    charityId: string,
    createCharityTopicDto: CreateCharityTopicAdminDto,
    defaults?: DeepPartial<CharityTopicEntity>,
  ) {
    const existing =
      await this.charityTopicRepository.findOneByCharityTopicCountry(
        charityId,
        createCharityTopicDto.topicId,
        // createCharityTopicDto.countryCode,
      );
    if (existing) {
      throw new BadRequestException(
        'Charity topic for this country is already created',
      );
    }
    const charityTopic = this.charityTopicRepository.create({
      ...defaults,
      charityId,
      // countryCode: createCharityTopicDto.countryCode,
      topicId: createCharityTopicDto.topicId,
      wallet: createCharityTopicDto.wallet,
    });
    await charityTopic.save();
    return charityTopic;
  }

  async updateCharity(id: string, updateCharityDto: UpdateCharityAdminDto) {
    const charity = await this.charityRepository.findOneByOrFail({ id });
    if (updateCharityDto.name) {
      charity.name = updateCharityDto.name;
    }
    if (updateCharityDto.status) {
      charity.status = updateCharityDto.status;
    }
    await charity.save();
    return charity;
  }
}
