import { gql } from "@apollo/client";
import { AGENDA_DETAIL_FRAGMENT, COMMENT_FRAGMENT } from "./fragments";

export const GET_AGENDA_AND_COMMENTS = gql`
  query getAgendaAndComments(
    $commentsInput: GetCommentsByAgendaInput!
    $agendaInput: FindAgendaByIdInput!
  ) {
    getCommentsByAgenda(input: $commentsInput) {
      ok
      error
      totalPage
      comments {
        ...CommentParts
      }
    }
    findAgendaById(input: $agendaInput) {
      ok
      error
      agenda {
        ...AgendaDetailParts
        author {
          id
          name
        }
      }
    }
  }
  ${COMMENT_FRAGMENT}
  ${AGENDA_DETAIL_FRAGMENT}
`;

export const VOTE_OR_UNVOTE = gql`
  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {
    voteOrUnvote(input: $input) {
      ok
      error
      voteCount
      message
      opinionId
      voteId
      resultType
      opinionType
    }
  }
`;
