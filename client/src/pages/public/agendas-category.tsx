import { AgendaList } from "../../components/agenda-snippets/agenda-list";
import { Category } from "../../gql/graphql";
import { Helmet } from "react-helmet-async";
import { CATEGORY_PARSE_OBJ } from "../../constants";
import { resetDefaultPage } from "../../hooks/reset-default-page";
import { useParams } from "react-router-dom";
interface IAgendasCategory {
  category: Category;
}

type TAgendasSearchParams = {
  query?: string;
};

export const AgendasCategory: React.FC<IAgendasCategory> = ({ category }) => {
  resetDefaultPage();
  const { query } = useParams() as TAgendasSearchParams;
  return (
    <div
      key={`agendas-${category}-${query}`}
      className="flex h-fit justify-center bg-slate-300 "
    >
      <Helmet>
        <title>{CATEGORY_PARSE_OBJ[category]} - SnackVote</title>
      </Helmet>
      <div className="max-w-4xl w-full h-fit bg-white">
        <AgendaList
          key={`agendaList-${category}-${query}`}
          category={category}
          query={query}
        />
      </div>
    </div>
  );
};
