import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Agenda } from '../entities/agenda.entity';

@InputType()
export class GetVotedAgendasInput extends PaginationInput {}

@ObjectType()
export class GetVotedAgendasOutput extends PaginationOutput {
  @Field((type) => [Agenda], { nullable: true })
  agendas?: Agenda[];
}
