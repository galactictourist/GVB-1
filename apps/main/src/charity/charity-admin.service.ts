import { BadRequestException, Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { CharityDto } from './dto/charity.dto';
import { CreateCharityTopicAdminDto } from './dto/create-charity-topic-admin.dto';
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
    const [data, count] = await this.charityRepository.findAndCount({
      where,
      order: {
        name: 'DESC',
      },
    });

    return { data, count };
  }

  async getActiveCharities() {
    const [data, count] = await this.charityRepository.findAndCountBy({
      status: CharityStatus.ACTIVE,
    });
    return { data, count };
  }

  async createCharity(charityDto: CharityDto) {
    const charity = this.charityRepository.create({
      name: charityDto.name,
      status: charityDto.status || CharityStatus.ACTIVE,
    });
    await charity.save();

    const charityTopic = this.charityTopicRepository.create({
      charityId: charity.id,
      topicId: charityDto.causeId,
      wallet: charityDto.wallet,
    });
    await charityTopic.save();

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

  async updateCharity(id: string, charityDto: CharityDto) {
    const charity = await this.charityRepository.findOne({
      relations: {
        charityTopics: true,
      },
      where: {
        id,
      },
    });

    if (charity) {
      charity.name = charityDto.name;
      charity.charityTopics[0].topicId = charityDto.causeId;
      charity.charityTopics[0].wallet = charityDto.wallet;

      if (charityDto.status) {
        charity.status = charityDto.status;
      }
      await charity.save();
      return charity;
    }

    throw new BadRequestException('Charity is invalid');
  }
}
