import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { agendaListDefaultPageVar } from "../apollo";

interface IPaginationProps {
  page: number;
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  totalPage,
  setPage,
}) => {
  let pageArr: number[] = [];
  if (totalPage) {
    const start = page - (page % 10) + 1;
    const end = Math.min(totalPage, start + 9);
    for (let i = start; i <= end; i++) pageArr.push(i);
  }

  return (
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
      <div className=" bg-slate-300 rounded-full px-3 mx-3">
        {pageArr.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              agendaListDefaultPageVar(p);
              setPage(p);
            }}
            className={"px-1 " + (page === p && `border-b-2 border-b-gray-500`)}
          >
            {p}
          </button>
        ))}
      </div>
      {pageArr[pageArr.length - 1] < totalPage && (
        <button
          onClick={() => {
            setPage(pageArr[pageArr.length - 1] + 1);
          }}
        >
          <FontAwesomeIcon icon={solid("arrow-right")} />
        </button>
      )}
    </div>
  );
};
