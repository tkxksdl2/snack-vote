import React from "react";
import { AgendaPartsFragment } from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { PercentageBar } from "./percentage-bar";
import { SeriousnessNode } from "./seriousness-node";

interface IAgendaFrameProp {
  agenda: AgendaPartsFragment;
}

export const AgendaFrame: React.FC<IAgendaFrameProp> = ({ agenda }) => {
  const [voteCntA, voteCntB] = agenda.opinions.map(
    (opinion) => opinion.votedUserCount
  );
  const totalCnt = voteCntA + voteCntB;

  return (
    <React.Fragment>
      <div className="px-1 text-xs text-gray-500 flex justify-between">
        <span>{parseDate(agenda.createdAt)}</span>
        <span>by {agenda.author?.name || "unknown"}</span>
      </div>
      <div
        className="lg:w-96 w-72 h-36 px-2 py-1 border border-neutral-400 rounded-md bg-white text-gray-700 
                     hover:border-teal-100 hover:border-2 cursor-pointer"
      >
        <div
          id="subject"
          className="flex justify-between font-bold text-left text-lg mx-2 mt-1 border-b-2 border-gray-800 relative"
        >
          <span className="h-7 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {agenda.subject}
          </span>
          <SeriousnessNode seriousness={agenda.seriousness} />
        </div>
        <div className="flex justify-between px-2 mt-3 font-semibold">
          <span className="h-7 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {agenda.opinions[0].opinionText}
          </span>
          <span className="h-7 overflow-hidden overflow-ellipsis whitespace-nowrap">
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
          isBig={false}
        />
      </div>
    </React.Fragment>
  );
};
