import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { IssueContent } from './entities/issue-content.entity';
import { Issue } from './entities/issue.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IssueService } from './issue.service';
import { expectCalledTimesAndWith } from 'test/hook/test-hook';
import { PAGINATION_UNIT } from 'src/common/common.constants';
import { UserRole } from 'src/users/entities/user.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
});

const TEST_CLIENT = {
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

const TEST_ADMIN = {
  ...TEST_CLIENT,
  id: 2,
  role: UserRole.Admin,
};

describe('IssueService', () => {
  let testIssueService: IssueService;
  let issues: MockRepository<Issue>;
  let issueContents: MockRepository<IssueContent>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        IssueService,
        {
          provide: getRepositoryToken(Issue),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(IssueContent),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    testIssueService = module.get<IssueService>(IssueService);
    issues = module.get(getRepositoryToken(Issue));
    issueContents = module.get(getRepositoryToken(IssueContent));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(testIssueService).toBeDefined();
  });

  describe('getAllIssues', () => {
    const TEST_ISSUES = [{ id: 1 }, 1];
    const PAGINATION_RES = [TEST_ISSUES, 1];
    it('should return Issues and page', async () => {
      issues.findAndCount.mockResolvedValueOnce(PAGINATION_RES);
      const result = await testIssueService.getAllIssues({ page: 1 });
      expectCalledTimesAndWith(issues.findAndCount, 1, [
        {
          relations: ['author'],
          take: PAGINATION_UNIT,
          skip: 0,
          order: { createdAt: 'DESC' },
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        issues: TEST_ISSUES,
        totalPage: 1,
      });
    });
    it('should fail if issue does not exist', async () => {
      issues.findAndCount.mockResolvedValueOnce([undefined, 1]);
      const result = await testIssueService.getAllIssues({ page: 1 });
      expect(result).toMatchObject({
        ok: false,
        error: 'Issue가 존재하지 않습니다.',
      });
    });
    it('should fail on exception', async () => {
      issues.findAndCount.mockRejectedValueOnce(new Error());
      const result = await testIssueService.getAllIssues({ page: 1 });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('getIssueAndContentsById', () => {
    const ISSUE_ID = 1;
    const ISSUE_WITH_CONTENTS = {
      issueContents: [
        { content: 'content', deletedAt: '1234' },
        { content: 'content' },
      ],
    };
    it('should get issues and contents (client censored)', async () => {
      issues.findOne.mockResolvedValueOnce(ISSUE_WITH_CONTENTS);
      const result = await testIssueService.getIssueAndContentsById(
        TEST_CLIENT,
        {
          issueId: ISSUE_ID,
        },
      );
      expectCalledTimesAndWith(issues.findOne, 1, [
        {
          where: { id: ISSUE_ID },
          relations: ['author', 'issueContents', 'issueContents.author'],
          withDeleted: true,
          order: { createdAt: 'DESC' },
        },
      ]);
      expect(result).toMatchObject({
        ok: true,
        issue: {
          issueContents: [
            { content: '삭제된 글입니다.', deletedAt: '1234' },
            { content: 'content' },
          ],
        },
      });
    });
    it('should get issues and contents (admin withdeleted)', async () => {
      issues.findOne.mockResolvedValueOnce(ISSUE_WITH_CONTENTS);
      const result = await testIssueService.getIssueAndContentsById(
        TEST_ADMIN,
        {
          issueId: ISSUE_ID,
        },
      );
      expect(result).toMatchObject({
        ok: true,
        issue: ISSUE_WITH_CONTENTS,
      });
    });
    it('should fail if issue does not exist', async () => {
      issues.findOne.mockResolvedValueOnce(undefined);
      const result = await testIssueService.getIssueAndContentsById(
        TEST_CLIENT,
        { issueId: 1 },
      );
      expect(result).toMatchObject({
        ok: false,
        error: 'Issue가 존재하지 않습니다.',
      });
    });
    it('should fail on exception', async () => {
      issues.findOne.mockRejectedValueOnce(new Error());
      const result = await testIssueService.getIssueAndContentsById(
        TEST_CLIENT,
        { issueId: 1 },
      );
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('createIssue', () => {
    const [SUBJECT, CONTENT] = ['subject', 'content'];
    const ISSUE_CONTENT = {
      content: CONTENT,
      author: TEST_CLIENT,
    };
    const NEW_ISSUE = {
      subject: SUBJECT,
      author: TEST_CLIENT,
      issueContents: [ISSUE_CONTENT],
    };
    it('should create Issue', async () => {
      issueContents.create.mockReturnValueOnce(ISSUE_CONTENT);
      issues.create.mockReturnValueOnce(NEW_ISSUE);
      issues.save.mockResolvedValueOnce(NEW_ISSUE);
      const result = await testIssueService.createIssue(TEST_CLIENT, {
        subject: SUBJECT,
        content: CONTENT,
      });
      expectCalledTimesAndWith(issueContents.create, 1, [ISSUE_CONTENT]);
      expectCalledTimesAndWith(issues.create, 1, [NEW_ISSUE]);
      expectCalledTimesAndWith(issues.save, 1, [NEW_ISSUE]);
      expect(result).toMatchObject({ ok: true, result: NEW_ISSUE });
    });
    it('should fail on exception', async () => {
      issues.save.mockRejectedValueOnce(new Error());
      const result = await testIssueService.createIssue(TEST_CLIENT, {
        subject: SUBJECT,
        content: CONTENT,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('addIssueContent', () => {
    const ISSUE = {
      contentCount: 0,
      hasAnswer: false,
    };
    const ISSUE_CONTENT = { id: 1 };
    it('should add IssueContent (Admin hasAnswer)', async () => {
      issues.findOne.mockResolvedValueOnce(ISSUE);
      issueContents.create.mockReturnValueOnce(ISSUE_CONTENT);
      issueContents.save.mockResolvedValueOnce(ISSUE_CONTENT);
      const result = await testIssueService.addIssueContent(TEST_ADMIN, {
        content: 'content',
        issueId: 1,
      });
      issues.save.mockResolvedValueOnce({
        contentCount: ISSUE.contentCount + 1,
        hasAnswer: true,
      });
      expectCalledTimesAndWith(issues.findOne, 1, [{ where: { id: 1 } }]);
      expectCalledTimesAndWith(issues.save, 1, [
        {
          contentCount: ISSUE.contentCount + 1,
          hasAnswer: true,
        },
      ]);
      expectCalledTimesAndWith(issueContents.create, 1, [
        {
          content: 'content',
          author: TEST_ADMIN,
          issue: { ...ISSUE, hasAnswer: true },
        },
      ]);
      expectCalledTimesAndWith(issueContents.save, 1, [ISSUE_CONTENT]);
      expect(result).toMatchObject({ ok: true, result: ISSUE_CONTENT });
    });
    it('should fail issue fail if issue does not exist', async () => {
      issues.findOne.mockResolvedValueOnce(undefined);
      const result = await testIssueService.addIssueContent(TEST_ADMIN, {
        content: 'content',
        issueId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Issue가 존재하지 않습니다.',
      });
    });
    it('should fail on exception', async () => {
      issues.findOne.mockRejectedValueOnce(new Error());
      const result = await testIssueService.addIssueContent(TEST_ADMIN, {
        content: 'content',
        issueId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('updateIssueContent', () => {
    const ISSUE_CONTENT = {
      author: { id: TEST_ADMIN.id },
      content: 'old',
    };
    it('should update IssueContent', async () => {
      issueContents.findOne.mockResolvedValueOnce(ISSUE_CONTENT);
      issueContents.save.mockResolvedValueOnce({ content: 'new' });
      const result = await testIssueService.updateIssueContent(TEST_ADMIN, {
        content: 'new',
        issueContentId: 1,
      });
      expectCalledTimesAndWith(issueContents.findOne, 1, [
        {
          where: { id: 1 },
          relations: ['author'],
        },
      ]);
      expectCalledTimesAndWith(issueContents.save, 1, [
        {
          ...ISSUE_CONTENT,
          content: 'new',
        },
      ]);
      expect(result).toMatchObject({ ok: true, result: { content: 'new' } });
    });
    it('should fail if IssueContnet does not exists', async () => {
      issueContents.findOne.mockResolvedValueOnce(undefined);
      const result = await testIssueService.updateIssueContent(TEST_ADMIN, {
        content: 'new',
        issueContentId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'IssueContent가 존재하지 않습니다.',
      });
    });
    it('should fail User id not match to author', async () => {
      issueContents.findOne.mockResolvedValueOnce({
        author: { id: 9999 },
      });
      issueContents.save.mockResolvedValueOnce({ content: 'new' });
      const result = await testIssueService.updateIssueContent(TEST_ADMIN, {
        content: 'new',
        issueContentId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: '해당 content를 수정할 권한이 없습니다.',
      });
    });
    it('should fail on exception', async () => {
      issueContents.findOne.mockRejectedValueOnce(new Error());
      const result = await testIssueService.updateIssueContent(TEST_ADMIN, {
        content: 'new',
        issueContentId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('deleteIssue', () => {
    const ISSUE = { author: { id: TEST_CLIENT.id } };
    const ISSUE_ANOTHER = { author: { id: 999 } };
    it('should delete Issue', async () => {
      issues.findOne.mockResolvedValueOnce(ISSUE);
      const result = await testIssueService.deleteIssue(TEST_CLIENT, {
        issueId: 1,
      });
      expectCalledTimesAndWith(issues.findOne, 1, [
        {
          where: { id: 1 },
          relations: ['author'],
        },
      ]);
      expectCalledTimesAndWith(issues.remove, 1, [ISSUE]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail if Issue does not exists', async () => {
      issues.findOne.mockResolvedValueOnce(undefined);
      const result = await testIssueService.deleteIssue(TEST_CLIENT, {
        issueId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Issue가 존재하지 않습니다.',
      });
    });
    it('should fail if User does not hav permission', async () => {
      issues.findOne.mockResolvedValueOnce(ISSUE_ANOTHER);
      const result = await testIssueService.deleteIssue(TEST_CLIENT, {
        issueId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: '해당 글을 삭제할 권한이 없습니다.',
      });
    });
    it('should fail on exception', async () => {
      issues.findOne.mockRejectedValueOnce(new Error());
      const result = await testIssueService.deleteIssue(TEST_CLIENT, {
        issueId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });

  describe('deleteIssueContent', () => {
    const ISSUE_CONTENT = {
      id: 1,
      author: { id: TEST_ADMIN.id },
    };
    const ISSUE_CONTENT_ANOTER = {
      id: 1,
      author: { id: 999 },
    };
    it('should delete IssueContent', async () => {
      issueContents.findOne.mockResolvedValueOnce(ISSUE_CONTENT);
      const result = await testIssueService.deleteIssueContent(TEST_ADMIN, {
        issueContentId: 1,
      });
      expectCalledTimesAndWith(issueContents.findOne, 1, [
        {
          where: { id: 1 },
          relations: ['author'],
        },
      ]);
      expectCalledTimesAndWith(issueContents.softRemove, 1, [ISSUE_CONTENT]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail if IssueContent does not exists', async () => {
      issueContents.findOne.mockResolvedValueOnce(undefined);
      const result = await testIssueService.deleteIssueContent(TEST_ADMIN, {
        issueContentId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'IssueContent가 존재하지 않습니다.',
      });
    });
    it('should fail if User does not have permission', async () => {
      issueContents.findOne.mockResolvedValueOnce(ISSUE_CONTENT_ANOTER);
      const result = await testIssueService.deleteIssueContent(TEST_CLIENT, {
        issueContentId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: '해당 content를 삭제할 권한이 없습니다.',
      });
    });
    it('should fail on exception', async () => {
      issueContents.findOne.mockRejectedValueOnce(new Error());
      const result = await testIssueService.deleteIssueContent(TEST_CLIENT, {
        issueContentId: 1,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal Server Error',
      });
    });
  });
});
