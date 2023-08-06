import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Issue } from '../entities/issue.entity';

@InputType()
export class GetIssueAndContentsByIdInput {
  @Field((type) => Int)
  @IsInt()
  issueId: number;
}

@ObjectType()
export class GetIssueAndContentsByIdOutput extends CommonOutput {
  @Field((type) => Issue, { nullable: true })
  issue?: Issue;
}
