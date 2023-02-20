import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_PARSE_OBJ } from "../../constants";
import { AGENDA_FRAGMENT } from "../../queries/fragments";
import { getFragmentData } from "../../gql";
import {
  AgendaPartsFragment,
  Category,
  GetAgendasByCategoryQuery,
  GetAgendasByCategoryQueryVariables,
} from "../../gql/graphql";
import { AgendaFrame } from "./agenda-frame";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { agendaListDefaultPageVar, isLoggedInVar } from "../../apollo";
import { GET_AGENDA_BY_CATEGORY } from "../../queries/query-agedas";

interface IAgendaMain {
  category: Category;
  isMain?: boolean;
  defaultPage?: number;
}

export const AgendaList: React.FC<IAgendaMain> = ({
  category,
  isMain,
  defaultPage,
}) => {
  const [page, setPage] = useState(defaultPage ? defaultPage : 1);
  let pageArr: number[] = [];
  const isloggedIn = useReactiveVar(isLoggedInVar);

  const { data, loading } = useQuery<
    GetAgendasByCategoryQuery,
    GetAgendasByCategoryQueryVariables
  >(GET_AGENDA_BY_CATEGORY, {
    variables: { input: { category, page: isMain ? 1 : page } },
  });
  let agendas = getFragmentData<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.getAgendasByCategory.agendas
  );
  if (isMain) agendas = agendas?.slice(0, 4);
  else if (data?.getAgendasByCategory.totalPage) {
    const start = page - (page % 10) + 1;
    const end = Math.min(data.getAgendasByCategory.totalPage, start + 9);
    for (let i = start; i <= end; i++) pageArr.push(i);
  }

  return (
    <React.Fragment>
      <div className="px-11 font-semibold text-lg text-gray-800">
        <div className="w-full border-b border-b-gray-400 flex justify-between">
          <div className="py-2 w-fit border-b border-b-gray-700">
            {CATEGORY_PARSE_OBJ[category]}
          </div>
          {!isMain && isloggedIn && (
            <Link to={`/${category.toLowerCase()}/create-agenda/`}>
              <div className="pt-3 text-base">
                <FontAwesomeIcon className="mx-1" icon={solid("pencil")} />
                투표 쓰기
              </div>
            </Link>
          )}
        </div>
      </div>
      {agendas?.length ? (
        <div>
          <div className="pt-3 pb-10 px-5 grid lg:grid-cols-2 gap-y-4 grid-cols-1">
            {agendas.map((agenda, index) => {
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
          {!isMain && data?.getAgendasByCategory.totalPage && (
            <div className="flex justify-center items-center">
              {page > 10 && (
                <button
                  onClick={() => {
                    setPage(pageArr[0] - 1);
                  }}
                >
                  <FontAwesomeIcon icon={solid("arrow-left")} />
                </button>
              )}
              <div className=" bg-slate-300 rounded-full px-2 mx-3">
                {pageArr.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      agendaListDefaultPageVar(p);
                      setPage(p);
                    }}
                    className={
                      "px-1 " + (page === p && `border-b-2 border-b-gray-500`)
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
              {pageArr[pageArr.length - 1] <
                data?.getAgendasByCategory.totalPage && (
                <button
                  onClick={() => {
                    setPage(pageArr[pageArr.length - 1] + 1);
                  }}
                >
                  <FontAwesomeIcon icon={solid("arrow-right")} />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center text-semibold py-5">
          <span>아직 투표가 없네요!</span>
        </div>
      )}
    </React.Fragment>
  );
};
