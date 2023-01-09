import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgendaService } from 'src/agenda/agenda.service';
import { PAGINATION_UNIT_COMMENTS } from 'src/common/common.constants';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateCommentsInput,
  CreateCommentsOutput,
} from './dtos/create-comments.dtos';
import {
  GetCommentsByAgendaInput,
  GetCommentsByAgendaOutput,
} from './dtos/get-comments-by-agenda.dto';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly comments: Repository<Comments>,

    private readonly agendaService: AgendaService,
  ) {}

  async findCommentsById(id: number): Promise<Comments> {
    return await this.comments.findOne({ where: { id } });
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
        const bundleExists = this.findCommentsById(bundleId);
        if (!bundleExists) {
          return { ok: false, error: 'No parents comment with bundleId' };
        }
      }
      const comments = await this.comments.save(
        this.comments.create({ agenda, author, content, bundleId }),
      );
      if (!comments.bundleId) {
        await this.comments.save({ id: comments.id, bundleId: comments.id });
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't create Comments" };
    }
  }

  async getCommentsByAgenda({
    agendaId,
    page,
  }: GetCommentsByAgendaInput): Promise<GetCommentsByAgendaOutput> {
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
      });
      return {
        ok: true,
        comments,
        totalPage: Math.ceil(count / PAGINATION_UNIT_COMMENTS),
      };
    } catch {
      return { ok: false, error: "Couldn't get comments" };
    }
  }
}
