import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  CreateIssueMutation,
  CreateIssueMutationVariables,
} from "../../gql/graphql";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useNavigate } from "react-router-dom";
import { shouldRefetchVar } from "../../apollo";
import { CREATE_ISSUE } from "../../queries/qeury-issues";

interface IForm {
  subject: string;
}

export const CreateIssue = () => {
  const [MDContent, setMDContent] = useState<string>(
    "건의사항에는 마크다운 문법이 사용 가능합니다."
  );
  const navigate = useNavigate();
  const [createIssue, { loading, error }] = useMutation<
    CreateIssueMutation,
    CreateIssueMutationVariables
  >(CREATE_ISSUE, {
    onCompleted: (data: CreateIssueMutation) => {
      if (error) {
        alert(error);
      } else if (data.createIssue.error) {
        alert(data.createIssue.error);
      } else if (data.createIssue.ok) {
        shouldRefetchVar(true);
        alert("건의사항이 게시되었습니다.");
        navigate("/issues");
      }
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IForm>();

  const onValid = () => {
    if (MDContent.length < 5) {
      alert("내용은 5자 이상 입력해주세요.");
      return;
    }
    const { subject } = getValues();
    createIssue({ variables: { input: { subject, content: MDContent } } });
  };

  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 ">
      <Helmet>
        <title>건의사항 - SnackVote</title>
      </Helmet>
      <div className="max-w-3xl w-full">
        <div className="mt-8 mb-4 pl-11 font-bold text-4xl text-gray-800">
          <span className="border-b-2 border-gray-700">건의사항</span>
        </div>
        <div className="pt-8 c-agenda-form h-fit bg-white text-lg text-gray-800 font-semibold rounded-md">
          <form className="px-11" onSubmit={handleSubmit(onValid)}>
            {errors.subject?.message ? (
              <div className="error-div">{errors.subject.message}</div>
            ) : (
              ""
            )}
            <div className="mt-2">제목</div>
            <input
              className="w-full p-1 my-2 bg-gray-200 rounded-sm font-normal"
              placeholder="제목"
              type="text"
              {...register("subject", {
                required: "제목을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "제목은 2자 이상 50자 이내로 입력해주세요.",
                },
                maxLength: {
                  value: 50,
                  message: "제목은 2자 이상 50자 이내로 입력해주세요.",
                },
              })}
            />
            <div>내용</div>
            <MDEditor
              value={MDContent}
              preview="edit"
              height={300}
              extraCommands={[
                commands.codePreview,
                commands.codeEdit,
                commands.fullscreen,
              ]}
              onChange={(value) => {
                value ? setMDContent(value) : setMDContent("");
              }}
            />
            <div className="flex lg:justify-end justify-center">
              <button
                className={
                  "w-32 py-1 my-3 mr-5 rounded-3xl text-white " +
                  (loading
                    ? "bg-slate-700 pointer-events-none"
                    : "bg-slate-500")
                }
              >
                작성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
