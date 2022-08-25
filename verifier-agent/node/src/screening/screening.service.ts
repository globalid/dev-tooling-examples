import { DeepPartial, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Screening } from './screening.entity';

@Injectable()
export class ScreeningService {
  constructor(@InjectRepository(Screening) private readonly repository: Repository<Screening>) {}

  findAll(): Promise<Screening[]> {
    return this.repository.find({
      order: {
        screenedOn: 'desc'
      }
    });
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  save(screening: DeepPartial<Screening>): Promise<Screening> {
    return this.repository.save(screening);
  }
}
