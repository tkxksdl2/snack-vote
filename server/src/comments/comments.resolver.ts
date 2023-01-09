import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from './comments.service';
import {
  CreateCommentsInput,
  CreateCommentsOutput,
} from './dtos/create-comments.dtos';
import {
  GetCommentsByAgendaInput,
  GetCommentsByAgendaOutput,
} from './dtos/get-comments-by-agenda.dto';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query((returns) => GetCommentsByAgendaOutput)
  getCommentsByAgenda(
    @Args('input') getCommentsByAgendaInput: GetCommentsByAgendaInput,
  ): Promise<GetCommentsByAgendaOutput> {
    return this.commentsService.getCommentsByAgenda(getCommentsByAgendaInput);
  }

  @Role(['Any'])
  @Mutation((returns) => CreateCommentsOutput)
  createComments(
    @AuthUser() user: User,
    @Args('input') createCommentsInput: CreateCommentsInput,
  ): Promise<CreateCommentsOutput> {
    return this.commentsService.createComments(user, createCommentsInput);
  }
}
