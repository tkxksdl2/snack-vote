import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteIssueInput {
  @Field((type) => Int)
  @IsInt()
  issueId: number;
}

@ObjectType()
export class DeleteIssueOutput extends CommonOutput {}
