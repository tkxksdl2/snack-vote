import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Agenda } from '../entities/agenda.entity';

@InputType()
export class GetMyAgendasInput extends PaginationInput {}

@ObjectType()
export class GetmyAgendasOutput extends PaginationOutput {
  @Field((type) => [Agenda], { nullable: true })
  agendas?: Agenda[];
}
