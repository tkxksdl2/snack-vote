import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MAINPAGE_AGENDAS_UNIT } from 'src/common/common.constants';
import { DataSource, Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';

@Injectable()
export class AgendaRepository extends Repository<Agenda> {
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly voteCache: Cache,
  ) {
    super(Agenda, dataSource.createEntityManager());
  }
  async findAgendaIdByRecentVoteCount(): Promise<number[]> {
    try {
      const qb = this.dataSource.createQueryBuilder(Agenda, 'agenda');
      const result = await qb
        .subQuery()
        .from(Agenda, 'agenda')
        .innerJoin('agenda.opinions', 'opinion')
        .innerJoin('opinion.vote', 'vote')
        .select([
          'agenda.id as agendaId',
          'vote.id as voteId',
          'vote.createdAt',
        ])
        .orderBy('vote.createdAt', 'DESC')
        .limit(1000)
        .getRawMany();

      const resObj: { [key: string]: number } = {};
      for (const i in result) {
        const agendaId = result[i].agendaId;
        this.voteCache.set(`initialvote:${i}`, agendaId);
        resObj[agendaId] = resObj[agendaId] ? resObj[agendaId] + 1 : 1;
      }

      return Object.entries(resObj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAINPAGE_AGENDAS_UNIT)
        .map((v) => +v[0]);
    } catch (e) {
      return [];
    }
  }
}
