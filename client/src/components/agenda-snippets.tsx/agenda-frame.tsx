import { AgendaPartsFragment } from "../../gql/graphql";
import { PercentageBar } from "./percentage-bar";

interface IAgendaFrameProp {
  agenda: AgendaPartsFragment;
}

const makeR = (v: number): number => {
  if (v >= 5) return 255;
  return 240 - 25 * v;
};
const makeG = (v: number): number => {
  if (v <= 5) return 255;
  return 240 - 25 * v;
};

export const AgendaFrame: React.FC<IAgendaFrameProp> = ({ agenda }) => {
  const [voteCntA, voteCntB] = agenda.opinions.map(
    (opinion) => opinion.votedUserCount
  );
  const totalCnt = voteCntA + voteCntB;

  return (
    <div
      className="lg:w-96 w-72 h-36 p-2 border border-neutral-400 rounded-md bg-white text-gray-700 
                     hover:border-teal-100 hover:border-2 cursor-pointer"
    >
      <div
        id="subject"
        className="flex justify-between font-bold text-left text-lg mx-2 mt-1 border-b-2 border-gray-800"
      >
        <span className=" overflow-hidden h-7">{agenda.subject}</span>
        <span
          className="border-2 border-gray-300 text-sm rounded-full w-6 h-6 text-center"
          style={{
            backgroundColor: `rgb(${makeR(agenda.seriousness)},
                              ${makeG(agenda.seriousness)},0)`,
          }}
        >
          {agenda.seriousness}
        </span>
      </div>
      <div className="flex justify-between px-2 mt-3 font-semibold">
        <span className="h-7 overflow-hidden">
          {agenda.opinions[0].opinionText}
        </span>
        <span className="h-7 overflow-hidden">
          {agenda.opinions[1].opinionText}
        </span>
      </div>
      <div className="flex justify-between px-2 text-sm font-semibold">
        <span className="h-7 overflow-hidden">
          {voteCntA ? ((voteCntA / totalCnt) * 100).toFixed(1) : 0} %
        </span>
        <span>총 투표 수: {totalCnt}</span>
        <span className="h-7 overflow-hidden">
          {voteCntB ? ((voteCntB / totalCnt) * 100).toFixed(1) : 0} %
        </span>
      </div>
      <PercentageBar
        voteCntA={voteCntA}
        voteCntB={voteCntB}
        width={364}
        height={24}
      />
    </div>
  );
};
