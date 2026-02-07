import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { TestingSessionService } from '../testing-session/testing-session.service';
import { InjectModel } from '@nestjs/sequelize';
import { TestingSession } from '../testing-session/models/testing-session.model';
import { Op } from 'sequelize';
import { PaginationQuery } from '@ntheanh201/nestjs-sequelize-pagination';
import { TestingSessionFindAllQuery } from '../testing-session/query/testing_session_find_all_query';
import { StatisticDto } from './dto/statistic.dto';
import { TestingSessionStatus } from '../testing-session/testing-session.enum';
import { Answer } from '../testing-session/answers/models/answers.model';
import { User } from '../users/users.model';
import { Role } from '../roles/roles.model';
import { Complex } from '../complexes/models/complex.model';
import { StagedIndicator } from '../indicators/models/staged-indicator.model';
import { BaseIndicator } from '../indicators/models/base-indicator.model';
import { Metric } from '../indicators/metrics/models/metrics.model';
import { TestingSessionDto } from '../testing-session/dto/testing-session.dto';
import { StatisticIndicatorDto } from './dto/statistic-indicator.dto';
import { info, log } from 'console';
import { StagedIndicatorDto } from '../indicators/dto/staged-indicator.dto';

@Injectable()
export class ResultsService {

  constructor(
    @InjectModel(TestingSession) private testingRepository: typeof TestingSession,
    private testingSessionService: TestingSessionService) {
  }

  private readonly logger = new Logger(ResultsService.name)

  async getInfographics(
    subjectId: string,
    startDate?: Date | null,
    endDate?: Date | null,
  ) {  // Валидация входных данных
    if (!subjectId) {
      throw new BadRequestException('subjectId обязателен');
    }

    // Формируем условия WHERE
    const whereCondition: any = {
      [Op.and]: [
        { subjectId }, // ← subjectId теперь строка, а не объект
        { status: TestingSessionStatus.completed }
      ]
    };

    // Добавляем фильтрацию по датам с преобразованием в Date
    if (startDate) {
      whereCondition[Op.and].push({
        createdAt: {
          [Op.gte]: startDate // ← Преобразуем строку в Date
        }
      });
    }

    if (endDate) {
      whereCondition[Op.and].push({
        createdAt: {
          [Op.lte]: endDate // ← Преобразуем строку в Date
        }
      })
    }
    // Загружаем данные из БД
    const sessionsModels = await this.testingRepository.findAll({
      where: whereCondition,
      include: [
        {
          model: Complex,
          include: [
            {
              model: StagedIndicator,
              include: [
                {
                  model: BaseIndicator,
                  include: [
                    {
                      model: Metric,
                      as: 'metrics',
                      through: { attributes: [] },
                    },
                    {
                      model: Metric,
                      as: 'boundaryMetric',
                    },
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Answer,
          as: 'answers',
        }
      ],
      order: [['createdAt', 'ASC']] // Сортируем по дате для корректной группировки
    });

    var sessionsDto = sessionsModels.map(sessionModel => new TestingSessionDto(sessionModel));


    let infographicsIndicators : StatisticIndicatorDto[] = [];
    var allAnswers = sessionsDto.map(session => session.answers).flat().sort((a, b) => a.date?.getTime() - b.date?.getTime());
    for (var session of sessionsDto) {
      for (var stagedIndicator of session.complex.indicators) {
        if (infographicsIndicators.find(statisticIndicator => statisticIndicator.stagedIndicator.id == stagedIndicator.id)) {
          continue;
        }
        var answers = allAnswers.filter(answer => answer.indicatorId == stagedIndicator.id);
        
        infographicsIndicators.push(new StatisticIndicatorDto(stagedIndicator, answers));
      }
    }

    return new StatisticDto(
      subjectId,
      Array.from(infographicsIndicators).filter(indicator => indicator.stagedIndicator.indicator.isEndToEnd),
      Array.from(infographicsIndicators).filter(indicator => !indicator.stagedIndicator.indicator.isEndToEnd),
    );

  }
}

