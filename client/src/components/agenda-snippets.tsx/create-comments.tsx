import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { cache } from "../../apollo";
import { COMMENT_FRAGMENT } from "../../fragments";
import { getFragmentData } from "../../gql";
import {
  CommentPartsFragment,
  CreateCommentsMutation,
  CreateCommentsMutationVariables,
} from "../../gql/graphql";
import { textareaAutoHeight } from "../../hooks/textarea-auto-height";
import { GET_AGENDA_AND_COMMENTS } from "../../pages/public/agenda-detail";

const CREATE_COMMENTS = gql`
  mutation createComments($input: CreateCommentsInput!) {
    createComments(input: $input) {
      ok
      error
      comments {
        ...CommentParts
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

interface ICreateComments {
  agendaId: number;
  bundleId?: number;
  commentPage: number;
}

export const CreateComments: React.FC<ICreateComments> = ({
  agendaId,
  bundleId,
  commentPage,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ content: string }>();
  const [createComments, { loading }] = useMutation<
    CreateCommentsMutation,
    CreateCommentsMutationVariables
  >(CREATE_COMMENTS, {
    onCompleted: (data) => {
      const comment = getFragmentData<CommentPartsFragment>(
        COMMENT_FRAGMENT,
        data.createComments.comments
      );
      cache.updateQuery(
        {
          query: GET_AGENDA_AND_COMMENTS,
          variables: {
            commentsInput: { page: commentPage, agendaId },
            agendaInput: { id: agendaId },
          },
        },
        (data) => {
          const newComments = [...data.getCommentsByAgenda.comments];
          let spliceIndex;
          newComments.forEach((v, index) => {
            if (v.bundleId === comment?.bundleId) {
              spliceIndex = index + 1;
            }
          });
          if (spliceIndex) newComments.splice(spliceIndex, 0, comment);
          else newComments.push(comment);
          return {
            ...data,
            getCommentsByAgenda: {
              ...data.getCommentsByAgenda,
              comments: newComments,
            },
          };
        }
      );
      alert("댓글이 작성되었습니다");
    },
  });

  const onsubmit = () => {
    const { content } = getValues();
    if (!loading) {
      createComments({
        variables: {
          input: {
            agendaId,
            bundleId,
            content,
          },
        },
      });
    }
  };
  const onInvalid = () => {
    if (errors.content?.message) alert(errors.content?.message);
    else alert("알수없는 에러입니다.");
  };

  // auto textArea height expand
  let textArea = document.querySelector("#text-area") as HTMLTextAreaElement,
    hiddenDiv = document.querySelector("#hidden-div") as HTMLDivElement;
  textareaAutoHeight(textArea, hiddenDiv);

  return (
    <form onSubmit={handleSubmit(onsubmit, onInvalid)}>
      <div className="h-fit">
        <div
          id="hidden-div"
          className=" hiddendiv w-full p-1 text-base font-normal"
        ></div>
        <textarea
          id="text-area"
          className="p-1 w-full border border-gray-400 rounded-md text-base font-normal
        focus:outline-1 focus:outline-blue-300 overflow-hidden resize-none"
          {...register("content", { required: "내용을 입력하세요" })}
        ></textarea>
      </div>
      <div className=" text-end">
        <button
          className={
            `mx-5 bg-slate-700 rounded-xl text-base text-white font-medium px-3 py-1 ` +
            (loading && "pointer-events-none")
          }
        >
          작성
        </button>
      </div>
    </form>
  );
};
