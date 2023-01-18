import React from "react";

export const Header = () => {
  return (
    <React.Fragment>
      <header className="py-4 lg:px-5 px-1 bg-teal-100 border border-b-2 flex justify-center">
        <div className="lg:max-w-4xl max-w-screen-md w-full px-2">
          <div className="lg:w-auto w-60">
            <span className="font-bold text-4xl text-gray-700">Snack Vote</span>
            <span className="mx-10 text-sm font-bold text-gray-500">
              간식처럼 간단한 투표
            </span>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};
