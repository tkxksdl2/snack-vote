import { gql } from "@apollo/client";
import { ISSUE_CONTENT_FRAGMENT, ISSUE_FRAGMENT } from "./fragments";

export const CREATE_ISSUE = gql`
  mutation createIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      ok
      error
      result {
        id
        createdAt
        subject
        issueContents {
          content
        }
      }
    }
  }
`;

export const GET_ALL_ISSUES = gql`
  query getAllIssues($input: GetAllIssuesInput!) {
    getAllIssues(input: $input) {
      ok
      error
      totalPage
      issues {
        ...IssueParts
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

export const GET_ISSUE_AND_CONTENTS_BY_ID = gql`
  query getIssueAndContentsById($input: GetIssueAndContentsByIdInput!) {
    getIssueAndContentsById(input: $input) {
      ok
      error
      issue {
        subject
        contentCount
        hasAnswer
        createdAt
        author {
          id
          name
        }
        issueContents {
          ...IssueContentParts
        }
      }
    }
  }
  ${ISSUE_CONTENT_FRAGMENT}
`;

export const DELETE_ISSUE = gql`
  mutation deleteIssue($input: DeleteIssueInput!) {
    deleteIssue(input: $input) {
      ok
      error
    }
  }
`;
