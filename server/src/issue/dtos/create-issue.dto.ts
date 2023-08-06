import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { IssueContent } from '../entities/issue-content.entity';
import { Issue } from '../entities/issue.entity';

@InputType()
export class CreateIssueInput extends IntersectionType(
  PickType(Issue, ['subject'] as const),
  PickType(IssueContent, ['content'] as const),
) {}

@ObjectType()
export class CreateIssueOutput extends CommonOutput {
  @Field((type) => Issue, { nullable: true })
  result?: Issue;
}
