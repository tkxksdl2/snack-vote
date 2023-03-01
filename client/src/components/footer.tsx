import { Link } from "react-router-dom";
import { CATEGORY_PARSE_OBJ } from "../constants";
import { Category } from "../gql/graphql";
import { resetDefaultPage } from "../hooks/reset-default-page";

export const Footer = () => {
  return (
    <footer className=" bg-slate-300 flex justify-center flex-auto">
      <div className="max-w-4xl w-full font-semibold px-10 pb-10 pt-6 text-blue-800">
        <Link
          onClick={resetDefaultPage}
          to={`/${Category.Humor.toLowerCase()}`}
        >
          <span className="mx-4 hover:text-blue-500">
            {CATEGORY_PARSE_OBJ[Category.Humor]}
          </span>
        </Link>
        <Link
          onClick={resetDefaultPage}
          to={`/${Category.Culture.toLowerCase()}`}
        >
          <span className="mx-4 hover:text-blue-500">
            {CATEGORY_PARSE_OBJ[Category.Culture]}
          </span>
        </Link>
        <Link
          onClick={resetDefaultPage}
          to={`/${Category.Social.toLowerCase()}`}
        >
          <span className="mx-4 hover:text-blue-500">
            {CATEGORY_PARSE_OBJ[Category.Social]}
          </span>
        </Link>
        <Link onClick={resetDefaultPage} to={`/${Category.Game.toLowerCase()}`}>
          <span className="mx-4 hover:text-blue-500">
            {CATEGORY_PARSE_OBJ[Category.Game]}
          </span>
        </Link>
        <div className="mx-4 mt-2 text-sm text-gray-500">
          간식처럼 간단한 투표
        </div>
      </div>
    </footer>
  );
};
