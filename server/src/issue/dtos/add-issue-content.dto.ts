import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { IssueContent } from '../entities/issue-content.entity';

@InputType()
export class AddIssueContentInput extends PickType(IssueContent, ['content']) {
  @Field((type) => Int)
  @IsInt()
  issueId: number;
}

@ObjectType()
export class AddIssueContentOutput extends CommonOutput {
  @Field((type) => IssueContent, { nullable: true })
  result?: IssueContent;
}
