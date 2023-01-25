import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PercentageBar } from "../../components/agenda-snippets.tsx/percentage-bar";
import { AGENDA_FRAGMENT, COMMENT_FRAGMENT } from "../../fragments";
import { useFragment } from "../../gql";
import {
  AgendaPartsFragment,
  CommentPartsFragment,
  GetAgendaAndCommentsQuery,
  GetAgendaAndCommentsQueryVariables,
  VoteOrUnvoteMutation,
  VoteOrUnvoteMutationVariables,
} from "../../gql/graphql";
import { CommentFrame } from "../../components/agenda-snippets.tsx/comment";
import { client, isLoggedInVar } from "../../apollo";
import { useMe } from "../../hooks/use-me";

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

const VOTE_OR_UNVOTE = gql`
  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {
    voteOrUnvote(input: $input) {
      ok
      error
      voteCount
      message
      voteId
    }
  }
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

  const [voteOrUnvote, { loading: voteLoading }] = useMutation<
    VoteOrUnvoteMutation,
    VoteOrUnvoteMutationVariables
  >(VOTE_OR_UNVOTE, {
    onCompleted: (data) => {
      const { ok, error, message, voteCount, voteId } = data.voteOrUnvote;
      if (ok && message) {
        alert(message);
      } else if (error) {
        alert(error);
      }
      client.writeFragment({
        id: `Opinion:${voteId}`,
        fragment: gql`
          fragment votedOp on Opinion {
            votedUserCount
          }
        `,
        data: {
          votedUserCount: voteCount,
        },
      });
    },
  });
  const onVoteClick = (voteId: number, otherOpinionId: number) => {
    voteOrUnvote({
      variables: {
        input: {
          voteId,
          otherOpinionId,
        },
      },
    });
  };

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
            <div className="flex justify-between items-baseline px-2 mb-12 lg:text-7xl text-3xl font-semibold">
              <span
                className={
                  "overflow-hidden" +
                  (voteCntA > voteCntB
                    ? "lg:text-8xl text-4xl text-red-900"
                    : "")
                }
              >
                {voteCntA ? ((voteCntA / totalCnt) * 100).toFixed(1) : 0} %
              </span>
              <span className="lg:text-3xl text-base">
                총 투표 수: {totalCnt}
              </span>
              <span
                className={
                  "overflow-hidden" +
                  (voteCntB > voteCntA
                    ? "lg:text-8xl text-4xl text-red-900"
                    : "")
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
          {agenda && (
            <div className="flex justify-between pb-3">
              <button
                onClick={() => {
                  onVoteClick(agenda?.opinions[0].id, agenda?.opinions[1].id);
                }}
                className={
                  "vote-btn " +
                  ((!isLoggedInVar() || voteLoading) && "pointer-events-none")
                }
              >
                투표
              </button>
              <button
                onClick={() => {
                  onVoteClick(agenda?.opinions[1].id, agenda?.opinions[0].id);
                }}
                className={
                  "vote-btn " +
                  ((!isLoggedInVar() || voteLoading) && "pointer-events-none")
                }
              >
                투표
              </button>
            </div>
          )}
          <div className="py-10">
            {comments?.map((comment, index) => {
              return (
                <div key={index}>
                  <CommentFrame comment={comment} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
