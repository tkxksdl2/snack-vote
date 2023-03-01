import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Opinion } from '../entities/opinion.entity';

@InputType()
export class GetVotedOpinionsInput extends PaginationInput {}

@ObjectType()
export class GetVotedOpinionsOutput extends PaginationOutput {
  @Field((type) => [Opinion], { nullable: true })
  opinions?: Opinion[];
}
