import { useQuery, useReactiveVar } from "@apollo/client";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { isLoggedInVar, shouldRefetchVar } from "../../apollo";
import { Issue } from "../../components/issue-snippets/issue";
import { Pagination } from "../../components/pagination";
import { getFragmentData } from "../../gql";
import {
  GetAllIssuesQuery,
  GetAllIssuesQueryVariables,
  IssuePartsFragment,
} from "../../gql/graphql";
import { resetDefaultPage } from "../../hooks/reset-default-page";
import { ISSUE_FRAGMENT } from "../../queries/fragments";
import { GET_ALL_ISSUES } from "../../queries/qeury-issues";

export const IssueList = () => {
  const [issuePage, setIssuePage] = useState(1);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const shouldRefetch = useReactiveVar(shouldRefetchVar);

  const { data, refetch } = useQuery<
    GetAllIssuesQuery,
    GetAllIssuesQueryVariables
  >(GET_ALL_ISSUES, { variables: { input: { page: issuePage } } });
  const issues = getFragmentData<IssuePartsFragment>(
    ISSUE_FRAGMENT,
    data?.getAllIssues.issues
  );

  if (shouldRefetch) {
    shouldRefetchVar(false);
    refetch({ input: { page: issuePage } });
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>건의 사항 - SnackVote</title>
      </Helmet>
      <div className="flex min-h-screen h-full justify-center bg-slate-300 ">
        <div className="max-w-4xl w-full min-h-screen h-full bg-white py- px-11">
          <div
            className="w-full border-b border-b-gray-400
                    flex justify-between font-semibold text-lg text-gray-800"
          >
            <Link onClick={resetDefaultPage} to={`/issues`}>
              <div className="flex flex-row">
                <div className="py-2 w-fit border-b border-b-gray-700">
                  🛠건의 사항
                </div>
                <div className="mt-4 ml-4 text-sm lg:block hidden text-gray-500">
                  무엇이든 건의하세요!
                </div>
              </div>
            </Link>
            {isLoggedIn && (
              <Link to="/create-issue/">
                <div className="pt-3 text-base">
                  <FontAwesomeIcon className="mx-1" icon={solid("pencil")} />글
                  작성
                </div>
              </Link>
            )}
          </div>

          <div className="my-6">
            {issues?.length === 0 && "아직 건의사항이 없네요!"}
            {issues?.map((issue) => {
              return <Issue key={`issue-${issue.id}`} issue={issue} />;
            })}
          </div>
          <Pagination
            page={issuePage}
            totalPage={
              data?.getAllIssues.totalPage ? data.getAllIssues.totalPage : 1
            }
            setPage={setIssuePage}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
