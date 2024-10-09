import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTestingDto as CreateTestingSessionDto } from './dto/create-testing-session.dto';
import { UpdateTestingDto } from './dto/update-testing-session.dto';
import { IndicatorsService } from '../indicators/indicators.service';
import { PaginationService } from '@ntheanh201/nestjs-sequelize-pagination/dist/pagination.service';
import { InjectModel } from '@nestjs/sequelize/dist/common/sequelize.decorators';
import { TestingSession } from './models/testing-session.model';
import { Complex } from '../complexes/models/complex.model';
import { User } from '../users/users.model';
import { TestingSessionDto } from './dto/testing-session.dto';
import { PaginationQuery } from '@ntheanh201/nestjs-sequelize-pagination';
import { PaginationTestingSessionDto } from './dto/pagination-testing-session.dto';
import { Includeable, Op } from 'sequelize';
import { UserUtils } from '../common/utils/user.util';
import { AppConst } from 'src/core/app.const';
import { TestingSessionStatus } from './testing-session.enum';
import { ComplexesService } from '../complexes/complexes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TestingSessionService {

  constructor(
    @InjectModel(TestingSession) private testingRepository: typeof TestingSession,
    @InjectModel(Complex) private complexRepository: typeof Complex,
    @InjectModel(User) private userRepository: typeof User,
    private userService: UsersService,
    private complexesService: ComplexesService,
    private paginationService: PaginationService
  ) { }
  private readonly logger = new Logger(IndicatorsService.name);

  async create(createTestingSessionDto: CreateTestingSessionDto) {
    this.logger.debug(`Start creating new testing session`)
    const complex = await this.complexRepository.findOne({ where: { id: createTestingSessionDto.complexId }, include: { all: true } });
    if (!complex) {
      this.logger.debug('Cant find complex');
      throw new HttpException(`Не удалось найти комплекс`, HttpStatus.BAD_REQUEST);
    }
    const subject = await this.userRepository.findOne({ where: { id: createTestingSessionDto.subjectId } });
    if (!subject) {
      this.logger.debug('Cant find subject');
      throw new HttpException(`Не удалось найти испытуемого`, HttpStatus.BAD_REQUEST);
    }
    const reserahcer = await this.userRepository.findOne({ where: { id: createTestingSessionDto.researchersIds.at(0) } });
    if (!reserahcer) {
      this.logger.debug('Cant find researcher');
      throw new HttpException(`Не удалось найти исследователя`, HttpStatus.BAD_REQUEST);
    }

    if (complex && subject && reserahcer) {
      createTestingSessionDto.subjectName = UserUtils.getFio(subject);
      const testingSession = await this.testingRepository.create(createTestingSessionDto);
      if (testingSession) {
        this.logger.debug('Testing session successfully created');
        return new TestingSessionDto(testingSession, null, complex, subject, [reserahcer]);
      }
      else {
        this.logger.debug('Testing session not created');
        throw new HttpException(`Не удалось создать сеанс тестирования`, HttpStatus.BAD_REQUEST);
      }
    }

  }


  async findAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
  ): Promise<PaginationTestingSessionDto> {
    let whereCondition;
    const keySearch = paginationOptions?.searchKey;
    if (keySearch) {
      whereCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${ keySearch }%` } },
        ],
      };
    }
    var response = (await this.paginationService.findAll<TestingSession>(
      {
        ...paginationOptions,
        model: TestingSession,
      },
      {
        where: whereCondition,
        include,

      },
    ));
    return new PaginationTestingSessionDto(response);
  }

  async findOne(id: string) {
    this.logger.debug(`Start seraching testing session with id ${ id }`)
    /// FIXME: разобраться, как применить сортировку для вложенных моделей
    //const testingSession = await this.testingRepository.findOne({ where: { id },  include: [{model: User, as: 'subject'},  {model: Complex, as: 'complex', all: true, nested: true}] })
    const testingSession = await this.testingRepository.findOne({ where: { id },  include: {all: true, nested: true} })
    if (testingSession) {
      const dto = new TestingSessionDto(testingSession);
      this.logger.debug('Testing session successfully found');
      const complex = await this.complexesService.findOne(testingSession.complexId);
      dto.complex = complex;
      return dto;
    } else {
      this.logger.debug('Testing session not exists');
      throw new HttpException(`Сеанс тестирования не существует`, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateMonitoringDto: UpdateTestingDto) {
    const testingSession = await this.testingRepository.findOne({ where: { id } });
    if (testingSession) {
      const updated = await testingSession.update(updateMonitoringDto);
      return new TestingSessionDto(updated);
    }
  }

  async endTestingSession(id: string) {
    const testingSession = await this.testingRepository.findOne({ where: { id } });
    if (testingSession) {
      if (testingSession.currentIndicatorNumber == AppConst.maxTestingIndicatorCount - 1) {
        const completed = await this.update(id, { status: TestingSessionStatus.completed });
        if (completed.status == TestingSessionStatus.completed) {
          return true;
        } else {
          throw new HttpException(`Не удалось завершить сеанс тестирования`, HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException(`Необходимо завершить все индикаторы`, HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException(`Сеанс тестирования не существует`, HttpStatus.BAD_REQUEST);
    }

  }


  async increaseIndicatorNumber(id: string) {
    const testingSession = await this.testingRepository.findOne({ where: { id } });
    if (testingSession) {
      const currentIndicatorNumber = testingSession.currentIndicatorNumber
      if (currentIndicatorNumber < AppConst.maxTestingIndicatorCount - 1) {
        testingSession.currentIndicatorNumber += 1;
        await testingSession.save();
      }
    }
  }
}
