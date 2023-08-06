import { Link } from "react-router-dom";
import { CATEGORY_PARSE_OBJ } from "../constants";
import { Category } from "../gql/graphql";
import { resetDefaultPage } from "../hooks/reset-default-page";

interface IHeaderCategoryButtonProp {
  category: Category;
}

export const HeaderCategoryButton: React.FC<IHeaderCategoryButtonProp> = ({
  category,
}) => {
  return (
    <Link onClick={resetDefaultPage} to={`/${category.toLowerCase()}`}>
      <span className="px-2 border-r border-r-white">
        <span className="px-1 rounded-lg hover:bg-gray-600 transition-colors">
          {CATEGORY_PARSE_OBJ[category]}
        </span>
      </span>
    </Link>
  );
};
