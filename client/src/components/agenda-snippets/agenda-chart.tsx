import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AgendaChartStats } from "../../gql/graphql";

interface IAgendaChartProp {
  agendaChartStats: AgendaChartStats;
  votedUserCount: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);
export const AgendaChart: React.FC<IAgendaChartProp> = ({
  agendaChartStats,
  votedUserCount,
}) => {
  const chartData = {
    mfChart: {
      labels: ["남성", "여성"],
      datasets: [
        {
          data: agendaChartStats.sexData,
          backgroundColor: ["#6A81CD", "#CC669E"],
          hoverBackgroundColor: ["#4046BF", "#C247A1"],
        },
      ],
    },
    birthChart: {
      labels: ["10대 이하", "20대", "30대", "40대", "50대 이상"],
      datasets: [
        {
          data: agendaChartStats.ageData,
          backgroundColor: [
            "#A459D1",
            "#F16767",
            "#FFB84C",
            "#EA8FEA",
            "#4D455D",
          ],
          hoverBackgroundColor: ["#FDEBED"],
        },
      ],
    },
    deadChart: {
      labels: ["아무도 투표하지 않았습니다.."],
      datasets: [
        {
          data: [1],
          backgroundColor: ["#DDDDDD"],
        },
      ],
    },
  };

  return (
    <div className="w=full py-2 mb-5 h-64 flex justify-around">
      {votedUserCount > 0 ? (
        <>
          <Doughnut data={chartData.mfChart} />
          <Doughnut data={chartData.birthChart} />
        </>
      ) : (
        <Doughnut data={chartData.deadChart} />
      )}
    </div>
  );
};
