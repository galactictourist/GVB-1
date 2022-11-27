import { Injectable } from '@nestjs/common';
import { CreateCharityAdminDto } from './dto/create-charity-admin.dto';
import { UpdateCharityAdminDto } from './dto/update-charity-admin.dto';
import { CharityTopicRepository } from './repository/charity-topic.repository';
import { CharityRepository } from './repository/charity.repository';

@Injectable()
export class CharityAdminService {
  constructor(
    private readonly charityRepository: CharityRepository,
    private readonly charityToppicRepository: CharityTopicRepository,
  ) {}

  async createCharity(createCharityDto: CreateCharityAdminDto) {
    const charity = this.charityRepository.create({
      name: createCharityDto.name,
    });
    await charity.save();
    return charity;
  }

  async updateCharity(id: string, updateCharityDto: UpdateCharityAdminDto) {
    const updateResult = await this.charityRepository.update(
      { id },
      {
        name: updateCharityDto.name,
      },
    );
    return updateResult;
  }
}
