import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Agenda } from '../entities/agenda.entity';

@InputType()
export class FindAgendaAndAllVotesByIdInput extends PickType(Agenda, ['id']) {}

@ObjectType()
export class FindAgendaAndAllVotesByIdOutput extends CommonOutput {
  @Field((type) => Agenda, { nullable: true })
  agenda?: Agenda;
}
