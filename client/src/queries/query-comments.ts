import { gql } from "@apollo/client";
import { COMMENT_FRAGMENT } from "./fragments";

export const CREATE_COMMENTS = gql`
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

export const GET_MY_COMMENTS = gql`
  query getMyComments($input: GetMyCommentsInput!) {
    getMyComments(input: $input) {
      ok
      error
      totalPage
      comments {
        createdAt
        content
        author {
          id
        }
        agenda {
          id
          subject
        }
      }
    }
  }
`;

export const DELETE_COMMENTS = gql`
  mutation deleteComments($input: DeleteCommentsInput!) {
    deleteComments(input: $input) {
      ok
      error
    }
  }
`;
