import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteAgendaInput {
  @IsInt()
  @Field((type) => Int)
  agendaId: number;
}

@ObjectType()
export class DeleteAgendaOutput extends CommonOutput {}
