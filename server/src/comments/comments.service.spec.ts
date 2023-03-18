import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AgendaService } from 'src/agenda/agenda.service';
import { Category } from 'src/agenda/entities/agenda.entity';
import { PAGINATION_UNIT_COMMENTS } from 'src/common/common.constants';
import { UserRole } from 'src/users/entities/user.entity';
import { expectCalledTimesAndWith } from 'test/hook/test-hook';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
});

const mockAgendaService = {
  findAgendaById: jest.fn(() => Promise.resolve({ id: 1 })),
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

describe('CommentsService', () => {
  let service: CommentsService;
  let agendaService: AgendaService;
  let commentRepository: MockRepository<Comments>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comments),
          useValue: mockRepository(),
        },
        {
          provide: AgendaService,
          useValue: mockAgendaService,
        },
      ],
    }).compile();
    service = module.get<CommentsService>(CommentsService);
    agendaService = module.get<AgendaService>(AgendaService);
    commentRepository = module.get(getRepositoryToken(Comments));
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCommentsById', () => {
    const ID = 1;
    it('should return comment', async () => {
      commentRepository.findOne.mockResolvedValue({ id: ID });
      const comment = await service.findCommentsById(ID);
      expectCalledTimesAndWith(commentRepository.findOne, 1, [
        {
          where: { id: ID },
          relations: ['author'],
        },
      ]);
      expect(comment).toMatchObject({ id: ID });
    });
  });
  describe('createComments', () => {
    const COMMENT_ID = 1;
    const AGENDA_ID = 2;
    const BUNDLE_ID = 3;
    const CONTENT = 'content';
    it('should fail if agenda not found', async () => {
      jest
        .spyOn(agendaService, 'findAgendaById')
        .mockResolvedValue({ ok: false, error: 'custom-error' });
      const result = await service.createComments(
        { ...USER },
        {
          agendaId: AGENDA_ID,
          bundleId: BUNDLE_ID,
          content: CONTENT,
        },
      );
      expectCalledTimesAndWith(agendaService.findAgendaById, 1, [
        { id: AGENDA_ID },
      ]);
      expect(result).toMatchObject({ ok: false, error: 'custom-error' });
    });

    beforeEach(() => {
      jest
        .spyOn(agendaService, 'findAgendaById')
        .mockImplementation(
          jest.fn().mockResolvedValue({ agenda: { id: AGENDA_ID }, ok: true }),
        );
    });

    it('should fail if bundle not exist', async () => {
      jest
        .spyOn(service, 'findCommentsById')
        .mockImplementationOnce(jest.fn().mockResolvedValue(undefined));
      const result = await service.createComments(
        { ...USER },
        {
          agendaId: AGENDA_ID,
          bundleId: BUNDLE_ID,
          content: CONTENT,
        },
      );
      expectCalledTimesAndWith(service.findCommentsById, 1, [BUNDLE_ID]);
      expect(result).toMatchObject({
        ok: false,
        error: 'No parents comment with bundleId',
      });
    });
    it('should create re-comment if input bundleId', async () => {
      const createCommentArgs = {
        agenda: { id: AGENDA_ID },
        author: { id: USER.id },
        content: CONTENT,
        bundleId: BUNDLE_ID,
      };
      jest
        .spyOn(service, 'findCommentsById')
        .mockImplementationOnce(jest.fn().mockResolvedValueOnce('exist'));
      commentRepository.create.mockReturnValue({ ...createCommentArgs });
      commentRepository.save.mockResolvedValue({ ...createCommentArgs });
      const result = await service.createComments(
        { ...USER },
        {
          agendaId: AGENDA_ID,
          bundleId: BUNDLE_ID,
          content: CONTENT,
        },
      );
      expectCalledTimesAndWith(commentRepository.create, 1, [
        {
          agenda: { id: AGENDA_ID },
          author: USER,
          content: CONTENT,
          bundleId: BUNDLE_ID,
        },
      ]);
      expectCalledTimesAndWith(commentRepository.save, 1, [
        { ...createCommentArgs },
      ]);
      expect(result).toMatchObject({
        ok: true,
        comments: { ...createCommentArgs },
      });
    });
    it('should create comment and save twice if no bundleId', async () => {
      const createCommentArgs = {
        agenda: { id: AGENDA_ID },
        author: { id: USER.id },
        content: CONTENT,
        bundleId: undefined,
      };
      jest
        .spyOn(service, 'findCommentsById')
        .mockImplementationOnce(jest.fn().mockResolvedValueOnce('exist'));
      commentRepository.create.mockReturnValue({ ...createCommentArgs });
      commentRepository.save.mockResolvedValueOnce({
        id: COMMENT_ID,
        ...createCommentArgs,
      });
      commentRepository.save.mockResolvedValueOnce({
        id: COMMENT_ID,
        bundleId: COMMENT_ID,
        ...createCommentArgs,
      });
      const result = await service.createComments(
        { ...USER },
        {
          agendaId: AGENDA_ID,
          content: CONTENT,
        },
      );
      expectCalledTimesAndWith(
        commentRepository.save,
        2,
        [{ ...createCommentArgs }],
        [
          {
            id: COMMENT_ID,
            bundleId: COMMENT_ID,
          },
        ],
      );
      expect(result).toMatchObject({
        ok: true,
        comments: {
          ...createCommentArgs,
          id: COMMENT_ID,
          bundleId: COMMENT_ID,
        },
      });
    });
    it('should faild on exception', async () => {
      jest
        .spyOn(agendaService, 'findAgendaById')
        .mockRejectedValue(new Error());
      const result = await service.createComments(
        { ...USER },
        {
          agendaId: AGENDA_ID,
          content: CONTENT,
        },
      );
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't create Comments",
      });
    });
  });
  describe('getCommentsByAgenda', () => {
    const AGENDA_ID = 1;
    const COUNT = 20;
    const CONTENT = 'content';
    const PAGE = 2;
    const DELEATED_AT = new Date();
    it('should fail if agenda not found', async () => {
      jest
        .spyOn(agendaService, 'findAgendaById')
        .mockImplementation(
          jest.fn().mockResolvedValue({ ok: false, error: 'custom-error' }),
        );
      const result = await service.getCommentsByAgenda(USER, {
        agendaId: AGENDA_ID,
        page: PAGE,
      });
      expectCalledTimesAndWith(agendaService.findAgendaById, 1, [
        { id: AGENDA_ID },
      ]);
      expect(result).toMatchObject({ ok: false, error: 'custom-error' });
    });
    it('should get comments and hide deleted comment', async () => {
      jest
        .spyOn(agendaService, 'findAgendaById')
        .mockImplementation(jest.fn().mockResolvedValue({ ok: true }));
      commentRepository.findAndCount.mockResolvedValue([
        [
          { id: 1, deletedAt: null, content: CONTENT },
          { id: 2, deletedAt: DELEATED_AT, content: CONTENT },
        ],
        COUNT,
      ]);
      const result = await service.getCommentsByAgenda(USER, {
        agendaId: AGENDA_ID,
        page: PAGE,
      });
      expectCalledTimesAndWith(commentRepository.findAndCount, 1, [
        {
          relations: { author: true },
          where: { agenda: { id: AGENDA_ID } },
          order: { bundleId: 'ASC', createdAt: 'ASC' },
          take: PAGINATION_UNIT_COMMENTS,
          skip: PAGINATION_UNIT_COMMENTS * (PAGE - 1),
          withDeleted: true,
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        comments: [
          { id: 1, deletedAt: null, content: CONTENT },
          { id: 2, deletedAt: DELEATED_AT, content: '삭제된 댓글입니다.' },
        ],
        totalPage: Math.ceil(COUNT / PAGINATION_UNIT_COMMENTS),
      });
    });
    it('should fail on exception', async () => {
      jest
        .spyOn(agendaService, 'findAgendaById')
        .mockRejectedValue(new Error());
      const result = await service.getCommentsByAgenda(USER, {
        agendaId: AGENDA_ID,
        page: PAGE,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't get comments",
      });
    });
  });
  describe('getMyComments', () => {
    const PAGE = 1;
    const COUNT = 10;
    const MY_COMMENTS = [{ id: 1 }];
    it('should return comments', async () => {
      commentRepository.findAndCount.mockResolvedValue([MY_COMMENTS, COUNT]);
      const result = await service.getMyComments(USER, { page: PAGE });
      expectCalledTimesAndWith(commentRepository.findAndCount, 1, [
        {
          relations: ['agenda'],
          where: { author: { id: USER.id } },
          order: { createdAt: 'DESC' },
          take: PAGINATION_UNIT_COMMENTS,
          skip: PAGINATION_UNIT_COMMENTS * (PAGE - 1),
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        comments: MY_COMMENTS,
        totalPage: Math.ceil(COUNT / PAGINATION_UNIT_COMMENTS),
      });
    });
    it('should fail on exception', async () => {
      commentRepository.findAndCount.mockRejectedValue(new Error());
      const result = await service.getMyComments(USER, { page: PAGE });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't get my comments.",
      });
    });
  });
  describe('deleteComments', () => {
    const COMMENT_ID = 1;
    const DIFF_USER_ID = 4444;
    it('should fail if comment not exists', async () => {
      jest.spyOn(service, 'findCommentsById').mockResolvedValue(undefined);
      const result = await service.deleteComments(USER, {
        commentsId: COMMENT_ID,
      });
      expectCalledTimesAndWith(service.findCommentsById, 1, [COMMENT_ID]);
      expect(result).toMatchObject({
        ok: false,
        error: 'Comment with input id does not exist.',
      });
    });
    it('should fail if author id not match', async () => {
      jest
        .spyOn(service, 'findCommentsById')
        .mockImplementation(
          jest.fn().mockResolvedValue({ author: { id: DIFF_USER_ID } }),
        );
      const result = await service.deleteComments(USER, {
        commentsId: COMMENT_ID,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "You can't delete comment not yours.",
      });
    });
    it('should soft-remove comment', async () => {
      jest
        .spyOn(service, 'findCommentsById')
        .mockImplementation(
          jest.fn().mockResolvedValue({ author: { id: USER.id } }),
        );
      const result = await service.deleteComments(USER, {
        commentsId: COMMENT_ID,
      });
      expectCalledTimesAndWith(commentRepository.softDelete, 1, [
        { id: COMMENT_ID },
      ]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail on exception', async () => {
      jest.spyOn(service, 'findCommentsById').mockRejectedValue(new Error());
      const result = await service.deleteComments(USER, {
        commentsId: COMMENT_ID,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "Coudn't delete a Comment",
      });
    });
  });
});
