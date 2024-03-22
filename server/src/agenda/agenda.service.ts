import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LRU_CACHE,
  MAINPAGE_AGENDAS_UNIT,
  PAGINATION_UNIT,
} from 'src/common/common.constants';
import { Sex, User, UserRole } from 'src/users/entities/user.entity';
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Transactional, runOnTransactionCommit } from 'nestjs-transaction';
import { LRUCache } from 'lru-cache';
import {
  AgendaDetailSummary,
  GetAgendaAndStatsByIdInput,
  GetAgendaAndStatsByIdOutput,
} from './dtos/get-agenda-and-stats-by-id.dto';
import { AgendaDetailSummaryFactory } from './classes/agenda-detail-summary-factory';
import {
  FindAgendaAndAllVotesByIdInput,
  FindAgendaAndAllVotesByIdOutput,
} from './dtos/find-agenda-and-all-votes-by-id.dto';

@Injectable()
export class AgendaService implements OnModuleInit {
  constructor(
    private readonly agendas: AgendaRepository,
    @InjectRepository(Opinion)
    private readonly opinions: Repository<Opinion>,
    @InjectRepository(Vote)
    private readonly votes: Repository<Vote>,
    @Inject(CACHE_MANAGER)
    private readonly voteCache: Cache,
    @Inject(LRU_CACHE)
    private readonly lruCache: LRUCache<number, AgendaDetailSummary>,
  ) {}

  private mostVotedAgendas: Agenda[];

  async onModuleInit() {
    try {
      const ids = await this.agendas.findAgendaIdByRecentVoteCount();
      const result = await this.getMostVotedAgendas(ids);
      if (result.ok) this.mostVotedAgendas = result.agendas;
      else
        Logger.log('Cannot load initial most voted agendas', 'AgendaService');
    } catch (e) {
      Logger.error(e);
    }
  }

  @Cron('*/30 * * * *')
  async setMostVotedAgendas() {
    try {
      const cacheKeys = await this.voteCache.store.keys();
      const resObj: { [key: string]: number } = {};
      for (const key of cacheKeys) {
        const agendaId = Number(await this.voteCache.get(key));
        resObj[agendaId] = resObj[agendaId] ? resObj[agendaId] + 1 : 1;
      }

      const result = await this.getMostVotedAgendas(
        Object.entries(resObj)
          .sort((a, b) => b[1] - a[1])
          .slice(0, MAINPAGE_AGENDAS_UNIT)
          .map((v) => +v[0]),
      );
      Logger.log('Renew most voted agendas', 'AgendaService');

      if (result.ok) {
        this.mostVotedAgendas = null;
        this.mostVotedAgendas = result.agendas;
      } else {
        Logger.log('Renew has failed', 'AgendaService');
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  getMostVotedAgendasValue() {
    return this.mostVotedAgendas;
  }

  async getAgendaAndStatsById({
    id,
    userId,
  }: GetAgendaAndStatsByIdInput): Promise<GetAgendaAndStatsByIdOutput> {
    try {
      let summary = this.lruCache.get(id);

      let isUserVotedOpinion: [boolean, boolean] = [false, false];

      if (!summary) {
        // 캐시 미스로 큰 쿼리 실행
        const result = await this.findAgendaAndAllVotesById({ id });
        if (!result.ok) return result;

        const factory = new AgendaDetailSummaryFactory(result.agenda, userId);

        summary = factory.makeSummary();
        isUserVotedOpinion = factory.getIsUserVotedOpinion();

        this.lruCache.set(id, summary);
      } else if (userId) {
        // 캐시 히트로 사용자 투표 여부만 판단함
        const opinions = summary.agenda.opinions;
        for (let i = 0; i <= 1; i++) {
          const exists = await this.findVoteByOpinionAndUser(
            userId,
            opinions[i].id,
          );
          if (exists) isUserVotedOpinion[i] = true;
        }
      }
      return { ok: true, agendaDetail: summary, isUserVotedOpinion };
    } catch (e) {
      return { ok: false, error: "Couldn't find agenda" };
    }
  }

  async findAgendaById({
    id,
  }: FindAgendaByIdInput): Promise<FindAgendaByIdOutput> {
    const agenda = await this.agendas.findOne({ where: { id } });
    if (agenda) return { ok: true, agenda };
    else return { ok: false, error: "couldn't find agenda" };
  }

  async findAgendaAndAllVotesById({
    id,
  }: FindAgendaAndAllVotesByIdInput): Promise<FindAgendaAndAllVotesByIdOutput> {
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

  async findVoteByOpinionAndUser(userId: number, opinionId: number) {
    return await this.votes.findOne({
      where: { user: { id: userId }, opinion: { id: opinionId } },
    });
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

  async getMostVotedAgendas(
    agenaIds: number[],
  ): Promise<GetMosteVotedAgendasOutput> {
    try {
      let agendas = await this.agendas.find({
        relations: ['opinions', 'author', 'opinions.vote'],
        where: { id: In(agenaIds) },
      });
      if (!agendas) {
        return { ok: false, error: "Couldn't get agendas" };
      }
      if (agendas.length < MAINPAGE_AGENDAS_UNIT) {
        const sub = await this.agendas.find({
          relations: ['opinions', 'author', 'opinions.vote'],
          where: { id: Not(In(agenaIds)) },
          take: MAINPAGE_AGENDAS_UNIT - agendas.length,
          order: { createdAt: 'DESC' },
        });
        agendas = agendas.concat(sub);
      }
      return { ok: true, agendas };
    } catch (e) {
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

  @Transactional()
  async voteOrUnvote(
    authUser: User,
    { agendaId, otherOpinionId, voteOpinionId }: VoteOrUnvoteInput,
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
        return await this.unvote(authUser, agendaId, votedOp, selectedOpVote);
      } else {
        return await this.vote(authUser, agendaId, votedOp);
      }
    } catch {
      return { ok: false, error: "Couldn't vote to opinion" };
    }
  }

  async unvote(
    authUser: User,
    agendaId: number,
    votedOp: Opinion,
    selectedOpVote: Vote,
  ): Promise<VoteOrUnvoteOutput> {
    await this.votes.remove(selectedOpVote);

    votedOp.votedUserCount -= 1;
    await this.opinions.save(votedOp);

    runOnTransactionCommit(async () => {
      await this.voteCache.del(
        `vote:user-${authUser.id}:opinion-${votedOp.id}`,
      );

      let summary = this.lruCache.get(agendaId);
      if (summary) {
        summary = AgendaDetailSummaryFactory.summaryAddVote(
          summary,
          authUser,
          votedOp,
          -1,
        );
      }

      this.lruCache.set(agendaId, summary);
    });

    return {
      ok: true,
      message: '투표를 취소했습니다.',
      voteCount: votedOp.votedUserCount,
      opinionId: votedOp.id,
      voteId: selectedOpVote.id,
      opinionType: votedOp.opinionType,
      resultType: 'unvote',
    };
  }

  async vote(
    authUser: User,
    agendaId: number,
    votedOp: Opinion,
  ): Promise<VoteOrUnvoteOutput> {
    votedOp.votedUserCount += 1;
    await this.opinions.save(votedOp);

    const newVote = await this.votes.save(
      this.votes.create({ user: authUser, opinion: votedOp }),
    );

    runOnTransactionCommit(async () => {
      this.voteCache.set(
        `vote:user-${authUser.id}:opinion-${votedOp.id}`,
        agendaId,
      );

      let summary = this.lruCache.get(agendaId);
      if (summary) {
        summary = AgendaDetailSummaryFactory.summaryAddVote(
          summary,
          authUser,
          votedOp,
          1,
        );
        this.lruCache.set(agendaId, summary);
      }
    });

    return {
      ok: true,
      message: '투표에 성공했습니다.',
      voteCount: votedOp.votedUserCount,
      opinionId: votedOp.id,
      voteId: newVote.id,
      opinionType: votedOp.opinionType,
      resultType: 'vote',
    };
  }
}
