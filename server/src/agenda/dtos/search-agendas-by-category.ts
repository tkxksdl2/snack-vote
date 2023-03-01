import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Agenda, Category } from '../entities/agenda.entity';

@InputType()
export class SearchAgendasByCategoryInput extends PaginationInput {
  @Field((type) => Category)
  category: Category;

  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(2, 20)
  query?: string;
}

@ObjectType()
export class SearchAgendasByCategoryOutput extends PaginationOutput {
  @Field((type) => [Agenda], { nullable: true })
  agendas?: Agenda[];
}
