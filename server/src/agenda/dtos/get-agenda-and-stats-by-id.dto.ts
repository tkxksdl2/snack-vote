import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Sex, User } from 'src/users/entities/user.entity';
import { Agenda } from '../entities/agenda.entity';
import { Opinion } from '../entities/opinion.entity';

@InputType()
export class GetAgendaAndStatsByIdInput extends PickType(Agenda, ['id']) {
  @Field((type) => Int, { nullable: true })
  userId?: number;
}

@ObjectType()
export class AgendaChartStats {
  @Field((type) => [Int, Int])
  sexData: [number, number];

  @Field((type) => [Int, Int, Int, Int, Int])
  ageData: [number, number, number, number, number];
}

@ObjectType()
export class AgendaDetailSummary {
  @Field((type) => Agenda)
  agenda: Agenda;

  @Field((type) => [AgendaChartStats])
  agendaChartStatsArr: AgendaChartStats[];
}

@ObjectType()
export class GetAgendaAndStatsByIdOutput extends CommonOutput {
  @Field((type) => AgendaDetailSummary, { nullable: true })
  agendaDetail?: AgendaDetailSummary;

  @Field((type) => [Boolean, Boolean], { nullable: true })
  isUserVotedOpinion?: [boolean, boolean];
}
