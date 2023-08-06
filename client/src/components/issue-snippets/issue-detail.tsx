import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { getFragmentData } from "../../gql";
import {
  AddIssueContentMutation,
  AddIssueContentMutationVariables,
  DeleteIssueMutation,
  DeleteIssueMutationVariables,
  GetIssueAndContentsByIdQuery,
  GetIssueAndContentsByIdQueryVariables,
  IssueContentPartsFragment,
  UserRole,
} from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { useMe } from "../../hooks/use-me";
import { CountHasAnswerComp } from "./count-has-answer-comp";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useState } from "react";
import { isLoggedInVar, shouldRefetchVar } from "../../apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { IssueContent } from "./issue-content";
import {
  DELETE_ISSUE,
  GET_ISSUE_AND_CONTENTS_BY_ID,
} from "../../queries/qeury-issues";
import { ISSUE_CONTENT_FRAGMENT } from "../../queries/fragments";
import { ADD_ISSUE_CONTENT } from "../../queries/query-issue-contents";

type TIssueParams = {
  id: string;
};

export const IssueDetail = () => {
  const { id } = useParams() as TIssueParams;
  const [MDContent, setMDContent] = useState<string>("");
  const [updateSeletedId, setUpdateSelectedId] = useState<number>(-1);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const navigate = useNavigate();

  const { data: meData } = useMe();
  const { data, refetch } = useQuery<
    GetIssueAndContentsByIdQuery,
    GetIssueAndContentsByIdQueryVariables
  >(GET_ISSUE_AND_CONTENTS_BY_ID, {
    variables: { input: { issueId: +id } },
  });
  const issue = data?.getIssueAndContentsById.issue;
  const issueContents = getFragmentData<IssueContentPartsFragment>(
    ISSUE_CONTENT_FRAGMENT,
    data?.getIssueAndContentsById.issue?.issueContents
  );

  const [addIssueContent, { loading }] = useMutation<
    AddIssueContentMutation,
    AddIssueContentMutationVariables
  >(ADD_ISSUE_CONTENT);
  const [deleteIssue, { loading: deleteIssueLoading }] = useMutation<
    DeleteIssueMutation,
    DeleteIssueMutationVariables
  >(DELETE_ISSUE, { variables: { input: { issueId: +id } } });

  const onClick = () => {
    if (MDContent.length < 5) {
      alert("내용은 5자 이상 입력해주세요.");
    } else if (!loading) {
      addIssueContent({
        variables: { input: { issueId: +id, content: MDContent } },
        onCompleted: (data: AddIssueContentMutation) => {
          if (data.addIssueContent.ok) {
            refetch({ input: { issueId: +id } });
            shouldRefetchVar(true);
          }
        },
      });
    }
  };

  const onDeleteIssueClick = () => {
    if (
      !isLoggedIn ||
      (meData?.me.id !== issue?.author?.id &&
        meData?.me.role !== UserRole.Admin)
    ) {
      alert("삭제할 권한이 없습니다.");
      return;
    }
    if (!deleteIssueLoading && window.confirm("정말 삭제하시겠습니까?")) {
      deleteIssue({
        onCompleted: (data: DeleteIssueMutation) => {
          if (data.deleteIssue.ok) {
            shouldRefetchVar(true);
            navigate("/issues/");
          } else alert(data.deleteIssue.error);
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 text-gray-700">
      <div className="max-w-4xl w-full min-h-screen h-full bg-white">
        <div className="px-5 font-semibold text-lg ">
          <div className="py-10 flex flex-col ">
            <Helmet>
              <title>{issue?.subject}</title>
            </Helmet>
            <div
              // ref={subjectRef}
              id="subject"
              className="py-1 px-2 w-full bg-indigo-100 border-b-2 border-b-gray-700 
                break-words relative flex flex-row"
            >
              <div className="flex justify-center items-center">
                <CountHasAnswerComp
                  contentCount={issue?.contentCount}
                  hasAnswer={issue?.hasAnswer}
                />
              </div>
              <div className=" w-10/12 break-words">{`🛠 ${issue?.subject}`}</div>
            </div>
            <div className="flex justify-between text-sm font-mono p-2">
              <span>
                by {issue?.author?.name ? issue?.author?.name : "unknown"}
                <span className="ml-3">{parseDate(issue?.createdAt)}</span>
              </span>
              {isLoggedIn &&
                (meData?.me.id === issue?.author?.id ||
                  meData?.me.role === UserRole.Admin) && (
                  <button
                    onClick={onDeleteIssueClick}
                    className="hover:text-red-800"
                  >
                    <FontAwesomeIcon
                      className="mx-2 cursor-pointer"
                      icon={solid("trash-can")}
                    />
                    글 삭제
                  </button>
                )}
            </div>
            <div
              id="content-start"
              className="border-y h-2 border-gray-300"
            ></div>
          </div>
          <div className="flex flex-col items-center text-base font-normal">
            {issueContents?.map((issueContent) => {
              return (
                <IssueContent
                  key={`issueContent-${issueContent.id}`}
                  issueContent={issueContent}
                  updateSelectedId={updateSeletedId}
                  setUpdateSelectedId={setUpdateSelectedId}
                  issueRefetch={refetch}
                />
              );
            })}

            <div className="w-5/6">
              <MDEditor
                value={MDContent}
                preview="edit"
                extraCommands={[
                  commands.codePreview,
                  commands.codeEdit,
                  commands.fullscreen,
                ]}
                onChange={(value) => {
                  value ? setMDContent(value) : setMDContent("");
                }}
              />
              <div className=" text-end">
                <button
                  className={
                    "my-2 mx-5 bg-slate-700 rounded-xl text-base text-white font-medium px-3 py-1 " +
                    (loading
                      ? "bg-slate-700 pointer-events-none"
                      : "bg-slate-500")
                  }
                  onClick={onClick}
                >
                  의견 작성
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
