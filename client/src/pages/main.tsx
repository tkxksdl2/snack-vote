import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AgendaFrame } from "../components/agenda-snippets.tsx/agenda-frame";
import { AGENDA_FRAGMENT } from "../fragments";
import { getFragmentData } from "../gql";
import {
  AgendaPartsFragment,
  GetAllAgendasQuery,
  GetAllAgendasQueryVariables,
} from "../gql/graphql";

const GET_ALL_AGENDAS = gql`
  query getAllAgendas($input: GetAllAgendasInput!) {
    getAllAgendas(input: $input) {
      ok
      error
      totalPage
      agendas {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const Main = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    GetAllAgendasQuery,
    GetAllAgendasQueryVariables
  >(GET_ALL_AGENDAS, {
    variables: {
      input: {
        page,
      },
    },
  });
  const agendas = getFragmentData<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.getAllAgendas.agendas
  );

  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 ">
      <div className="max-w-4xl w-full min-h-screen h-full bg-white">
        <div className="px-11 font-semibold text-lg text-gray-800">
          <div className="w-full border-b border-b-gray-400">
            <div className="py-2 w-fit border-b border-b-gray-700">새 투표</div>
          </div>
        </div>
        <div className="pt-3 pb-10 px-5 grid lg:grid-cols-2 gap-y-8 grid-cols-1 border-b border-b-black">
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
      </div>
    </div>
  );
};
