import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsUUID } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class VoteOrUnvoteInput {
  @Field((type) => Int)
  @IsInt()
  voteOpinionId: number;

  @Field((type) => Int)
  @IsInt()
  otherOpinionId: number;
}

@ObjectType()
export class VoteOrUnvoteOutput extends CommonOutput {
  @Field((type) => Int, { nullable: true })
  @IsInt()
  voteCount?: number;

  @Field((type) => Int, { nullable: true })
  @IsInt()
  opinionId?: number;

  @Field((type) => String, { nullable: true })
  @IsUUID()
  voteId?: string;

  @Field((type) => String, { nullable: true })
  message?: string;

  @Field((type) => Boolean, { nullable: true })
  opinionType?: boolean;

  @Field((type) => String, { nullable: true })
  resultType?: 'vote' | 'unvote';
}
