import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { Comments } from '../entities/comments.entity';

@InputType()
export class GetCommentsByAgendaInput extends PaginationInput {
  @Field((type) => Int)
  agendaId: number;
}

@ObjectType()
export class GetCommentsByAgendaOutput extends PaginationOutput {
  @Field((type) => [Comments], { nullable: true })
  comments?: Comments[];

  @Field((type) => User, { nullable: true })
  author?: User;
}
