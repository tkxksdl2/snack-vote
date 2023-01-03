import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAgendaInput,
  CreateAgendaOutput,
} from './dtos/create-agenda.dto';
import {
  FindAgendaByIdInput,
  FindAgendaByIdOutput,
} from './dtos/find-agenda-by-id.dto';
import { Agenda } from './entities/agenda.entity';
import { Opinion } from './entities/opinion.entity';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private readonly agendas: Repository<Agenda>,
    @InjectRepository(Opinion)
    private readonly opinions: Repository<Opinion>,
  ) {}

  async findAgendaById({
    id,
  }: FindAgendaByIdInput): Promise<FindAgendaByIdOutput> {
    try {
      const agenda = await this.agendas.findOne({ where: { id } });
      if (!agenda) {
        return { ok: false, error: 'Agenda with input id is not found' };
      }
      return { ok: true, agenda };
    } catch {
      return { ok: false, error: "Couldn't find agenda" };
    }
  }

  async createAgenda(
    author: User,
    { subject, seriousness, opinionA, opinionB }: CreateAgendaInput,
  ): Promise<CreateAgendaOutput> {
    try {
      const opinions = [
        this.opinions.create({ opinionText: opinionA, opinionType: true }),
        this.opinions.create({ opinionText: opinionB, opinionType: false }),
      ];
      const newAgenda = await this.agendas.save(
        this.agendas.create({ subject, seriousness, opinions, author }),
      );
      return { ok: true, result: newAgenda };
    } catch {
      return { ok: false, error: "Couldn't create Agenda" };
    }
  }
}
