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

export const AGENDA_DETAIL_FRAGMENT = gql`
  fragment AgendaDetailParts on Agenda {
    id
    subject
    seriousness
    category
    createdAt
    opinions {
      id
      opinionText
      votedUserCount
      vote {
        id
        user {
          id
          sex
          birth
        }
      }
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
