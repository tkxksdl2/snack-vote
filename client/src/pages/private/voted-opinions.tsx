import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/pagination";
import {
  GetVotedOpinionsQuery,
  GetVotedOpinionsQueryVariables,
} from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { GET_VOTED_OPINIONS } from "../../queries/query-agedas";
import { Helmet } from "react-helmet-async";

export const VotedOpinions = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery<
    GetVotedOpinionsQuery,
    GetVotedOpinionsQueryVariables
  >(GET_VOTED_OPINIONS, { variables: { input: { page } } });
  const navigate = useNavigate();
  const opinions = data?.getVotedOpinions.opinions;
  return (
    <div className="flex h-fit justify-center bg-slate-300 ">
      <div className="max-w-4xl w-full min-h-fit h-full bg-white px-5 py-8">
        <Helmet>
          <title>SnackVote</title>
        </Helmet>
        <div className=" text-lg font-semibold text-gray-800">투표 내역</div>
        <div className="voted-opinions-grid text-center border-y">
          <span>작성일자</span>
          <span>투표 제목</span>
          <span>의견</span>
          <span>투표 수</span>
        </div>
        <div className="mb-3">
          {opinions && opinions.length > 0 ? (
            opinions?.map((opinion) => {
              return (
                <div
                  key={opinion.id}
                  onClick={() => {
                    navigate(`/agenda/${opinion.agenda?.id}`);
                  }}
                  className="voted-opinions-grid py-1 border-b cursor-pointer"
                >
                  <span>{parseDate(opinion.agenda?.createdAt)}</span>
                  <span className=" overflow-hidden overflow-ellipsis">
                    {opinion.agenda?.subject}
                  </span>
                  <span className=" overflow-hidden overflow-ellipsis">
                    {opinion.opinionText}
                  </span>
                  <span className="text-center text-sm font-semibold text-gray-600">
                    {opinion.votedUserCount}
                  </span>
                </div>
              );
            })
          ) : (
            <>투표한 의견이 없습니다.</>
          )}
        </div>
        {data?.getVotedOpinions.totalPage ? (
          <Pagination
            page={page}
            totalPage={data.getVotedOpinions.totalPage}
            setPage={setPage}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
