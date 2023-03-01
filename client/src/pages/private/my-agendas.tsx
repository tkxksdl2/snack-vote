import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/pagination";
import { getFragmentData } from "../../gql";
import {
  AgendaPartsFragment,
  GetMyAgendasQuery,
  GetMyAgendasQueryVariables,
} from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { AGENDA_FRAGMENT } from "../../queries/fragments";
import { GET_MY_AGENDAS } from "../../queries/query-agedas";
import { Helmet } from "react-helmet-async";

export const MyAgendas = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery<GetMyAgendasQuery, GetMyAgendasQueryVariables>(
    GET_MY_AGENDAS,
    { variables: { input: { page } } }
  );
  const agendas = getFragmentData<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.getMyAgendas.agendas
  );
  const navigate = useNavigate();
  return (
    <div className="flex h-fit justify-center bg-slate-300 ">
      <div className="max-w-4xl w-full min-h-fit h-full bg-white px-5 py-8">
        <Helmet>
          <title>SnackVote</title>
        </Helmet>
        <div className=" text-lg font-semibold text-gray-800">작성 글</div>
        <div className="my-agenda-grid text-center border-y">
          <span>작성일자</span>
          <span>제목</span>
          <span>투표 수</span>
        </div>
        <div className="mb-3">
          {agendas && agendas.length ? (
            agendas?.map((agenda) => {
              const cnt = agenda.opinions.reduce(
                (acc, cur) => acc + cur.votedUserCount,
                0
              );
              return (
                <div
                  key={agenda.id}
                  onClick={() => {
                    navigate(`/agenda/${agenda.id}`);
                  }}
                  className="my-agenda-grid py-1 border-b cursor-pointer"
                >
                  <span>{parseDate(agenda.createdAt)}</span>
                  <span className=" overflow-hidden overflow-ellipsis">
                    {agenda.subject}
                  </span>
                  <span className="text-center text-sm font-semibold text-gray-600">
                    {cnt}
                  </span>
                </div>
              );
            })
          ) : (
            <>작성글이 없습니다.</>
          )}
        </div>
        {data?.getMyAgendas.totalPage ? (
          <Pagination
            page={page}
            totalPage={data.getMyAgendas.totalPage}
            setPage={setPage}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
