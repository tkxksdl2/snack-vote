import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class GetMyCommentsInput extends PaginationInput {}

@ObjectType()
export class GetMyCommentsOutput extends PaginationOutput {
  @Field((type) => [Comments], { nullable: true })
  comments?: Comments[];
}
