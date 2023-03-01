import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Agenda } from '../entities/agenda.entity';

@ObjectType()
export class GetMosteVotedAgendasOutput extends CommonOutput {
  @Field((type) => [Agenda], { nullable: true })
  agendas?: Agenda[];
}
