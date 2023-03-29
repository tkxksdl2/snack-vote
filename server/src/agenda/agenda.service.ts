import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MAINPAGE_AGENDAS_UNIT,
  PAGINATION_UNIT,
} from 'src/common/common.constants';
import { User, UserRole } from 'src/users/entities/user.entity';
import { ILike, In, Not, Repository } from 'typeorm';
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
import { Vote } from './entities/vote.entity';
import { Agenda } from './entities/agenda.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AgendaService implements OnModuleInit {
  constructor(
    private readonly agendas: AgendaRepository,
    @InjectRepository(Opinion)
    private readonly opinions: Repository<Opinion>,
    @InjectRepository(Vote)
    private readonly votes: Repository<Vote>,
  ) {}

  private mostVotedAgendas: Agenda[];

  async onModuleInit() {
    await this.setMostVotedAgendas();
  }

  @Cron('*/30 * * * *')
  async setMostVotedAgendas() {
    const result = await this.getMostVotedAgendas();
    if (result.ok) {
      this.mostVotedAgendas = result.agendas;
    }
  }

  getMostVotedAgendasValue() {
    return this.mostVotedAgendas;
  }

  async findAgendaById({
    id,
  }: FindAgendaByIdInput): Promise<FindAgendaByIdOutput> {
    try {
      const agenda = await this.agendas.findOne({
        where: { id },
        relations: [
          'author',
          'opinions',
          'opinions.vote',
          'opinions.vote.user',
        ],
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
      const ids = await this.agendas.findAgendaIdByRecentVoteCount();
      let agendas = await this.agendas.find({
        relations: ['opinions', 'author', 'opinions.vote'],
        where: { id: In(ids) },
      });
      if (!agendas) {
        return { ok: false, error: "Couldn't get agendas" };
      }
      if (agendas.length < MAINPAGE_AGENDAS_UNIT) {
        const sub = await this.agendas.find({
          relations: ['opinions', 'author', 'opinions.vote'],
          where: { id: Not(In(ids)) },
          take: MAINPAGE_AGENDAS_UNIT - agendas.length,
          order: { createdAt: 'DESC' },
        });
        if (!sub) {
          return { ok: false, error: "Couldn't get agendas" };
        }
        agendas = agendas.concat(sub);
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
          vote: { user: { id: user.id } },
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
    { otherOpinionId, voteOpinionId }: VoteOrUnvoteInput,
  ): Promise<VoteOrUnvoteOutput> {
    try {
      const votedOp = await this.opinions.findOne({
        where: { id: voteOpinionId },
      });
      if (!votedOp) {
        return { ok: false, error: '투표하려는 의견은 존재하지 않습니다.' };
      }
      const selectedOpVote = await this.votes.findOne({
        where: { user: { id: authUser.id }, opinion: { id: voteOpinionId } },
      });
      const otherOpVote = await this.votes.findOne({
        where: { user: { id: authUser.id }, opinion: { id: otherOpinionId } },
      });
      if (otherOpVote) {
        return { ok: false, error: '이미 다른 의견에 투표했습니다.' };
      }
      if (selectedOpVote) {
        const voteId = selectedOpVote.id;
        await this.votes.remove(selectedOpVote);
        votedOp.votedUserCount -= 1;
        await this.opinions.save(votedOp);
        return {
          ok: true,
          message: '투표를 취소했습니다.',
          voteCount: votedOp.votedUserCount,
          opinionId: voteOpinionId,
          voteId,
          resultType: 'unvote',
        };
      }
      votedOp.votedUserCount += 1;
      await this.opinions.save(votedOp);
      const newVote = await this.votes.save(
        this.votes.create({ user: authUser, opinion: votedOp }),
      );
      return {
        ok: true,
        message: '투표에 성공했습니다.',
        voteCount: votedOp.votedUserCount,
        opinionId: voteOpinionId,
        voteId: newVote.id,
        opinionType: votedOp.opinionType,
        resultType: 'vote',
      };
    } catch {
      return { ok: false, error: "Couldn't vote to opinion" };
    }
  }
}
