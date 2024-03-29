import { gql } from "@apollo/client";

export const AGENDA_FRAGMENT = gql`
  fragment AgendaParts on Agenda {
    id
    subject
    seriousness
    category
    createdAt
    opinions {
      id
      opinionText
      votedUserCount
    }
    author {
      id
      name
    }
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentParts on Comments {
    id
    bundleId
    content
    createdAt
    deletedAt
    depth
    author {
      id
      name
    }
  }
`;

export const ISSUE_FRAGMENT = gql`
  fragment IssueParts on Issue {
    id
    subject
    hasAnswer
    createdAt
    contentCount
    author {
      id
      name
    }
  }
`;

export const ISSUE_CONTENT_FRAGMENT = gql`
  fragment IssueContentParts on IssueContent {
    id
    content
    createdAt
    updatedAt
    deletedAt
    author {
      id
      name
    }
  }
`;
