import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class VoteOrUnvoteInput {
  @Field((type) => Int)
  @IsInt()
  voteId: number;

  @Field((type) => Int)
  @IsInt()
  otherOpinionId: number;
}

@ObjectType()
export class VoteOrUnvoteOutput extends CommonOutput {
  @Field((type) => Int, { nullable: true })
  @IsInt()
  voteCount?: number;

  @Field((type) => String, { nullable: true })
  message?: string;
}
