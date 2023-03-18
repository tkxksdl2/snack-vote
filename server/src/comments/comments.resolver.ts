import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from './comments.service';
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

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Role(['Visitor', 'Any'])
  @Query((returns) => GetCommentsByAgendaOutput)
  getCommentsByAgenda(
    @AuthUser() user: User,
    @Args('input') getCommentsByAgendaInput: GetCommentsByAgendaInput,
  ): Promise<GetCommentsByAgendaOutput> {
    return this.commentsService.getCommentsByAgenda(
      user,
      getCommentsByAgendaInput,
    );
  }

  @Role(['Any'])
  @Mutation((returns) => CreateCommentsOutput)
  createComments(
    @AuthUser() user: User,
    @Args('input') createCommentsInput: CreateCommentsInput,
  ): Promise<CreateCommentsOutput> {
    return this.commentsService.createComments(user, createCommentsInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteCommentsOutput)
  deleteComments(
    @AuthUser() user: User,
    @Args('input') deleteCommentsInput: DeleteCommentsInput,
  ): Promise<DeleteCommentsOutput> {
    return this.commentsService.deleteComments(user, deleteCommentsInput);
  }

  @Role(['Any'])
  @Query((returns) => GetMyCommentsOutput)
  getMyComments(
    @AuthUser() user: User,
    @Args('input') getMyCommentsInput: GetMyCommentsInput,
  ): Promise<GetMyCommentsOutput> {
    return this.commentsService.getMyComments(user, getMyCommentsInput);
  }
}
