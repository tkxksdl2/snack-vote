import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgendaService } from 'src/agenda/agenda.service';
import { PAGINATION_UNIT_COMMENTS } from 'src/common/common.constants';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateCommentsInput,
  CreateCommentsOutput,
} from './dtos/create-comments.dto';
import {
  DeleteCommentsInput,
  DeleteCommentsOutput,
} from './dtos/delete-comments.dto';
import {
  GetCommentsByAgendaInput,
  GetCommentsByAgendaOutput,
} from './dtos/get-comments-by-agenda.dto';
import {
  GetMyCommentsInput,
  GetMyCommentsOutput,
} from './dtos/get-my-comments';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly comments: Repository<Comments>,

    private readonly agendaService: AgendaService,
  ) {}

  async findCommentsById(id: number): Promise<Comments> {
    return await this.comments.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async createComments(
    author: User,
    { agendaId, bundleId, content }: CreateCommentsInput,
  ): Promise<CreateCommentsOutput> {
    try {
      const { agenda, ok, error } = await this.agendaService.findAgendaById({
        id: agendaId,
      });
      if (!ok) {
        return { ok, error };
      }
      if (bundleId) {
        const bundleExists = await this.findCommentsById(bundleId);
        if (!bundleExists) {
          return { ok: false, error: 'No parents comment with bundleId' };
        }
      }
      const comments = await this.comments.save(
        this.comments.create({ agenda, author, content, bundleId }),
      );
      if (!comments.bundleId) {
        comments.bundleId = comments.id;
        await this.comments.save({
          id: comments.id,
          bundleId: comments.id,
        });
      }
      return { ok: true, comments };
    } catch {
      return { ok: false, error: "Couldn't create Comments" };
    }
  }

  async getCommentsByAgenda(
    user: User,
    { agendaId, page }: GetCommentsByAgendaInput,
  ): Promise<GetCommentsByAgendaOutput> {
    try {
      const { ok, error } = await this.agendaService.findAgendaById({
        id: agendaId,
      });
      if (!ok) {
        return { ok, error };
      }
      const [comments, count] = await this.comments.findAndCount({
        relations: { author: true },
        where: { agenda: { id: agendaId } },
        order: { bundleId: 'ASC', createdAt: 'ASC' },
        take: PAGINATION_UNIT_COMMENTS,
        skip: PAGINATION_UNIT_COMMENTS * (page - 1),
        withDeleted: true,
      });
      if (!user || user.role !== UserRole.Admin) {
        comments.forEach((comment) => {
          if (comment.deletedAt) {
            comment.content = '삭제된 댓글입니다.';
          }
        });
      }
      return {
        ok: true,
        comments,
        totalPage: Math.ceil(count / PAGINATION_UNIT_COMMENTS),
      };
    } catch {
      return { ok: false, error: "Couldn't get comments" };
    }
  }

  async getMyComments(
    user: User,
    { page }: GetMyCommentsInput,
  ): Promise<GetMyCommentsOutput> {
    try {
      const [myComments, count] = await this.comments.findAndCount({
        relations: ['agenda'],
        where: { author: { id: user.id } },
        order: { createdAt: 'DESC' },
        take: PAGINATION_UNIT_COMMENTS,
        skip: PAGINATION_UNIT_COMMENTS * (page - 1),
      });
      return {
        ok: true,
        comments: myComments,
        totalPage: Math.ceil(count / PAGINATION_UNIT_COMMENTS),
      };
    } catch {
      return { ok: false, error: "Couldn't get my comments." };
    }
  }

  async deleteComments(
    user: User,
    { commentsId }: DeleteCommentsInput,
  ): Promise<DeleteCommentsOutput> {
    try {
      const comment = await this.findCommentsById(commentsId);
      if (!comment) {
        return { ok: false, error: 'Comment with input id does not exist.' };
      }
      if (comment.author.id !== user.id) {
        return { ok: false, error: "You can't delete comment not yours." };
      }
      this.comments.softDelete({ id: commentsId });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Coudn't delete a Comment" };
    }
  }
}
