import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteUserInput {
  @IsInt()
  @Field((type) => Int)
  id: number;
}

@ObjectType()
export class DeleteUserOutput extends CommonOutput {}
