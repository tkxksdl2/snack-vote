import { AgendaList } from "../../components/agenda-snippets/agenda-list";
import { Category } from "../../gql/graphql";

interface IAgendasCategory {
  category: Category;
}

export const AgendasCategory: React.FC<IAgendasCategory> = ({ category }) => {
  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 ">
      <div className="max-w-4xl w-full min-h-screen h-full bg-white">
        <AgendaList category={category} />
      </div>
    </div>
  );
};
