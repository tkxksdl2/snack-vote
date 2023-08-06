import { gql } from "@apollo/client";

export const ADD_ISSUE_CONTENT = gql`
  mutation addIssueContent($input: AddIssueContentInput!) {
    addIssueContent(input: $input) {
      ok
      result {
        content
      }
    }
  }
`;

export const UPDATE_ISSUE_CONTENT = gql`
  mutation updateIssueContent($input: UpdateIssueContentInput!) {
    updateIssueContent(input: $input) {
      ok
      error
      result {
        id
        content
      }
    }
  }
`;

export const DELETE_ISSUE_CONTENT = gql`
  mutation deleteIssuecontent($input: DeleteIssueContentInput!) {
    deleteIssueContent(input: $input) {
      ok
      error
    }
  }
`;
