import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Agenda } from '../entities/agenda.entity';

@InputType()
export class CreateAgendaInput extends PickType(Agenda, [
  'subject',
  'seriousness',
  'category',
]) {
  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  opinionA: string;

  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  opinionB: string;
}

@ObjectType()
export class CreateAgendaOutput extends CommonOutput {
  @Field((type) => Agenda, { nullable: true })
  result?: Agenda;
}
