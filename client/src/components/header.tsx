import { useReactiveVar } from "@apollo/client";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  accessTokenVar,
  cache,
  isLoggedInVar,
  refreshTokenIdVar,
} from "../apollo";
import {
  CATEGORY_PARSE_OBJ,
  LOCAL_STARAGE_REFRESH_ID,
  LOCAL_STARAGE_TOKEN,
  SEX_PARSE_OBJ,
} from "../constants";
import { Category } from "../gql/graphql";
import { resetDefaultPage } from "../hooks/reset-default-page";
import { useMe } from "../hooks/use-me";

import { LoginModal } from "./login-modal";

const root = document.querySelector("#root");
const closeUserDetailDiv = document.createElement("div");
closeUserDetailDiv.style.position = "fixed";
closeUserDetailDiv.style.width = "100%";
closeUserDetailDiv.style.height = "100%";
closeUserDetailDiv.style.top = "0";
closeUserDetailDiv.style.left = "0";
closeUserDetailDiv.style.visibility = "hidden";

export const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const [userIsOpen, setUserIsOpen] = useState(false);
  useEffect(() => {
    closeUserDetailDiv.addEventListener("click", () => {
      setUserIsOpen(false);
      closeUserDetailDiv.style.visibility = "hidden";
    });
    root?.appendChild(closeUserDetailDiv);
  }, []);

  const openUserDropout = () => {
    closeUserDetailDiv.style.visibility = "visible";
    setUserIsOpen(true);
  };

  const logout = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STARAGE_TOKEN);
    localStorage.removeItem(LOCAL_STARAGE_REFRESH_ID);
    accessTokenVar(null);
    refreshTokenIdVar(null);
    cache.reset();
  };
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data, refetch, loading } = useMe();
  return (
    <React.Fragment>
      <header className="pt-3 pb-1 lg:px-5 px-1 bg-header border border-b-2 flex justify-center">
        <div className="lg:max-w-4xl max-w-screen-md w-full px-2 flex justify-between items-center text-gray-700">
          <div className="lg:w-auto w-60 flex lg:flex-row lg:items-end flex-col">
            <Link to="/">
              <span
                className="font-bold text-4xl"
                style={{ fontFamily: '"Zen Dots" , cursive' }}
              >
                <span className=" text-orange-700">Snack</span> Vote
              </span>
            </Link>
            <span className="lg:mx-10 mx-4 text-sm font-bold text-gray-500">
              간식처럼 간단한 투표
            </span>
          </div>
          {!isLoggedIn ? (
            <React.Fragment>
              <button
                onClick={openModal}
                className="bg-zinc-400 px-3 lg:h-full h-14 rounded-2xl font-bold text-white"
              >
                로그인
              </button>
              <LoginModal
                modalIsOpen={modalIsOpen}
                setIsOpen={setIsOpen}
                refetch={refetch}
              />
            </React.Fragment>
          ) : (
            <div className="flex items-end">
              <div className="h-6 w-6 mb-2 mx-2">
                <button>
                  <FontAwesomeIcon
                    onClick={openUserDropout}
                    className="h-6 w-6 p-1 rounded-full bg-gray-300"
                    icon={solid("user")}
                  />
                </button>
                {userIsOpen && data && (
                  <div
                    id="user-dropout"
                    className="relative flex flex-col h-fit w-52 shadow-md z-10 
                               font-semibold bg-white break-words rounded-sm right-40"
                  >
                    <div className="px-2 mt-2 text-sm">
                      <FontAwesomeIcon className="mr-1" icon={solid("user")} />
                      {data?.me.name}
                    </div>
                    <div className="px-2 mt-1 text-sm w-fit">
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={solid("envelope")}
                      />
                      {data?.me.email}
                    </div>
                    <div className="px-2 mt-1 mb-2 text-sm w-fit">
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={solid("children")}
                      />
                      <span>
                        {new Date().getFullYear() -
                          new Date(data.me.birth).getFullYear()}
                        세{" "}
                      </span>
                      <span>{SEX_PARSE_OBJ[data?.me.sex]}</span>
                    </div>
                    <div className="px-2 py-1 border-y flex flex-col items-start">
                      <Link to={"/update-user/"}>
                        <button>정보 변경</button>
                      </Link>
                      <Link to={"/my-agendas/"}>
                        <button>작성 글 보기</button>
                      </Link>
                      <Link to={"/my-comments/"}>
                        <button>작성 댓글 보기</button>
                      </Link>
                      <Link to={"/voted-op/"}>
                        <button>투표한 의견 보기</button>
                      </Link>
                    </div>
                    <button
                      className=" py-2 bg-gray-100 font-bold text-blue-900 hover:text-red-800 transition-colors"
                      onClick={logout}
                    >
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={solid("door-open")}
                      />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="bg-naviation flex justify-center">
        <div className="py-1 px-2 lg:max-w-2xl max-w-md w-full text-gray-200">
          <Link
            onClick={resetDefaultPage}
            to={`/${Category.Humor.toLowerCase()}`}
          >
            <span className="px-3 border-r border-r-white">
              {CATEGORY_PARSE_OBJ[Category.Humor]}
            </span>
          </Link>
          <Link
            onClick={resetDefaultPage}
            to={`/${Category.Culture.toLowerCase()}`}
          >
            <span className="px-3 border-r border-r-white">
              {CATEGORY_PARSE_OBJ[Category.Culture]}
            </span>
          </Link>
          <Link
            onClick={resetDefaultPage}
            to={`/${Category.Social.toLowerCase()}`}
          >
            <span className="px-3 border-r border-r-white">
              {CATEGORY_PARSE_OBJ[Category.Social]}
            </span>
          </Link>
          <Link
            onClick={resetDefaultPage}
            to={`/${Category.Game.toLowerCase()}`}
          >
            <span className="px-3">{CATEGORY_PARSE_OBJ[Category.Game]}</span>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};
