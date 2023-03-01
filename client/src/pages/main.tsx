import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { AgendaFrame } from "../components/agenda-snippets/agenda-frame";
import { AgendaList } from "../components/agenda-snippets/agenda-list";
import { AGENDA_FRAGMENT } from "../queries/fragments";
import { getFragmentData } from "../gql";
import {
  AgendaPartsFragment,
  Category,
  GetMostVotedAgendasQuery,
  GetMostVotedAgendasQueryVariables,
} from "../gql/graphql";
import { resetDefaultPage } from "../hooks/reset-default-page";
import { Helmet } from "react-helmet-async";
import { GET_MOST_VOTED_AGENDAS } from "../queries/query-agedas";

export const Main = () => {
  const { data } = useQuery<
    GetMostVotedAgendasQuery,
    GetMostVotedAgendasQueryVariables
  >(GET_MOST_VOTED_AGENDAS);
  resetDefaultPage();
  const agendas = getFragmentData<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.getMostVotedAgendas.agendas
  );
  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 ">
      <div className="max-w-4xl w-full min-h-screen h-full bg-white">
        <div className="px-11 font-semibold text-lg text-gray-800">
          <Helmet>
            <title>SnackVote</title>
          </Helmet>
          <div className="w-full border-b border-b-gray-400">
            <div className="py-2 w-fit border-b border-b-gray-700">
              최근 인기
            </div>
          </div>
        </div>
        <div className="pt-3 pb-6 px-5 grid lg:grid-cols-2 gap-y-4 grid-cols-1">
          {agendas?.map((agenda, index) => {
            return (
              <div
                key={index + ""}
                className="flex items-center justify-center"
              >
                <Link to={`/agenda/${agenda.id}`}>
                  <AgendaFrame agenda={agenda} />
                </Link>
              </div>
            );
          })}
        </div>
        <AgendaList category={Category.Humor} isMain={true} />
        <AgendaList category={Category.Culture} isMain={true} />
        <AgendaList category={Category.Social} isMain={true} />
        <AgendaList category={Category.Game} isMain={true} />
      </div>
    </div>
  );
};
