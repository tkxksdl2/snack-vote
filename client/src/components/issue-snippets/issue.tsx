import React from "react";
import { Link } from "react-router-dom";
import { IssuePartsFragment } from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { CountHasAnswerComp } from "./count-has-answer-comp";

interface IIssueProp {
  issue: IssuePartsFragment;
}

export const Issue: React.FC<IIssueProp> = ({ issue }) => {
  return (
    <Link to={`/issues/${issue.id}`}>
      <div
        className="w-full h-16 bg-gray-100 hover:bg-white rounded-xl p-2 m-1 border border-gray-300
                    flex flex-row items-center cursor-pointer"
      >
        <CountHasAnswerComp
          hasAnswer={issue.hasAnswer}
          contentCount={issue.contentCount}
        />
        <div className="font-semibold lg:w-5/6 w-7/12">
          <div className=" text-gray-500 text-sm">{issue.author?.name}</div>
          <div className=" text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {issue.subject}
          </div>
        </div>
        <div className="lg:text-sm text-xs font-light ml-2 lg:w-14 w-12 break-words">
          {parseDate(issue.createdAt)}
        </div>
      </div>
    </Link>
  );
};
