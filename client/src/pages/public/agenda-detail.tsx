import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PercentageBar } from "../../components/agenda-snippets/percentage-bar";
import { AGENDA_FRAGMENT, COMMENT_FRAGMENT } from "../../queries/fragments";
import { getFragmentData } from "../../gql";
import {
  AgendaPartsFragment,
  CommentPartsFragment,
  DeleteAgendaMutation,
  DeleteAgendaMutationVariables,
  DeleteCommentsMutation,
  DeleteCommentsMutationVariables,
  GetAgendaAndCommentsQuery,
  GetAgendaAndCommentsQueryVariables,
  Sex,
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
      agendaInput: { id: +id, userId: meData?.me.id },
    },
  });

  const agenda = getFragmentData<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.getAgendaAndStatsById.agendaDetail?.agenda
  );
  const comments = getFragmentData<CommentPartsFragment>(
    COMMENT_FRAGMENT,
    data?.getCommentsByAgenda.comments
  );

  useEffect(() => {
    const isUserVotedOpinion = data?.getAgendaAndStatsById.isUserVotedOpinion;
    if (isUserVotedOpinion) {
      setVoteState({
        voteAHasMe: isUserVotedOpinion[0],
        voteBHasMe: isUserVotedOpinion[1],
      });
    }
  }, [data?.getAgendaAndStatsById.isUserVotedOpinion]);

  const voteCntA = agenda ? agenda.opinions[0].votedUserCount : 0;
  const voteCntB = agenda ? agenda.opinions[1].votedUserCount : 0;
  let totalCnt = voteCntA + voteCntB;

  const agendaAuthor = agenda?.author;

  const [voteOrUnvote, { loading: voteLoading }] = useMutation<
    VoteOrUnvoteMutation,
    VoteOrUnvoteMutationVariables
  >(VOTE_OR_UNVOTE, {
    onCompleted: (voteData) => {
      const {
        ok,
        error,
        message,
        voteCount,
        opinionType,
        opinionId,
        resultType,
      } = voteData.voteOrUnvote;
      if (ok) {
        cache.modify({
          id: `Opinion:${opinionId}`,
          fields: {
            votedUserCount(_) {
              return voteCount;
            },
          },
        });

        if (resultType === "vote") {
          if (opinionType) setVoteState({ ...voteState, voteAHasMe: true });
          else setVoteState({ ...voteState, voteBHasMe: true });
        } else {
          if (opinionType) setVoteState({ ...voteState, voteAHasMe: false });
          else setVoteState({ ...voteState, voteBHasMe: false });
        }

        // 통계 캐시 갱신
        const arr =
          data?.getAgendaAndStatsById.agendaDetail?.agendaChartStatsArr;
        if (!arr) return;

        const datas = [
          {
            sexData: [...arr[0].sexData],
            ageData: [...arr[0].ageData],
          },
          {
            sexData: [...arr[1].sexData],
            ageData: [...arr[1].ageData],
          },
        ];

        const sex = meData?.me.sex;
        const age =
          new Date().getFullYear() - new Date(meData?.me.birth).getFullYear();

        const adder = resultType === "vote" ? 1 : -1;
        const opIdx = opinionType ? 0 : 1;
        const sexIdx = sex === Sex.Male ? 0 : 1;
        const ageIdx = ageToIndex(age);

        datas[opIdx].ageData[ageIdx] += adder;
        datas[opIdx].sexData[sexIdx] += adder;

        cache.updateQuery(
          {
            query: GET_AGENDA_AND_COMMENTS,
            variables: {
              commentsInput: { page: commentPage, agendaId: +id },
              agendaInput: { id: +id, userId: meData?.me.id },
            },
          },
          (data) => {
            return {
              ...data,
              getAgendaAndStatsById: {
                ...data.getAgendaAndStatsById,
                agendaDetail: {
                  ...data.getAgendaAndStatsById.agendaDetail,
                  agendaChartStatsArr: datas,
                },
              },
            };
          }
        );

        alert(message);
      } else if (error) {
        alert(error);
      }
    },
  });

  const ageToIndex = (age: number): number => {
    if (age < 20) return 0;
    else if (age < 30) return 1;
    else if (age < 40) return 2;
    else if (age < 50) return 3;
    return 4;
  };

  const onVoteClick = (voteId: number, otherOpinionId: number) => {
    if (agenda)
      voteOrUnvote({
        variables: {
          input: {
            agendaId: agenda.id,
            voteOpinionId: voteId,
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
              {meData?.me.id === agenda?.author?.id && agenda && (
                <button
                  onClick={() => {
                    onDeleteAgendaClick(agenda?.id);
                  }}
                  className="hover:text-red-800"
                >
                  <FontAwesomeIcon
                    className="mx-2 cursor-pointer"
                    icon={solid("trash-can")}
                  />
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
            agenda &&
            data?.getAgendaAndStatsById.agendaDetail && (
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
                  agendaChartStats={
                    data.getAgendaAndStatsById.agendaDetail.agendaChartStatsArr[
                      showChart
                    ]
                  }
                  votedUserCount={agenda?.opinions[showChart].votedUserCount}
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
