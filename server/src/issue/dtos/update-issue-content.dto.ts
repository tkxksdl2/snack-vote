import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { IssueContent } from '../entities/issue-content.entity';

@InputType()
export class UpdateIssueContentInput extends PickType(IssueContent, [
  'content',
]) {
  @Field((type) => Int)
  @IsInt()
  issueContentId: number;
}

@ObjectType()
export class UpdateIssueContentOutput extends CommonOutput {
  @Field((type) => IssueContent, { nullable: true })
  result?: IssueContent;
}
