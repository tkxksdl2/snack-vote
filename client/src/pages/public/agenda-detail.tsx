import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PercentageBar } from "../../components/agenda-snippets.tsx/percentage-bar";
import { AGENDA_FRAGMENT, COMMENT_FRAGMENT } from "../../fragments";
import { useFragment } from "../../gql";
import {
  AgendaPartsFragment,
  CommentPartsFragment,
  GetAgendaAndCommentsQuery,
  GetAgendaAndCommentsQueryVariables,
} from "../../gql/graphql";
import date from "date-and-time";
import { CommentFrame } from "../../components/agenda-snippets.tsx/comment";

const GET_AGENDA_AND_COMMENTS = gql`
  query getAgendaAndComments(
    $commentsInput: GetCommentsByAgendaInput!
    $agendaInput: FindAgendaByIdInput!
  ) {
    getCommentsByAgenda(input: $commentsInput) {
      ok
      error
      totalPage
      comments {
        ...CommentParts
      }
    }
    findAgendaById(input: $agendaInput) {
      ok
      error
      agenda {
        ...AgendaParts
        author {
          id
          name
        }
      }
    }
  }
  ${COMMENT_FRAGMENT}
  ${AGENDA_FRAGMENT}
`;

type TAgendaParams = {
  id: string;
};

export const AgendaDetail = () => {
  const [commentPage, setCommentPage] = useState(1);
  const { id } = useParams() as TAgendaParams;
  const { data, loading } = useQuery<
    GetAgendaAndCommentsQuery,
    GetAgendaAndCommentsQueryVariables
  >(GET_AGENDA_AND_COMMENTS, {
    variables: {
      commentsInput: { page: commentPage, agendaId: +id },
      agendaInput: { id: +id },
    },
  });
  const agenda = useFragment<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.findAgendaById.agenda
  );
  const comments = useFragment<CommentPartsFragment>(
    COMMENT_FRAGMENT,
    data?.getCommentsByAgenda.comments
  );
  const voteCntA = agenda ? agenda.opinions[0].votedUserCount : 0;
  const voteCntB = agenda ? agenda.opinions[1].votedUserCount : 0;
  let totalCnt = voteCntA + voteCntB;
  const agendaAuthor = data?.findAgendaById.agenda?.author;
  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 text-gray-700">
      <div className="max-w-4xl w-full min-h-screen h-full bg-white">
        <div className="px-5 font-semibold text-lg ">
          <div className="py-10 flex flex-col ">
            <div className="py-1 pl-2 pr-10 w-full bg-indigo-100 border-b-2 border-b-gray-700">
              {agenda?.subject}
            </div>
            <span className="text-sm font-mono pl-2 py-2">
              by {agendaAuthor ? agendaAuthor.name : "Unknown"}
            </span>
            <div className="border-y h-2 border-gray-300"></div>
            <div className=" mt-11 mb-8">
              <div className="flex justify-between px-2 mt-3 font-semibold text-3xl">
                <span className="h-7 w-1/2 ">
                  {agenda?.opinions[0].opinionText}
                </span>
                <span className="h-7 w-1/2 text-right">
                  {agenda?.opinions[1].opinionText}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-baseline px-2 mb-12 text-7xl font-semibold">
              <span
                className={
                  "overflow-hidden" +
                  (voteCntA > voteCntB ? " text-8xl text-red-900" : "")
                }
              >
                {voteCntA ? ((voteCntA / totalCnt) * 100).toFixed(1) : 0} %
              </span>
              <span className="text-3xl">총 투표 수: {totalCnt}</span>
              <span
                className={
                  "overflow-hidden" +
                  (voteCntB > voteCntA ? " text-8xl text-red-900" : "")
                }
              >
                {voteCntB ? ((voteCntB / totalCnt) * 100).toFixed(1) : 0} %
              </span>
            </div>
            <PercentageBar
              voteCntA={voteCntA}
              voteCntB={voteCntB}
              width={856}
              height={36}
            />
          </div>
          <div className="flex justify-between pb-3">
            <div>투표 1</div>
            <div>투표 2</div>
          </div>
          <div className="py-10">
            {comments?.map((comment) => {
              return <CommentFrame comment={comment} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
