import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteCommentsInput {
  @IsInt()
  @Field((type) => Int)
  commentsId: number;
}

@ObjectType()
export class DeleteCommentsOutput extends CommonOutput {}
