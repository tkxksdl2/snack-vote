import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useState } from "react";
import { isLoggedInVar, shouldRefetchVar } from "../../apollo";
import {
  DeleteIssuecontentMutation,
  DeleteIssuecontentMutationVariables,
  IssueContentPartsFragment,
  UpdateIssueContentMutation,
  UpdateIssueContentMutationVariables,
  UserRole,
} from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { useMe } from "../../hooks/use-me";
import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  DELETE_ISSUE_CONTENT,
  UPDATE_ISSUE_CONTENT,
} from "../../queries/query-issue-contents";

interface IIssueContentProp {
  issueContent: IssueContentPartsFragment;
  updateSelectedId: number;
  setUpdateSelectedId: Dispatch<SetStateAction<number>>;
  issueRefetch: any;
}

export const IssueContent: React.FC<IIssueContentProp> = ({
  issueContent,
  updateSelectedId,
  setUpdateSelectedId,
  issueRefetch,
}) => {
  const [updateMDContent, setUpdateMDContent] = useState<string>("");
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data: meData } = useMe();

  const [updateIssueContent, { loading: updateLoading }] = useMutation<
    UpdateIssueContentMutation,
    UpdateIssueContentMutationVariables
  >(UPDATE_ISSUE_CONTENT);
  const [deleteIssueContent, { loading: deleteLoading }] = useMutation<
    DeleteIssuecontentMutation,
    DeleteIssuecontentMutationVariables
  >(DELETE_ISSUE_CONTENT);

  const onUpdateIssueContentClick = () => {
    if (updateLoading) return;
    if (
      meData?.me.id !== issueContent?.author?.id &&
      meData?.me.role !== UserRole.Admin
    ) {
      alert("권한이 없습니다.");
      return;
    }
    updateIssueContent({
      variables: {
        input: { issueContentId: issueContent.id, content: updateMDContent },
      },
      onCompleted: (data: UpdateIssueContentMutation) => {
        if (data.updateIssueContent.ok) {
          setUpdateSelectedId(-1);
          issueRefetch();
        } else alert(data.updateIssueContent.error);
      },
    });
  };
  const onDeleteIssueContentClick = () => {
    if (meData?.me.id !== issueContent?.author?.id) {
      alert("권한이 없습니다.");
      return;
    }
    if (!deleteLoading && window.confirm("해당 글을 삭제하시겠습니까?"))
      deleteIssueContent({
        variables: { input: { issueContentId: issueContent.id } },
        onCompleted: (data: DeleteIssuecontentMutation) => {
          if (data.deleteIssueContent.ok) {
            issueRefetch();
          } else alert(data.deleteIssueContent.error);
        },
      });
  };

  return (
    <div className="w-5/6 flex flex-col items-center">
      <div className="w-full border-gray-300 border-2 rounded-md ">
        <div className="p-2 flex flex-row justify-between bg-slate-100 border-b-2 border-gray-300">
          <div>
            <span className=" font-semibold">{issueContent.author?.name}</span>
            님이{" "}
            {issueContent.deletedAt
              ? parseDate(issueContent.deletedAt) + " 삭제"
              : issueContent.updatedAt > issueContent.createdAt
              ? parseDate(issueContent.updatedAt) + " 수정"
              : parseDate(issueContent.createdAt) + " 작성"}
          </div>

          {isLoggedIn &&
            !issueContent.deletedAt &&
            (issueContent.author?.id === meData?.me.id ||
              meData?.me?.role === UserRole.Admin) && (
              <div>
                <FontAwesomeIcon
                  className="mx-2 cursor-pointer"
                  icon={solid("pencil")}
                  onClick={() => {
                    if (updateSelectedId === issueContent.id) {
                      setUpdateSelectedId(-1);
                    } else {
                      setUpdateMDContent(issueContent.content);
                      setUpdateSelectedId(issueContent.id);
                    }
                  }}
                />
                <FontAwesomeIcon
                  className="mx-2 cursor-pointer"
                  icon={solid("trash-can")}
                  onClick={onDeleteIssueContentClick}
                />
              </div>
            )}
        </div>

        {updateSelectedId === issueContent.id ? (
          <>
            <MDEditor
              value={updateMDContent}
              preview="edit"
              extraCommands={[
                commands.codePreview,
                commands.codeEdit,
                commands.fullscreen,
              ]}
              onChange={(value) => {
                value ? setUpdateMDContent(value) : setUpdateMDContent("");
              }}
            />
            <div className=" text-end">
              <button
                className={
                  "my-2 mx-5 bg-slate-700 rounded-xl text-base text-white font-medium px-3 py-1 " +
                  (updateLoading
                    ? "bg-slate-700 pointer-events-none"
                    : "bg-slate-500")
                }
                onClick={onUpdateIssueContentClick}
              >
                의견 수정
              </button>
            </div>
          </>
        ) : (
          <div className="">
            <MDEditor.Markdown
              className="p-3 text-sm font-thin"
              source={issueContent.content}
            />
          </div>
        )}
      </div>
      <div className="w-9/12 h-5 border-x-2 border-gray-300" />
    </div>
  );
};
