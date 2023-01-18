import { CommentPartsFragment } from "../../gql/graphql";
import date from "date-and-time";

interface ICommentProp {
  comment: CommentPartsFragment;
}

export const CommentFrame: React.FC<ICommentProp> = ({ comment }) => {
  const parsedDate = date.format(
    new Date(comment.createdAt),
    "YYYY/MM/DD HH:MM"
  );
  return (
    <div className="py-2 min-h-comment">
      <div className={comment.depth === 0 ? "pl-3" : "pl-8"}>
        <div className="px-3 text-sm border-b-2 border-gray-200 bg-gray-100 flex justify-between">
          <span>{comment.author?.name}</span>
          <span>{parsedDate}</span>
        </div>
        <div className="font-medium px-2">{comment.content}</div>
      </div>
    </div>
  );
};
