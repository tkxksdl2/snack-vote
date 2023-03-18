import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_UNIT } from 'src/common/common.constants';
import { User, UserRole } from 'src/users/entities/user.entity';
import { ILike, In, Repository } from 'typeorm';
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
  SearchAgendasByCategoryInput,
  SearchAgendasByCategoryOutput,
} from './dtos/search-agendas-by-category';
import {
  GetAllAgendasInput,
  GetAllAgendasOutput,
} from './dtos/get-all-agendas.dto';
import {
  GetMyAgendasInput,
  GetmyAgendasOutput,
} from './dtos/get-my-agendas.dto';
import {
  GetVotedOpinionsInput,
  GetVotedOpinionsOutput,
} from './dtos/get-voted-opinions.dto';
import {
  VoteOrUnvoteInput,
  VoteOrUnvoteOutput,
} from './dtos/vote-or-unvote.dto';
import { Opinion } from './entities/opinion.entity';
import { AgendaRepository } from './agenda.repository';
import { GetMosteVotedAgendasOutput } from './dtos/get-most-voted-agendas';

@Injectable()
export class AgendaService {
  constructor(
    private readonly agendas: AgendaRepository,
    @InjectRepository(Opinion)
    private readonly opinions: Repository<Opinion>,
  ) {}

  async findAgendaById({
    id,
  }: FindAgendaByIdInput): Promise<FindAgendaByIdOutput> {
    try {
      const agenda = await this.agendas.findOne({
        where: { id },
        relations: ['author', 'opinions', 'opinions.votedUser'],
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
    { subject, seriousness, category, opinionA, opinionB }: CreateAgendaInput,
  ): Promise<CreateAgendaOutput> {
    try {
      const opinions = [
        this.opinions.create({ opinionText: opinionA, opinionType: true }),
        this.opinions.create({ opinionText: opinionB, opinionType: false }),
      ];
      const newAgenda = await this.agendas.save(
        this.agendas.create({
          subject,
          seriousness,
          category,
          opinions,
          author,
        }),
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
      const agenda = await this.agendas.findOne({
        relations: ['opinions', 'author', 'comments'],
        where: { id: agendaId },
      });
      if (!agenda) {
        return { ok: false, error: 'agenda does not exist.' };
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
        relations: ['opinions'],
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
        order: { createdAt: 'DESC' },
      });
      return {
        ok: true,
        agendas,
        totalPage: Math.ceil(count / PAGINATION_UNIT),
      };
    } catch (e) {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async getMostVotedAgendas(): Promise<GetMosteVotedAgendasOutput> {
    try {
      const ids = await this.agendas.getMostVotedAgendaId();
      const agendas = await this.agendas.find({
        relations: ['opinions', 'author'],
        where: { id: In(ids) },
      });
      if (!agendas) {
        return { ok: false, error: "Couldn't get agendas" };
      }
      return { ok: true, agendas };
    } catch {
      return { ok: false, error: 'interal server error' };
    }
  }

  async searchAgendasByCategory({
    page,
    category,
    query,
  }: SearchAgendasByCategoryInput): Promise<SearchAgendasByCategoryOutput> {
    try {
      const [agendas, count] = await this.agendas.findAndCount({
        relations: ['opinions', 'author'],
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
        where: { category, ...(query && { subject: ILike(`%${query}%`) }) },
        order: { createdAt: 'DESC' },
      });
      return {
        ok: true,
        agendas,
        totalPage: Math.ceil(count / PAGINATION_UNIT),
      };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async getMyAgendas(
    user: User,
    { page }: GetMyAgendasInput,
  ): Promise<GetmyAgendasOutput> {
    try {
      const [agendas, count] = await this.agendas.findAndCount({
        relations: ['opinions'],
        where: { author: { id: user.id } },
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
        order: { createdAt: 'DESC' },
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

  async getVotedOpinions(
    user: User,
    { page }: GetVotedOpinionsInput,
  ): Promise<GetVotedOpinionsOutput> {
    try {
      const [opinions, count] = await this.opinions.findAndCount({
        where: {
          votedUser: { id: user.id },
        },
        relations: ['agenda'],
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
      });
      return {
        ok: true,
        opinions,
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
        return { ok: false, error: 'Opinion with input id does not exist' };
      }
      if (otherOp.votedUserId.includes(authUser.id)) {
        return { ok: false, error: '이미 다른 의견에 투표했습니다.' };
      }
      if (votedOp.votedUserId.includes(authUser.id)) {
        votedOp.votedUser = votedOp.votedUser.filter((user) => {
          return user.id !== authUser.id;
        });
        votedOp.votedUserCount -= 1;
        this.opinions.save(votedOp);
        return {
          ok: true,
          message: '투표를 취소했습니다.',
          voteCount: votedOp.votedUserCount,
          voteId,
        };
      }
      votedOp.votedUser.push(authUser);
      votedOp.votedUserCount += 1;
      this.opinions.save(votedOp);
      return {
        ok: true,
        message: '투표에 성공했습니다.',
        voteCount: votedOp.votedUserCount,
        voteId,
      };
    } catch {
      return { ok: false, error: "Couldn't vote to opinion" };
    }
  }
}
