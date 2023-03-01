import { useQuery, useReactiveVar } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORY_PARSE_OBJ } from "../../constants";
import { AGENDA_FRAGMENT } from "../../queries/fragments";
import { getFragmentData } from "../../gql";
import {
  AgendaPartsFragment,
  Category,
  SearchAgendasByCategoryQuery,
  SearchAgendasByCategoryQueryVariables,
} from "../../gql/graphql";
import { AgendaFrame } from "./agenda-frame";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { isLoggedInVar } from "../../apollo";
import { SEARCH_AGENDA_BY_CATEGORY } from "../../queries/query-agedas";
import { Pagination } from "../pagination";
import { useForm } from "react-hook-form";
import { resetDefaultPage } from "../../hooks/reset-default-page";

interface IAgendaMain {
  category: Category;
  isMain?: boolean;
  defaultPage?: number;
  query?: string;
}

interface IForm {
  query: string;
}

export const AgendaList: React.FC<IAgendaMain> = ({
  category,
  isMain,
  defaultPage,
  query,
}) => {
  const [page, setPage] = useState(defaultPage ? defaultPage : 1);
  let pageArr: number[] = [];
  const isloggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({ mode: "onSubmit" });
  const onSubmit = () => {
    navigate(`/${category.toLowerCase()}/${getValues("query")}`);
  };

  const { data, loading, error } = useQuery<
    SearchAgendasByCategoryQuery,
    SearchAgendasByCategoryQueryVariables
  >(SEARCH_AGENDA_BY_CATEGORY, {
    variables: {
      input: { category, page: isMain ? 1 : page, ...(query ? { query } : {}) },
    },
  });
  let agendas = getFragmentData<AgendaPartsFragment>(
    AGENDA_FRAGMENT,
    data?.searchAgendasByCategory.agendas
  );
  if (isMain) agendas = agendas?.slice(0, 4);
  else if (data?.searchAgendasByCategory.totalPage) {
    const start = page - (page % 10) + 1;
    const end = Math.min(data.searchAgendasByCategory.totalPage, start + 9);
    for (let i = start; i <= end; i++) pageArr.push(i);
  }

  return (
    <React.Fragment>
      <div className="px-11 font-semibold text-lg text-gray-800">
        <div className="w-full border-b border-b-gray-400 flex justify-between">
          <Link onClick={resetDefaultPage} to={`/${category.toLowerCase()}`}>
            <div className="py-2 w-fit border-b border-b-gray-700">
              {CATEGORY_PARSE_OBJ[category]}
            </div>
          </Link>
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
          <div className="pt-3 pb-6 px-5 grid lg:grid-cols-2 gap-y-4 grid-cols-1">
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
          {!isMain && data?.searchAgendasByCategory.totalPage && (
            <Pagination
              page={page}
              totalPage={data?.searchAgendasByCategory.totalPage}
              setPage={setPage}
            />
          )}
        </div>
      ) : (
        <div className="flex justify-center text-semibold py-5">
          <span>{query ? "검색 결과가 없습니다." : "아직 투표가 없네요!"}</span>
        </div>
      )}
      {!isMain && (
        <div id="search" className="px-11 mt-6 mb-10 flex justify-end">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-end">
              <input
                className="w-48 h-8 border rounded-sm px-2 focus:outline-gray-600"
                type="text"
                {...register("query", {
                  required: "검색어를 입력해주세요",
                  minLength: {
                    value: 2,
                    message: "검색어는 2글자에서 20글자 이내입니다.",
                  },
                  maxLength: {
                    value: 20,
                    message: "검색어는 2글자에서 20글자 이내입니다.",
                  },
                })}
              />
              <button>
                <FontAwesomeIcon
                  className="ml-3 mr-1"
                  icon={solid("magnifying-glass")}
                />
              </button>
              {errors.query && (
                <div className="text-sm text-gray-400 font-light text-end break-words">
                  {errors.query.message}
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};
