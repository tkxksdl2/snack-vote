import { gql } from "@apollo/client";
import { AGENDA_FRAGMENT, COMMENT_FRAGMENT } from "./fragments";

export const GET_AGENDA_AND_COMMENTS = gql`
  query getAgendaAndComments(
    $commentsInput: GetCommentsByAgendaInput!
    $agendaInput: GetAgendaAndStatsByIdInput!
  ) {
    getCommentsByAgenda(input: $commentsInput) {
      ok
      error
      totalPage
      comments {
        ...CommentParts
      }
    }
    getAgendaAndStatsById(input: $agendaInput) {
      ok
      error
      agendaDetail {
        agenda {
          ...AgendaParts
        }
        agendaChartStatsArr {
          sexData
          ageData
        }
      }
      isUserVotedOpinion
    }
  }
  ${COMMENT_FRAGMENT}
  ${AGENDA_FRAGMENT}
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
