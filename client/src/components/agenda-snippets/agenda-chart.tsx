import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Sex } from "../../gql/graphql";

interface IAgendaChartProp {
  votedUser:
    | {
        __typename?: "User" | undefined;
        id: number;
        birth?: any;
        sex?: Sex | null | undefined;
      }[]
    | null
    | undefined;
}

ChartJS.register(ArcElement, Tooltip, Legend);
export const AgendaChart: React.FC<IAgendaChartProp> = ({ votedUser }) => {
  let [mCnt, fCnt, age10, age20, age30, age40, age50] = new Array(7).fill(0);
  const today = new Date();
  if (votedUser)
    for (const user of votedUser) {
      if (user.sex === Sex.Male) mCnt++;
      else fCnt++;
      const age = today.getFullYear() - new Date(user.birth).getFullYear();
      if (age < 20) age10++;
      else if (age < 30) age20++;
      else if (age < 40) age30++;
      else if (age < 50) age40++;
      else age50++;
    }
  const chartData = {
    mfChart: {
      labels: ["남성", "여성"],
      datasets: [
        {
          data: [mCnt, fCnt],
          backgroundColor: ["#6A81CD", "#CC669E"],
          hoverBackgroundColor: ["#4046BF", "#C247A1"],
        },
      ],
    },
    birthChart: {
      labels: ["10대 이하", "20대", "30대", "40대", "50대 이상"],
      datasets: [
        {
          data: [age10, age20, age30, age40, age50],
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
      {votedUser && votedUser.length > 0 ? (
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
