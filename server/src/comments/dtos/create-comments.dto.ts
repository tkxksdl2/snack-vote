import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Length } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class CreateCommentsInput {
  @IsInt()
  @Field((type) => Int)
  agendaId: number;

  @IsInt()
  @Field((type) => Int, { nullable: true })
  bundleId?: number;

  @IsString()
  @Length(2, 150)
  @Field((type) => String)
  content: string;
}

@ObjectType()
export class CreateCommentsOutput extends CommonOutput {
  @Field((type) => Comments, { nullable: true })
  comments?: Comments;
}
