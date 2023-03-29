import { Injectable } from '@nestjs/common';
import { MAINPAGE_AGENDAS_UNIT } from 'src/common/common.constants';
import { DataSource, Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';

@Injectable()
export class AgendaRepository extends Repository<Agenda> {
  constructor(private dataSource: DataSource) {
    super(Agenda, dataSource.createEntityManager());
  }
  async findAgendaIdByRecentVoteCount(): Promise<number[]> {
    try {
      const qb = this.dataSource.createQueryBuilder(Agenda, 'agenda');
      const result = await qb
        .select(['sub.agendaId as id', 'COUNT(*) as recentCnt', 'sub.voteId'])
        .from(
          qb
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
            .getQuery(),
          'sub',
        )
        .groupBy('agendaId')
        .orderBy('recentCnt', 'DESC')
        .limit(MAINPAGE_AGENDAS_UNIT)
        .getRawMany();
      if (result) return result.map((v) => v.id);
      else return undefined;
    } catch (e) {
      return undefined;
    }
  }
}
