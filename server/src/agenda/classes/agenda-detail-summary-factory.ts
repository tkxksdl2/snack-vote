import { Sex, User } from 'src/users/entities/user.entity';
import {
  AgendaChartStats,
  AgendaDetailSummary,
} from '../dtos/get-agenda-and-stats-by-id.dto';
import { Agenda } from '../entities/agenda.entity';
import { Opinion } from '../entities/opinion.entity';

export class AgendaDetailSummaryFactory {
  private isUserVotedOpinion: [boolean, boolean];

  constructor(
    private readonly agenda: Agenda,
    private readonly userId: number,
  ) {
    this.isUserVotedOpinion = [false, false];
  }

  makeSummary(): AgendaDetailSummary {
    const statsArr: AgendaChartStats[] = [];

    this.agenda.opinions.forEach((op, i) => {
      statsArr.push({
        sexData: [0, 0],
        ageData: [0, 0, 0, 0, 0],
      });

      op.vote.forEach((vote) => {
        if (this.userId && vote.user.id === this.userId)
          this.isUserVotedOpinion[i] = true;

        statsArr[i].sexData[
          AgendaDetailSummaryFactory.sexToIndex(vote.user.sex)
        ]++;

        const age =
          new Date().getFullYear() - new Date(vote.user.birth).getFullYear();

        statsArr[i].ageData[AgendaDetailSummaryFactory.ageToIndex(age)]++;
      });
    });

    const summary = {
      agenda: {
        ...this.agenda,
        opinions: this.agenda.opinions.map((op: Opinion) => ({
          ...op,
          vote: null,
        })),
      },
      agendaChartStatsArr: statsArr,
    };

    return summary;
  }

  /**
   * @param summary
   * @param user
   * @param votedOp
   *
   * @param adder
   * 투표 혹은 취소 값으로 1 혹은 -1
   * 이미 존재하는 AgendaDetailSummury 객체에 vote or unvote 하는 메서드
   *
   * @returns summary itself
   */
  static summaryAddVote(
    summary: AgendaDetailSummary,
    user: User,
    votedOp: Opinion,
    adder: 1 | -1,
  ) {
    const opIndex = votedOp.opinionType ? 0 : 1;

    summary.agendaChartStatsArr[opIndex].sexData[
      AgendaDetailSummaryFactory.sexToIndex(user.sex)
    ] += adder;

    summary.agendaChartStatsArr[opIndex].ageData[
      AgendaDetailSummaryFactory.ageToIndex(
        new Date().getFullYear() - new Date(user.birth).getFullYear(),
      )
    ] += adder;

    return summary;
  }

  static sexToIndex(sex: Sex): number {
    return sex === Sex.Male ? 0 : 1;
  }

  static ageToIndex(age: number): number {
    if (age < 20) return 0;
    else if (age < 30) return 1;
    else if (age < 40) return 2;
    else if (age < 50) return 3;
    return 4;
  }

  getIsUserVotedOpinion() {
    return this.isUserVotedOpinion;
  }
}
