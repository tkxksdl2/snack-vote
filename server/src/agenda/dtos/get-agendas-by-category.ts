import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Agenda, Category } from '../entities/agenda.entity';

@InputType()
export class GetAgendasByCategoryInput extends PaginationInput {
  @Field((type) => Category)
  category: Category;
}

@ObjectType()
export class GetAgendasByCategoryOutput extends PaginationOutput {
  @Field((type) => [Agenda], { nullable: true })
  agendas?: Agenda[];
}
