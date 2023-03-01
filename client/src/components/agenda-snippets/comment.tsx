import { CommentPartsFragment, UserRole } from "../../gql/graphql";
import { useMe } from "../../hooks/use-me";
import { parseDate } from "../../hooks/parse";

interface ICommentProp {
  comment: CommentPartsFragment;
}

export const CommentFrame: React.FC<ICommentProp> = ({ comment }) => {
  const { data } = useMe();
  const parsedDate = parseDate(comment.createdAt);
  return (
    <div className="pt-2 min-h-comment">
      <div className={comment.depth === 0 ? "pl-3" : "pl-8"}>
        <div
          className={
            `px-3 text-sm border-b-2  bg-gray-100 flex justify-between ` +
            (data?.me.id === comment.author?.id
              ? "bg-blue-100 border-gray-300"
              : "bg-gray-100 border-gray-200")
          }
        >
          <span>{comment.author?.name}</span>
          {data?.me.role === UserRole.Admin && comment.deletedAt && (
            <span className="text-red-700">삭제 된 댓글</span>
          )}
          <span>{parsedDate}</span>
        </div>
        <div className="font-medium px-2 whitespace-pre-wrap break-words">
          {comment.content}
        </div>
      </div>
    </div>
  );
};
