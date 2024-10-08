import { Injectable } from '@nestjs/common';
import { CreateTestingDto } from './dto/create-testing.dto';
import { UpdateTestingDto } from './dto/update-testing.dto';

@Injectable()
export class MonitoringService {
  create(createMonitoringDto: CreateTestingDto) {
    return 'This action adds a new monitoring';
  }

  findAll() {
    return `This action returns all monitoring`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitoring`;
  }

  update(id: number, updateMonitoringDto: UpdateTestingDto) {
    return `This action updates a #${id} monitoring`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitoring`;
  }
}
