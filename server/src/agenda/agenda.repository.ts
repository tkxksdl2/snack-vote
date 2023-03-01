import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';

const query = `
    select a.id
    from agenda a join opinion b on a.id = b.agendaId
    where  datediff(now(), a.createdAt) < 10 and a.deletedAt is null
    group by a.id
    order by sum(b.votedUserCount) desc
    limit 6;
`;

@Injectable()
export class AgendaRepository extends Repository<Agenda> {
  constructor(private dataSource: DataSource) {
    super(Agenda, dataSource.createEntityManager());
  }
  async getMostVotedAgendaId(): Promise<number[]> {
    const result = await this.query(query);
    return result.map((v: { id: number }) => v.id);
  }
}
