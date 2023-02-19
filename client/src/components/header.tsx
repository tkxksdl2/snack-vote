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

  const openUserModal = () => {
    closeUserDetailDiv.style.visibility = "visible";
    setUserIsOpen(true);
  };

  const logout = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STARAGE_TOKEN);
    localStorage.removeItem(LOCAL_STARAGE_REFRESH_ID);
    accessTokenVar(null);
    refreshTokenIdVar(null);
    cache.evict({ id: `User:${data?.me.id}` + "" });
  };
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data, refetch, loading } = useMe();
  return (
    <React.Fragment>
      <header className="pt-4 pb-2 lg:px-5 px-1 bg-teal-100 border border-b-2 flex justify-center">
        <div className="lg:max-w-4xl max-w-screen-md w-full px-2 flex justify-between text-gray-700">
          <div className="lg:w-auto w-60">
            <Link to="/">
              <span className="font-bold text-4xl">Snack Vote</span>
            </Link>
            <span className="mx-10 text-sm font-bold text-gray-500">
              간식처럼 간단한 투표
            </span>
          </div>
          {!isLoggedIn ? (
            <React.Fragment>
              <button
                onClick={openModal}
                className=" bg-zinc-400 px-3 rounded-2xl font-bold text-white"
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
              <div className="h-6 w-6 mb-1 mx-2">
                <button>
                  <FontAwesomeIcon
                    onClick={openUserModal}
                    className="h-6 w-6 p-1 rounded-full bg-gray-300"
                    icon={solid("user")}
                  />
                </button>
                {userIsOpen && (
                  <div
                    className="relative flex flex-col h-fit w-52 shadow-md z-10 
                               font-semibold bg-white break-words rounded-sm right-40"
                  >
                    <div className="px-2 mt-2 text-sm">
                      <FontAwesomeIcon className="mr-1" icon={solid("user")} />
                      {data?.me.name}
                    </div>
                    <div className="px-2 mt-1 mb-2 text-sm w-fit">
                      <span>
                        <FontAwesomeIcon
                          className="mr-1"
                          icon={solid("envelope")}
                        />
                        {data?.me.email}
                      </span>
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
      <div className="bg-blue-900 flex justify-center">
        <div className="py-1 px-2 lg:max-w-2xl max-w-md w-full  text-white">
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
