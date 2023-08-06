import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_UNIT } from 'src/common/common.constants';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AddIssueContentInput,
  AddIssueContentOutput,
} from './dtos/add-issue-content.dto';
import { CreateIssueInput, CreateIssueOutput } from './dtos/create-issue.dto';
import { DeleteIssueContentInput } from './dtos/delete-issue-content.dto';
import { DeleteIssueInput, DeleteIssueOutput } from './dtos/delete-issue.dto';
import {
  GetAllIssuesInput,
  GetAllIssuesOutput,
} from './dtos/get-all-issues.dto';
import {
  GetIssueAndContentsByIdInput,
  GetIssueAndContentsByIdOutput,
} from './dtos/get-issue-and-contents-by-id.dto';
import {
  UpdateIssueContentInput,
  UpdateIssueContentOutput,
} from './dtos/update-issue-content.dto';
import { IssueContent } from './entities/issue-content.entity';
import { Issue } from './entities/issue.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issues: Repository<Issue>,
    @InjectRepository(IssueContent)
    private readonly issueContents: Repository<IssueContent>,
  ) {}

  async getAllIssues({ page }: GetAllIssuesInput): Promise<GetAllIssuesOutput> {
    try {
      const [issues, count] = await this.issues.findAndCount({
        relations: ['author'],
        take: PAGINATION_UNIT,
        skip: PAGINATION_UNIT * (page - 1),
        order: { createdAt: 'DESC' },
      });
      if (!issues) return { ok: false, error: 'Issue가 존재하지 않습니다.' };
      return {
        ok: true,
        issues,
        totalPage: Math.ceil(count / PAGINATION_UNIT),
      };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async getIssueAndContentsById(
    user: User,
    { issueId }: GetIssueAndContentsByIdInput,
  ): Promise<GetIssueAndContentsByIdOutput> {
    try {
      const issue = await this.issues.findOne({
        where: { id: issueId },
        relations: ['author', 'issueContents', 'issueContents.author'],
        withDeleted: true,
        order: { createdAt: 'DESC' },
      });
      if (!issue) return { ok: false, error: 'Issue가 존재하지 않습니다.' };
      if (!user || user.role !== UserRole.Admin) {
        issue.issueContents = issue.issueContents.map((issueContent) => {
          return issueContent.deletedAt
            ? { ...issueContent, content: '삭제된 글입니다.' }
            : issueContent;
        });
      }
      return {
        ok: true,
        issue,
      };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async createIssue(
    author: User,
    { subject, content }: CreateIssueInput,
  ): Promise<CreateIssueOutput> {
    try {
      const firstContent = this.issueContents.create({ content, author });
      const result = await this.issues.save(
        this.issues.create({
          subject,
          author,
          issueContents: [firstContent],
        }),
      );
      return { ok: true, result };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async addIssueContent(
    author: User,
    { content, issueId }: AddIssueContentInput,
  ): Promise<AddIssueContentOutput> {
    try {
      let issue = await this.issues.findOne({ where: { id: issueId } });
      if (!issue) return { ok: false, error: 'Issue가 존재하지 않습니다.' };

      if (author.role === UserRole.Admin) issue = { ...issue, hasAnswer: true };
      const result = await this.issueContents.save(
        this.issueContents.create({
          content,
          author,
          issue,
        }),
      );
      await this.issues.save({
        ...issue,
        contentCount: issue.contentCount + 1,
      });
      return { ok: true, result };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async updateIssueContent(
    author: User,
    { content, issueContentId }: UpdateIssueContentInput,
  ): Promise<UpdateIssueContentOutput> {
    try {
      const issueContent = await this.issueContents.findOne({
        where: { id: issueContentId },
        relations: ['author'],
      });
      if (!issueContent)
        return { ok: false, error: 'IssueContent가 존재하지 않습니다.' };
      if (issueContent.author.id !== author.id)
        return { ok: false, error: '해당 content를 수정할 권한이 없습니다.' };

      const result = await this.issueContents.save({
        ...issueContent,
        content,
      });
      return { ok: true, result };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async deleteIssue(
    user: User,
    { issueId }: DeleteIssueInput,
  ): Promise<DeleteIssueOutput> {
    try {
      const issue = await this.issues.findOne({
        where: { id: issueId },
        relations: ['author'],
      });
      if (!issue) return { ok: false, error: 'Issue가 존재하지 않습니다.' };
      if (user.role !== UserRole.Admin && issue.author.id !== user.id)
        return { ok: false, error: '해당 글을 삭제할 권한이 없습니다.' };

      await this.issues.remove(issue);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }

  async deleteIssueContent(
    user: User,
    { issueContentId }: DeleteIssueContentInput,
  ): Promise<DeleteIssueOutput> {
    try {
      const issueContent = await this.issueContents.findOne({
        where: { id: issueContentId },
        relations: ['author'],
      });
      if (!issueContent)
        return { ok: false, error: 'IssueContent가 존재하지 않습니다.' };
      if (user.role !== UserRole.Admin && issueContent.author.id !== user.id)
        return { ok: false, error: '해당 content를 삭제할 권한이 없습니다.' };

      await this.issueContents.softRemove(issueContent);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Internal Server Error' };
    }
  }
}
