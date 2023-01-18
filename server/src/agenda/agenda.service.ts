import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_UNIT } from 'src/common/common.constants';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAgendaInput,
  CreateAgendaOutput,
} from './dtos/create-agenda.dto';
import {
  DeleteAgendaInput,
  DeleteAgendaOutput,
} from './dtos/delete-agenda.dto';
import {
  FindAgendaByIdInput,
  FindAgendaByIdOutput,
} from './dtos/find-agenda-by-id.dto';
import {
  GetAllAgendasInput,
  GetAllAgendasOutput,
} from './dtos/get-all-agendas.dto';
import {
  GetMyAgendasInput,
  GetmyAgendasOutput,
} from './dtos/get-my-agendas.dto';
import {
  GetVotedAgendasInput,
  GetVotedAgendasOutput,
} from './dtos/get-voted-agendas.dto';
import {
  VoteOrUnvoteInput,
  VoteOrUnvoteOutput,
} from './dtos/vote-or-unvote.dto';
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
      const agenda = await this.agendas.findOne({
        where: { id },
        relations: ['author'],
      });
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

  async deleteAgenda(
    user: User,
    { agendaId }: DeleteAgendaInput,
  ): Promise<DeleteAgendaOutput> {
    try {
      const { agenda, ok, error } = await this.findAgendaById({ id: agendaId });
      if (!ok) {
        return { ok, error };
      }
      if (user.id !== agenda.author.id && user.role !== UserRole.Admin) {
        return {
          ok: false,
          error: "You don't have permission to delete this agenda",
        };
      }
      this.agendas.softRemove(agenda);
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't delete Agenda" };
    }
  }

  async getAllAgendas({
    page,
  }: GetAllAgendasInput): Promise<GetAllAgendasOutput> {
    try {
      const [agendas, count] = await this.agendas.findAndCount({
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
      });
      const totalPage = Math.ceil(count / PAGINATION_UNIT);
      return {
        ok: true,
        agendas,
        totalPage,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async getMyAgendas(
    user: User,
    { page }: GetMyAgendasInput,
  ): Promise<GetmyAgendasOutput> {
    try {
      const [agendas, count] = await this.agendas.findAndCount({
        where: { author: { id: user.id } },
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
      });
      return {
        ok: true,
        agendas,
        totalPage: Math.ceil(count / PAGINATION_UNIT),
      };
    } catch (e) {
      return { ok: false, error: "Coundn't get your agendas" };
    }
  }

  async getVotedAgendas(
    user: User,
    { page }: GetVotedAgendasInput,
  ): Promise<GetVotedAgendasOutput> {
    try {
      const [opinions, count] = await this.opinions.findAndCount({
        where: {
          votedUser: { id: user.id },
        },
        select: ['agenda'],
        relations: ['agenda'],
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
      });
      const agendas = [];
      opinions.forEach((opinion) => {
        agendas.push(opinion.agenda);
      });
      return {
        ok: false,
        agendas,
        totalPage: Math.ceil(count / PAGINATION_UNIT),
      };
    } catch (e) {
      return { ok: false, error: "Coundn't get you voted agendas" };
    }
  }

  async voteOrUnvote(
    authUser: User,
    { otherOpinionId, voteId }: VoteOrUnvoteInput,
  ): Promise<VoteOrUnvoteOutput> {
    try {
      const votedOp = await this.opinions.findOne({
        where: { id: voteId },
        relations: ['votedUser'],
      });
      const otherOp = await this.opinions.findOne({
        where: { id: otherOpinionId },
        relations: ['votedUser'],
      });
      if (!votedOp || !otherOp) {
        return { ok: false, error: 'Opinion with input id dose not exist' };
      }
      if (otherOp.votedUserId.includes(authUser.id)) {
        return { ok: false, error: 'You alreay voted other Opinion' };
      }
      if (votedOp.votedUserId.includes(authUser.id)) {
        votedOp.votedUser = votedOp.votedUser.filter((user) => {
          return user.id !== authUser.id;
        });
        votedOp.votedUserCount -= 1;
        this.opinions.save(votedOp);
        return {
          ok: true,
          message: 'Successfully unvoted opinion',
          voteCount: votedOp.votedUser.length,
        };
      }
      votedOp.votedUser.push(authUser);
      votedOp.votedUserCount += 1;
      this.opinions.save(votedOp);
      return {
        ok: true,
        message: 'Successfully voted opinion',
        voteCount: votedOp.votedUser.length,
      };
    } catch {
      return { ok: false, error: "Couldn't vote to opinion" };
    }
  }
}
