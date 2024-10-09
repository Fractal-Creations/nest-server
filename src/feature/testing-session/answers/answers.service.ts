import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TestingSession } from '../models/testing-session.model';
import { User } from 'src/feature/users/users.model';
import { TestingSessionService } from '../testing-session.service';
import { UsersService } from 'src/feature/users/users.service';
import { PaginationQuery, PaginationService } from '@ntheanh201/nestjs-sequelize-pagination';
import { AnswerDto } from './dto/answer.dto';
import { Answer } from './models/answers.model';
import { Includeable, Op } from 'sequelize';
import { PaginationAnswerDto } from './dto/pagination-answer.dto';
import { AppConst } from 'src/core/app.const';

@Injectable()
export class AnswersService {

  private readonly logger = new Logger(AnswersService.name);

  constructor(
    @InjectModel(Answer) private answerRepository: typeof Answer,
    private testingSessionService: TestingSessionService,
    private userService: UsersService,
    private paginationService: PaginationService
  ) {}
  async create(createAnswerDto: CreateAnswerDto) {
    this.logger.debug(`Start creating new answer`)
    const testingSession = await this.testingSessionService.findOne(createAnswerDto.testingSessionId);
    console.log(testingSession)
    if (!testingSession) {
      this.logger.debug('Cant find testing session');
      throw new HttpException(`Не удалось найти сеанс тестирования`, HttpStatus.BAD_REQUEST);
    } else {
      if (testingSession.currentIndicatorNumber + 1 > AppConst.maxTestingIndicatorCount) {
        this.logger.debug(`Answers count can not be more than  ${ AppConst.maxTestingIndicatorCount }`);
        throw new HttpException(`Нельзя создавать больше ${ AppConst.maxTestingIndicatorCount } ответов`, HttpStatus.BAD_REQUEST);
      } else if (testingSession.answers.find(a => a.indicatorId == createAnswerDto.indicatorId)) {
        this.logger.debug('Answer already exists');
        throw new HttpException(`Ответ на этот индиактор уже существует, воспользуйтесь методом update`, HttpStatus.BAD_REQUEST);
      }
    }
    
    const subject = await this.userService.findOne(createAnswerDto.subjectId);
    if (!subject) {
      this.logger.debug('Cant find subject');
      throw new HttpException(`Не удалось найти испытуемого`, HttpStatus.BAD_REQUEST);
    }
    const researcher = await this.userService.findOne(createAnswerDto.researcherId);
    if (!researcher) {
      this.logger.debug('Cant find researcher');
      throw new HttpException(`Не удалось найти исследователя`, HttpStatus.BAD_REQUEST);
    }

    if (testingSession && subject && researcher) {
      const answer = await this.answerRepository.create(createAnswerDto);
      if (answer) {
        this.logger.debug('Answer successfully created');
        this.testingSessionService.increaseIndicatorNumber(testingSession.id);
        return new AnswerDto(answer);
      }
      else {
        this.logger.debug('Answer not created');
        throw new HttpException(`Не удалось создать ответ`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async findAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
  ): Promise<PaginationAnswerDto> {
    let whereCondition;
    const keySearch = paginationOptions?.searchKey;
    if (keySearch) {
      whereCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${ keySearch }%` } },
        ],
      };
    }
    var response = (await this.paginationService.findAll<Answer>(
      {
        ...paginationOptions,
        model: Answer,
      },
      {
        where: whereCondition,
        include,

      },
    ));
    return new PaginationAnswerDto(response);
  }
  async findOne(id: string) {
    const answer = await this.answerRepository.findOne({ where: { id } });
    if (answer) {
      return new AnswerDto(answer);
    } else {
      throw new HttpException(`Ответ не найден`, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    const answer = await this.answerRepository.findOne({ where: { id } });
    if (answer) {
      if (updateAnswerDto.researcherId){
        const newResearcher = await this.userService.findOne(updateAnswerDto.researcherId);
        if (!newResearcher) {
          throw new HttpException(`Не удалось найти исследователя`, HttpStatus.BAD_REQUEST);
        }
      }
      const updated= await answer.update(updateAnswerDto);
      return new AnswerDto(updated);
    } else {
      throw new HttpException(`Ответ не найден`, HttpStatus.BAD_REQUEST);
    }
  }

}
