import { gql } from "@apollo/client";

export const AGENDA_FRAGMENT = gql`
  fragment AgendaParts on Agenda {
    id
    subject
    seriousness
    category
    opinions {
      id
      opinionText
      votedUserCount
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
