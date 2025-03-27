import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionDto } from '../dtos/create-post-meta-option.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async createMetaOption(
    createPostMetaOptionDto: CreatePostMetaOptionDto,
  ) {
    // const existingMetaOption = await this.metaOptionRepository.findOne({
    //   where: { metaValue: createPostMetaOptionDto.metaValue },
    // });

    let newMetaOption = this.metaOptionRepository.create(
      createPostMetaOptionDto,
    );
    newMetaOption = await this.metaOptionRepository.save(newMetaOption);

    return newMetaOption;
  }
}
