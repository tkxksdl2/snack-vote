import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  MAINPAGE_AGENDAS_UNIT,
  PAGINATION_UNIT,
} from 'src/common/common.constants';
import { UserRole } from 'src/users/entities/user.entity';
import { expectCalledTimesAndWith } from 'test/hook/test-hook';
import { ILike, In, Not, Repository } from 'typeorm';
import { AgendaRepository } from './agenda.repository';
import { AgendaService } from './agenda.service';
import { Category } from './entities/agenda.entity';
import { Opinion } from './entities/opinion.entity';
import { Vote } from './entities/vote.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  findAgendaIdByRecentVoteCount: jest.fn(),
});

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  store: {
    keys: jest.fn(),
  },
};

const USER = {
  id: 1,
  email: 'email',
  role: UserRole.Client,
  name: 'name',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AgendaService', () => {
  let service: AgendaService;
  let agendaRepository: AgendaRepository;
  let opinionRepository: MockRepository<Opinion>;
  let voteRepository: MockRepository<Vote>;
  let voteCache: Cache;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        AgendaService,
        {
          provide: AgendaRepository,
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Opinion),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: mockRepository(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();
    service = module.get<AgendaService>(AgendaService);
    agendaRepository = module.get<AgendaRepository>(AgendaRepository);
    opinionRepository = module.get(getRepositoryToken(Opinion));
    voteRepository = module.get(getRepositoryToken(Vote));
    voteCache = module.get<Cache>(CACHE_MANAGER);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('findAgendaById', () => {
    const AGENDA_ID = 1;
    it('should fail if agenda not found', async () => {
      jest.spyOn(agendaRepository, 'findOne').mockResolvedValue(undefined);
      const result = await service.findAgendaById({ id: AGENDA_ID });
      expectCalledTimesAndWith(agendaRepository.findOne, 1, [
        {
          where: { id: AGENDA_ID },
          relations: [
            'author',
            'opinions',
            'opinions.vote',
            'opinions.vote.user',
          ],
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'Agenda with input id is not found',
      });
    });
    it('should return agenda', async () => {
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockImplementation(jest.fn().mockResolvedValue({ id: AGENDA_ID }));
      const result = await service.findAgendaById({ id: AGENDA_ID });
      expect(result).toMatchObject({ ok: true, agenda: { id: AGENDA_ID } });
    });
    it('should fail on exception', async () => {
      jest.spyOn(agendaRepository, 'findOne').mockRejectedValue(new Error());
      const result = await service.findAgendaById({ id: AGENDA_ID });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't find agenda",
      });
    });
  });

  describe('createAgenda', () => {
    const SUBJECT = 'subject';
    const CATEGORY = Category.Culture;
    const OPINION_A = 'A';
    const OPINION_B = 'B';
    const SERIOUSNESS = 5;
    it('should create agenda', async () => {
      opinionRepository.create.mockReturnValueOnce({
        opiniontext: OPINION_A,
        opinionType: true,
      });
      opinionRepository.create.mockReturnValueOnce({
        opiniontext: OPINION_B,
        opinionType: false,
      });
      jest.spyOn(agendaRepository, 'create').mockImplementation(
        jest.fn().mockReturnValue({
          opinions: [{ opiniontext: OPINION_A }, { opiniontext: OPINION_B }],
        }),
      );
      jest.spyOn(agendaRepository, 'save').mockImplementation(
        jest.fn().mockResolvedValue({
          subject: SUBJECT,
          opinions: [{ opiniontext: OPINION_A }, { opiniontext: OPINION_B }],
        }),
      );
      const result = await service.createAgenda(USER, {
        subject: SUBJECT,
        category: CATEGORY,
        opinionA: OPINION_A,
        opinionB: OPINION_B,
        seriousness: SERIOUSNESS,
      });
      expectCalledTimesAndWith(
        opinionRepository.create,
        2,
        [{ opinionText: OPINION_A, opinionType: true }],
        [{ opinionText: OPINION_B, opinionType: false }],
      );
      expectCalledTimesAndWith(agendaRepository.create, 1, [
        {
          subject: SUBJECT,
          seriousness: SERIOUSNESS,
          category: CATEGORY,
          opinions: [
            {
              opiniontext: OPINION_A,
              opinionType: true,
            },
            {
              opiniontext: OPINION_B,
              opinionType: false,
            },
          ],
          author: USER,
        },
      ]);
      expectCalledTimesAndWith(agendaRepository.save, 1, [
        {
          opinions: [{ opiniontext: OPINION_A }, { opiniontext: OPINION_B }],
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        result: {
          subject: SUBJECT,
          opinions: [{ opiniontext: OPINION_A }, { opiniontext: OPINION_B }],
        },
      });
    });
    it('should fail on exception', async () => {
      opinionRepository.create.mockImplementation(() => {
        throw new Error();
      });
      const result = await service.createAgenda(USER, {
        subject: SUBJECT,
        category: CATEGORY,
        opinionA: OPINION_A,
        opinionB: OPINION_B,
        seriousness: SERIOUSNESS,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't create Agenda",
      });
    });
  });

  describe('deleteAgenda', () => {
    const AGENDA_ID = 1;
    it('should fail if agenda not exist', async () => {
      jest.spyOn(agendaRepository, 'findOne').mockResolvedValue(undefined);
      const result = await service.deleteAgenda(USER, { agendaId: AGENDA_ID });
      expectCalledTimesAndWith(agendaRepository.findOne, 1, [
        {
          relations: ['opinions', 'author', 'comments'],
          where: { id: AGENDA_ID },
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'agenda does not exist.',
      });
    });
    it('should fail if author id does not match with user id', async () => {
      const WRONG_ID = 444;
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockImplementation(
          jest.fn().mockResolvedValue({ author: { id: WRONG_ID } }),
        );
      const result = await service.deleteAgenda(USER, { agendaId: AGENDA_ID });
      expect(result).toMatchObject({
        ok: false,
        error: "You don't have permission to delete this agenda",
      });
    });
    it('should soft-remove agenda', async () => {
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockImplementation(
          jest.fn().mockResolvedValue({ author: { id: USER.id } }),
        );
      const result = await service.deleteAgenda(USER, { agendaId: AGENDA_ID });
      expectCalledTimesAndWith(agendaRepository.softRemove, 1, [
        { author: { id: USER.id } },
      ]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail on exception', async () => {
      jest.spyOn(agendaRepository, 'findOne').mockRejectedValue(new Error());
      const result = await service.deleteAgenda(USER, { agendaId: AGENDA_ID });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't delete Agenda",
      });
    });
  });

  describe('getAllAgendas', () => {
    const PAGE = 1;
    const COUNT = 1;
    const AGENDAS = 'agendas';
    it('should get All Agendas', async () => {
      jest
        .spyOn(agendaRepository, 'findAndCount')
        .mockImplementation(jest.fn().mockResolvedValue([AGENDAS, COUNT]));
      const result = await service.getAllAgendas({ page: PAGE });
      expectCalledTimesAndWith(agendaRepository.findAndCount, 1, [
        {
          relations: ['opinions'],
          take: PAGINATION_UNIT,
          skip: PAGINATION_UNIT * (PAGE - 1),
          order: { createdAt: 'DESC' },
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        agendas: AGENDAS,
        totalPage: Math.ceil(COUNT / PAGINATION_UNIT),
      });
    });
    it('should fail on exception', async () => {
      jest
        .spyOn(agendaRepository, 'findAndCount')
        .mockRejectedValue(new Error());
      const result = await service.getAllAgendas({ page: PAGE });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('onModuleInit', () => {
    it('should call getMostVotedAgendas()', async () => {
      jest
        .spyOn(service, 'getMostVotedAgendas')
        .mockResolvedValue({ ok: true });
      await service.onModuleInit();
      expect(
        agendaRepository.findAgendaIdByRecentVoteCount,
      ).toHaveBeenCalledTimes(1);
      expect(service.getMostVotedAgendas).toHaveBeenCalledTimes(1);
    });
    it('should log fail if result not ok', async () => {
      const logSpy = jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
      jest
        .spyOn(service, 'getMostVotedAgendas')
        .mockResolvedValue({ ok: false });
      await service.onModuleInit();
      expect(logSpy).toHaveBeenCalledWith(
        'Cannot load initial most voted agendas',
        'AgendaService',
      );
    });
    it('should call internal error and console log it', async () => {
      const INTERNAL_ERROR = new Error('internal error');
      jest
        .spyOn(service, 'getMostVotedAgendas')
        .mockRejectedValueOnce(INTERNAL_ERROR);
      const logSpy = jest
        .spyOn(console, 'log')
        .mockImplementationOnce(jest.fn());
      await service.onModuleInit();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(INTERNAL_ERROR);
    });
  });

  describe('setMostVotedAgendas', () => {
    let logSpy;
    beforeEach(() => {
      logSpy = jest.spyOn(Logger, 'log').mockImplementation(jest.fn());
    });

    it('should renew mostVotedAgendas', async () => {
      jest.spyOn(voteCache.store, 'keys').mockResolvedValue(['1', '2', '3']);
      jest.spyOn(voteCache, 'get').mockResolvedValueOnce(1);
      jest.spyOn(voteCache, 'get').mockResolvedValueOnce(2);
      jest.spyOn(voteCache, 'get').mockResolvedValueOnce(2);
      jest
        .spyOn(service, 'getMostVotedAgendas')
        .mockImplementationOnce(
          jest
            .fn()
            .mockResolvedValue({ ok: true, agendas: [{ id: 2 }, { id: 1 }] }),
        );
      await service.setMostVotedAgendas();
      expect(voteCache.store.keys).toHaveBeenCalledTimes(1);
      expect(voteCache.get).toHaveBeenCalledTimes(3);
      expect(service.getMostVotedAgendas).toHaveBeenCalledWith([2, 1]);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        'Renew most voted agendas',
        'AgendaService',
      );
      expect(service.getMostVotedAgendasValue()).toEqual([
        { id: 2 },
        { id: 1 },
      ]);
    });
    it('should log fail if ok is false', async () => {
      await service.setMostVotedAgendas();
      expectCalledTimesAndWith(
        logSpy,
        2,
        ['Renew most voted agendas', 'AgendaService'],
        ['Renew has failed', 'AgendaService'],
      );
    });
    it('should fail on exception', async () => {
      const e = new Error();
      jest.spyOn(voteCache.store, 'keys').mockRejectedValue(e);
      await service.setMostVotedAgendas();
      expect(logSpy).toHaveBeenCalledWith(e);
    });
  });

  describe('getMostVotedAgendas', () => {
    const MOST_VOTED_IDS = [1];
    it('should fail if agenda not found', async () => {
      jest.spyOn(agendaRepository, 'find').mockResolvedValue(undefined);
      const result = await service.getMostVotedAgendas(MOST_VOTED_IDS);
      expectCalledTimesAndWith(agendaRepository.find, 1, [
        {
          relations: ['opinions', 'author', 'opinions.vote'],
          where: { id: In(MOST_VOTED_IDS) },
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't get agendas",
      });
    });
    it('should fill top agendas until length 6 and return it', async () => {
      const AGENDAS = [{ id: 1 }];
      const SUB_AGENDAS = [{ id: 2 }];
      jest
        .spyOn(agendaRepository, 'find')
        .mockImplementationOnce(jest.fn().mockResolvedValue(AGENDAS));
      jest
        .spyOn(agendaRepository, 'find')
        .mockImplementationOnce(jest.fn().mockResolvedValue(SUB_AGENDAS));
      const result = await service.getMostVotedAgendas(MOST_VOTED_IDS);
      expectCalledTimesAndWith(
        agendaRepository.find,
        2,
        [
          {
            relations: ['opinions', 'author', 'opinions.vote'],
            where: { id: In(MOST_VOTED_IDS) },
          },
        ],
        [
          {
            relations: ['opinions', 'author', 'opinions.vote'],
            where: { id: Not(In(MOST_VOTED_IDS)) },
            take: MAINPAGE_AGENDAS_UNIT - AGENDAS.length,
            order: { createdAt: 'DESC' },
          },
        ],
      );
      expect(result).toMatchObject({
        ok: true,
        agendas: AGENDAS.concat(SUB_AGENDAS),
      });
    });
    it('should fail on exception', async () => {
      jest.spyOn(agendaRepository, 'find').mockRejectedValue(new Error());
      const result = await service.getMostVotedAgendas(MOST_VOTED_IDS);
      expect(result).toMatchObject({
        ok: false,
        error: 'interal server error',
      });
    });
  });

  describe('searchAgendasByCategory', () => {
    const PAGE = 1;
    const CATEGORY = Category.Culture;
    const QUERY = 'query';
    const AGENDAS = 'agendas';
    const COUNT = 2;
    it('should search agendas', async () => {
      jest
        .spyOn(agendaRepository, 'findAndCount')
        .mockImplementation(jest.fn().mockResolvedValue([AGENDAS, COUNT]));
      const result = await service.searchAgendasByCategory({
        page: PAGE,
        category: CATEGORY,
        query: QUERY,
      });
      expectCalledTimesAndWith(agendaRepository.findAndCount, 1, [
        {
          relations: ['opinions', 'author'],
          take: PAGINATION_UNIT,
          skip: PAGINATION_UNIT * (PAGE - 1),
          where: {
            category: CATEGORY,
            ...(QUERY && { subject: ILike(`%${QUERY}%`) }),
          },
          order: { createdAt: 'DESC' },
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        agendas: AGENDAS,
        totalPage: Math.ceil(COUNT / PAGINATION_UNIT),
      });
    });
    it('should fail on exception', async () => {
      jest
        .spyOn(agendaRepository, 'findAndCount')
        .mockRejectedValue(new Error());
      const result = await service.searchAgendasByCategory({
        page: PAGE,
        category: CATEGORY,
        query: QUERY,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('getMyAgendas', () => {
    const PAGE = 1;
    const AGENDAS = 'agendas';
    const COUNT = 2;
    it('shuld get agendas', async () => {
      jest
        .spyOn(agendaRepository, 'findAndCount')
        .mockImplementation(jest.fn().mockResolvedValue([AGENDAS, COUNT]));
      const result = await service.getMyAgendas(USER, { page: PAGE });
      expectCalledTimesAndWith(agendaRepository.findAndCount, 1, [
        {
          relations: ['opinions'],
          where: { author: { id: USER.id } },
          take: PAGINATION_UNIT,
          skip: PAGINATION_UNIT * (PAGE - 1),
          order: { createdAt: 'DESC' },
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        agendas: AGENDAS,
        totalPage: Math.ceil(COUNT / PAGINATION_UNIT),
      });
    });
    it('should fail on exception', async () => {
      jest
        .spyOn(agendaRepository, 'findAndCount')
        .mockRejectedValue(new Error());
      const result = await service.getMyAgendas(USER, { page: PAGE });
      expect(result).toMatchObject({
        ok: false,
        error: "Coundn't get your agendas",
      });
    });
  });

  describe('getVotedOpinions', () => {
    const PAGE = 1;
    const OPINIONS = ['opinion'];
    const COUNT = 1;
    it('should return voted opinion', async () => {
      opinionRepository.findAndCount.mockResolvedValue([OPINIONS, COUNT]);
      const result = await service.getVotedOpinions(USER, { page: PAGE });
      expectCalledTimesAndWith(opinionRepository.findAndCount, 1, [
        {
          where: {
            vote: { user: { id: USER.id } },
          },
          relations: ['agenda'],
          take: PAGINATION_UNIT,
          skip: PAGINATION_UNIT * (PAGE - 1),
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        opinions: OPINIONS,
        totalPage: Math.ceil(COUNT / PAGINATION_UNIT),
      });
    });
    it('should fail on exception', async () => {
      opinionRepository.findAndCount.mockRejectedValue(new Error());
      const result = await service.getVotedOpinions(USER, { page: PAGE });
      expect(result).toMatchObject({
        ok: false,
        error: "Coundn't get you voted agendas",
      });
    });
  });

  describe('voteOrUnvote', () => {
    const VOTE_OP_ID = 1;
    const OTHER_OP_ID = 2;
    const VOTE_ID = 3;
    const AGENDA_ID = 4;
    it('should fail if opinion not found', async () => {
      opinionRepository.findOne.mockResolvedValue(undefined);
      const result = await service.voteOrUnvote(USER, {
        agendaId: AGENDA_ID,
        voteOpinionId: VOTE_OP_ID,
        otherOpinionId: OTHER_OP_ID,
      });
      expectCalledTimesAndWith(opinionRepository.findOne, 1, [
        {
          where: { id: VOTE_OP_ID },
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: '투표하려는 의견은 존재하지 않습니다.',
      });
    });
    it('should fail if user already voted other opinion', async () => {
      opinionRepository.findOne.mockResolvedValueOnce({
        votedUserCount: 1,
      });
      voteRepository.findOne.mockResolvedValueOnce(undefined);
      voteRepository.findOne.mockResolvedValueOnce({ id: VOTE_ID });
      const result = await service.voteOrUnvote(USER, {
        agendaId: AGENDA_ID,
        voteOpinionId: VOTE_OP_ID,
        otherOpinionId: OTHER_OP_ID,
      });
      expectCalledTimesAndWith(
        voteRepository.findOne,
        2,
        [
          {
            where: {
              user: { id: USER.id },
              opinion: { id: VOTE_OP_ID },
            },
          },
        ],
        [
          {
            where: {
              user: { id: USER.id },
              opinion: { id: OTHER_OP_ID },
            },
          },
        ],
      );
      expect(result).toMatchObject({
        ok: false,
        error: '이미 다른 의견에 투표했습니다.',
      });
    });
    it('should unvote to opinion', async () => {
      const VOTED_USER_COUNT = 1;
      opinionRepository.findOne.mockResolvedValueOnce({
        votedUserCount: VOTED_USER_COUNT,
      });
      voteRepository.findOne.mockResolvedValueOnce({ id: VOTE_ID });
      voteRepository.findOne.mockResolvedValueOnce(undefined);
      const result = await service.voteOrUnvote(USER, {
        agendaId: AGENDA_ID,
        voteOpinionId: VOTE_OP_ID,
        otherOpinionId: OTHER_OP_ID,
      });
      expectCalledTimesAndWith(voteRepository.remove, 1, [{ id: VOTE_ID }]);
      expectCalledTimesAndWith(opinionRepository.save, 1, [
        {
          votedUserCount: VOTED_USER_COUNT - 1,
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        message: '투표를 취소했습니다.',
        voteCount: VOTED_USER_COUNT - 1,
        opinionId: VOTE_OP_ID,
        voteId: VOTE_ID,
        resultType: 'unvote',
      });
    });
    it('should vote to opinion', async () => {
      const VOTED_USER_COUNT = 0;
      opinionRepository.findOne.mockResolvedValueOnce({
        votedUserCount: VOTED_USER_COUNT,
        opinionType: true,
      });
      voteRepository.findOne.mockResolvedValueOnce(undefined);
      voteRepository.findOne.mockResolvedValueOnce(undefined);
      voteRepository.create.mockReturnValue({ id: VOTE_ID });
      voteRepository.save.mockResolvedValue({ id: VOTE_ID });
      const result = await service.voteOrUnvote(USER, {
        agendaId: AGENDA_ID,
        voteOpinionId: VOTE_OP_ID,
        otherOpinionId: OTHER_OP_ID,
      });
      expectCalledTimesAndWith(opinionRepository.save, 1, [
        {
          votedUserCount: VOTED_USER_COUNT + 1,
          opinionType: true,
        },
      ]);
      expectCalledTimesAndWith(voteRepository.create, 1, [
        {
          user: USER,
          opinion: {
            votedUserCount: VOTED_USER_COUNT + 1,
            opinionType: true,
          },
        },
      ]);
      expectCalledTimesAndWith(voteRepository.save, 1, [{ id: VOTE_ID }]);
      expect(result).toMatchObject({
        ok: true,
        message: '투표에 성공했습니다.',
        voteCount: VOTED_USER_COUNT + 1,
        opinionId: VOTE_OP_ID,
        voteId: VOTE_ID,
        opinionType: true,
        resultType: 'vote',
      });
    });
    it('should fail on exception', async () => {
      opinionRepository.findOne.mockRejectedValue(new Error());
      const result = await service.voteOrUnvote(USER, {
        agendaId: AGENDA_ID,
        voteOpinionId: VOTE_OP_ID,
        otherOpinionId: OTHER_OP_ID,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't vote to opinion",
      });
    });
  });
});
