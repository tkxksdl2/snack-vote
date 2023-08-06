import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Issue } from '../entities/issue.entity';

@InputType()
export class GetAllIssuesInput extends PaginationInput {}

@ObjectType()
export class GetAllIssuesOutput extends PaginationOutput {
  @Field((type) => [Issue], { nullable: true })
  issues?: Issue[];
}
