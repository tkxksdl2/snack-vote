import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PercentageBar } from "../../components/agenda-snippets/percentage-bar";
import {
  AGENDA_DETAIL_FRAGMENT,
  COMMENT_FRAGMENT,
} from "../../queries/fragments";
import { getFragmentData } from "../../gql";
import {
  AgendaDetailPartsFragment,
  CommentPartsFragment,
  DeleteAgendaMutation,
  DeleteAgendaMutationVariables,
  DeleteCommentsMutation,
  DeleteCommentsMutationVariables,
  GetAgendaAndCommentsQuery,
  GetAgendaAndCommentsQueryVariables,
  UserRole,
  VoteOrUnvoteMutation,
  VoteOrUnvoteMutationVariables,
} from "../../gql/graphql";
import { CommentFrame } from "../../components/agenda-snippets/comment";
import { agendaListDefaultPageVar, cache, isLoggedInVar } from "../../apollo";
import { CreateComments } from "../../components/agenda-snippets/create-comments";
import { AgendaList } from "../../components/agenda-snippets/agenda-list";
import { useMe } from "../../hooks/use-me";
import {
  GET_AGENDA_AND_COMMENTS,
  VOTE_OR_UNVOTE,
} from "../../queries/query-agenda-detail";
import { DELETE_COMMENTS } from "../../queries/query-comments";
import { DELETE_AGENDA } from "../../queries/query-agedas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { AgendaChart } from "../../components/agenda-snippets/agenda-chart";
import { Helmet } from "react-helmet-async";
import { Pagination } from "../../components/pagination";
import { parseDate } from "../../hooks/parse";
import { SeriousnessNode } from "../../components/agenda-snippets/seriousness-node";
type TAgendaParams = {
  id: string;
};

export const AgendaDetail = () => {
  const [commentPage, setCommentPage] = useState(1);
  const [reCommentNum, setReCommentNum] = useState(-1);
  const [showChart, setShowChart] = useState<0 | 1 | null>();
  const [voteState, setVoteState] = useState({
    voteAHasMe: false,
    voteBHasMe: false,
  });
  const subjectRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => {
    subjectRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
  }, [location]);
  const { id } = useParams() as TAgendaParams;
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data: meData } = useMe();
  const navigate = useNavigate();
  const { data, refetch } = useQuery<
    GetAgendaAndCommentsQuery,
    GetAgendaAndCommentsQueryVariables
  >(GET_AGENDA_AND_COMMENTS, {
    variables: {
      commentsInput: { page: commentPage, agendaId: +id },
      agendaInput: { id: +id },
    },
  });
  const agenda = getFragmentData<AgendaDetailPartsFragment>(
    AGENDA_DETAIL_FRAGMENT,
    data?.findAgendaById.agenda
  );
  const comments = getFragmentData<CommentPartsFragment>(
    COMMENT_FRAGMENT,
    data?.getCommentsByAgenda.comments
  );

  if (agenda?.opinions[0].votedUser) {
    let has = false;
    for (const user of agenda?.opinions[0].votedUser) {
      if (user.id === meData?.me.id) has = true;
    }
    if (has && voteState.voteAHasMe === false)
      setVoteState({ ...voteState, voteAHasMe: true });
    else if (!has && voteState.voteAHasMe === true)
      setVoteState({ ...voteState, voteAHasMe: false });
  }
  if (agenda?.opinions[1].votedUser) {
    let has = false;
    for (const user of agenda?.opinions[1].votedUser) {
      if (user.id === meData?.me.id) has = true;
    }
    if (has && voteState.voteBHasMe === false)
      setVoteState({ ...voteState, voteBHasMe: true });
    else if (!has && voteState.voteBHasMe === true)
      setVoteState({ ...voteState, voteBHasMe: false });
  }

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
        cache.updateFragment(
          {
            id: `Opinion:${voteId}`,
            fragment: gql`
              fragment votedOp on Opinion {
                votedUserCount
                votedUser {
                  id
                }
              }
            `,
          },
          (data) => {
            let nextVotedUser = data.votedUser;
            let nextVotedUserCount = data.votedUserCount;
            if (message.split(" ")[1] === "voted") {
              nextVotedUser = [
                ...nextVotedUser,
                {
                  __typename: "User",
                  id: meData?.me.id,
                },
              ];
              nextVotedUserCount++;
            } else {
              nextVotedUser = nextVotedUser.filter(
                (v: any) => v.id !== meData?.me.id
              );
              nextVotedUserCount--;
            }
            return {
              ...data,
              votedUser: nextVotedUser,
              votedUserCount: nextVotedUserCount,
            };
          }
        );
        alert(message);
      } else if (error) {
        alert(error);
      }
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
  const onReCommentClick = (commentIndex: number) => {
    if (reCommentNum === commentIndex) setReCommentNum(-1);
    else setReCommentNum(commentIndex);
  };

  const [deleteAgenda, { loading: deleteAgendaLoading }] = useMutation<
    DeleteAgendaMutation,
    DeleteAgendaMutationVariables
  >(DELETE_AGENDA);
  const onDeleteAgendaClick = (agendaId: number) => {
    if (!deleteAgendaLoading && window.confirm("투표를 삭제하시겠습니까?")) {
      deleteAgenda({
        variables: { input: { agendaId } },
        onCompleted: (data) => {
          if (!data.deleteAgenda.ok) {
            alert("삭제에 실패했습니다");
            return;
          }
          alert("삭제에 성공했습니다.");
          cache.evict({ id: `Agenda:${agenda?.id}` });
          navigate(`/${agenda?.category.toLowerCase()}`);
        },
      });
    }
  };

  const [deleteComments, { loading: deleteCommentsLoading }] = useMutation<
    DeleteCommentsMutation,
    DeleteCommentsMutationVariables
  >(DELETE_COMMENTS);

  const onDeleteCommentsClick = (commentsId: number) => {
    if (!deleteCommentsLoading && window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComments({
        variables: { input: { commentsId } },
        onCompleted: (data) => {
          if (!data.deleteComments.ok) {
            alert("삭제에 실패했습니다.");
            return;
          }
          cache.updateQuery(
            {
              query: GET_AGENDA_AND_COMMENTS,
              variables: {
                commentsInput: { page: commentPage, agendaId: +id },
                agendaInput: { id: +id },
              },
            },
            (queryData) => {
              return {
                ...queryData,
                getCommentsByAgenda: {
                  ...queryData.getCommentsByAgenda,
                  comments: queryData.getCommentsByAgenda.comments.map(
                    (comment: any) => {
                      if (comment.id === commentsId) {
                        if (meData?.me.role !== UserRole.Admin) {
                          return {
                            ...comment,
                            content: "삭제된 댓글입니다.",
                            deletedAt: Date.now(),
                          };
                        }
                        return { ...comment, deletedAt: Date.now() };
                      }
                      return comment;
                    }
                  ),
                },
              };
            }
          );
          alert("댓글이 삭제되었습니다.");
        },
      });
    }
  };
  return (
    <div
      key={`agenda-detail-${agenda?.id}`}
      className="flex min-h-screen h-full justify-center bg-slate-300 text-gray-700"
    >
      <div className="max-w-4xl w-full min-h-screen h-full bg-white">
        <div className="px-5 font-semibold text-lg ">
          <div className="py-10 flex flex-col ">
            <Helmet>
              <title>{agenda?.subject}</title>
            </Helmet>
            <div
              ref={subjectRef}
              id="subject"
              className="py-1 px-2 w-full bg-indigo-100 border-b-2 border-b-gray-700 break-words relative"
            >
              {agenda && <SeriousnessNode seriousness={agenda?.seriousness} />}
              <span className="ml-2">{agenda?.subject}</span>
            </div>
            <div className="flex justify-between text-sm font-mono p-2">
              <span>
                by {agendaAuthor ? agendaAuthor.name : "Unknown"}
                <span className="ml-3">{parseDate(agenda?.createdAt)}</span>
              </span>
              {meData?.me.id === data?.findAgendaById.agenda?.author?.id &&
                agenda && (
                  <button
                    onClick={() => {
                      onDeleteAgendaClick(agenda?.id);
                    }}
                    className="hover:text-red-800"
                  >
                    투표 삭제
                  </button>
                )}
            </div>

            <div
              id="content-start"
              className="border-y h-2 border-gray-300"
            ></div>
            <div className=" mt-11 mb-8">
              <div className="flex justify-between px-2 mt-3 font-semibold text-3xl">
                <span className="min-h-7 max-w-1/2 break-words ">
                  {agenda?.opinions[0].opinionText}
                </span>
                <span className="min-h-7 max-w-1/2 break-words text-right">
                  {agenda?.opinions[1].opinionText}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-baseline px-2 mb-12 lg:text-7xl text-3xl font-semibold">
              <span
                className={
                  "overflow-hidden" +
                  (voteCntA > voteCntB
                    ? " lg:text-8xl text-4xl text-red-900"
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
                    ? " lg:text-8xl text-4xl text-red-900"
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
              isBig={true}
            />
          </div>
          {agenda && (
            <div className="flex justify-between pb-3">
              <div>
                <button
                  onClick={() => {
                    onVoteClick(agenda?.opinions[0].id, agenda?.opinions[1].id);
                  }}
                  className={
                    "vote-btn " +
                    (voteState.voteAHasMe && "text-blue-500 ") +
                    ((!isLoggedIn || voteLoading) && "pointer-events-none ")
                  }
                >
                  투표
                </button>
                <FontAwesomeIcon
                  className={
                    "cursor-pointer " + (showChart === 0 && "text-blue-500")
                  }
                  onClick={() => {
                    showChart === 0 ? setShowChart(null) : setShowChart(0);
                  }}
                  icon={solid("chart-pie")}
                />
              </div>
              <div>
                <FontAwesomeIcon
                  className={
                    "cursor-pointer " + (showChart === 1 && "text-blue-500 ")
                  }
                  onClick={() => {
                    showChart === 1 ? setShowChart(null) : setShowChart(1);
                  }}
                  icon={solid("chart-pie")}
                />
                <button
                  onClick={() => {
                    onVoteClick(agenda?.opinions[1].id, agenda?.opinions[0].id);
                  }}
                  className={
                    "vote-btn " +
                    (voteState.voteBHasMe && "text-blue-500 ") +
                    ((!isLoggedIn || voteLoading) && "pointer-events-none ")
                  }
                >
                  투표
                </button>
              </div>
            </div>
          )}
          {typeof showChart === "number" &&
            agenda?.opinions[showChart].votedUser && (
              <div className="bg-orange-100 rounded-xl transition-all">
                <div className="ml-5 text-base text-gray-500 flex justify-between">
                  <span>
                    {agenda.opinions[showChart].opinionText} 에는 이런 사람들이
                    투표했습니다..
                  </span>
                  <span className="mr-6">
                    투표 수: {agenda?.opinions[showChart].votedUserCount}
                  </span>
                </div>
                <AgendaChart
                  votedUser={agenda?.opinions[showChart].votedUser}
                />
              </div>
            )}
          <div className="border-y h-2 border-gray-300"></div>
          <div className="py-10">
            <div className="mb-3">
              {comments &&
                comments.length > 0 &&
                comments.map((comment, index) => {
                  return (
                    <div key={index}>
                      <CommentFrame comment={comment} />
                      <div className=" text-sm font-light text-end">
                        {isLoggedIn && !comment.deletedAt && (
                          <button
                            onClick={() => {
                              onReCommentClick(index);
                            }}
                          >
                            댓글
                          </button>
                        )}
                        {isLoggedIn &&
                          meData?.me.id === comment.author?.id &&
                          !comment.deletedAt && (
                            <button
                              className="ml-2 font-semibold hover:text-red-800"
                              onClick={() => {
                                onDeleteCommentsClick(comment.id);
                              }}
                            >
                              삭제
                            </button>
                          )}
                      </div>
                      {reCommentNum === index &&
                        agenda &&
                        data?.getCommentsByAgenda.totalPage && (
                          <div
                            className={
                              "mt-1 " + (comment.depth === 0 ? "pl-3" : "pl-8")
                            }
                          >
                            <CreateComments
                              agendaId={agenda?.id}
                              bundleId={comment.bundleId}
                              commentPage={commentPage}
                              totalPage={data?.getCommentsByAgenda.totalPage}
                              setPage={setCommentPage}
                              setReCommentNum={setReCommentNum}
                            />
                          </div>
                        )}
                    </div>
                  );
                })}
            </div>
            {data?.getCommentsByAgenda &&
              typeof data?.getCommentsByAgenda.totalPage === "number" && (
                <div className="mb-3 text-base font-normal">
                  <Pagination
                    page={commentPage}
                    totalPage={
                      data?.getCommentsByAgenda.totalPage === 0
                        ? 1
                        : data?.getCommentsByAgenda.totalPage
                    }
                    setPage={setCommentPage}
                  />
                </div>
              )}
            {agenda &&
              typeof data?.getCommentsByAgenda.totalPage === "number" && (
                <CreateComments
                  agendaId={agenda?.id}
                  commentPage={commentPage}
                  totalPage={
                    data?.getCommentsByAgenda.totalPage === 0
                      ? 1
                      : data?.getCommentsByAgenda.totalPage
                  }
                  setPage={setCommentPage}
                />
              )}
          </div>
          <div id="content-end" className="border-b h-2 border-gray-300"></div>
        </div>
        <div className="pt-32 pb-20">
          {agenda && (
            <AgendaList
              category={agenda.category}
              defaultPage={agendaListDefaultPageVar()}
            />
          )}
        </div>
      </div>
    </div>
  );
};
