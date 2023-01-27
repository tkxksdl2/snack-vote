import { useReactiveVar } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  accessTokenVar,
  cache,
  isLoggedInVar,
  refreshTokenIdVar,
} from "../apollo";
import { LOCAL_STARAGE_REFRESH_ID, LOCAL_STARAGE_TOKEN } from "../constants";
import { useMe } from "../hooks/use-me";

import { LoginModal } from "./login-modal";

export const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
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
      <header className="py-4 lg:px-5 px-1 bg-teal-100 border border-b-2 flex justify-center">
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
              <span className=" text-sm font-semibold">
                {loading ? "loading.." : `${data?.me.name}`}
              </span>
              <button
                className="ml-3 font-bold text-blue-900 hover:text-red-800 transition-colors"
                onClick={logout}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </header>
    </React.Fragment>
  );
};
