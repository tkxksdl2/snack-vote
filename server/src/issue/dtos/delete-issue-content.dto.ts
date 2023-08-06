import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteIssueContentInput {
  @Field((type) => Int)
  @IsInt()
  issueContentId: number;
}

@ObjectType()
export class DeleteIssueContentOutput extends CommonOutput {}
