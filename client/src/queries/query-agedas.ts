import { gql } from "@apollo/client";
import { AGENDA_FRAGMENT } from "./fragments";

export const GET_ALL_AGENDAS = gql`
  query getAllAgendas($input: GetAllAgendasInput!) {
    getAllAgendas(input: $input) {
      ok
      error
      totalPage
      agendas {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const SEARCH_AGENDA_BY_CATEGORY = gql`
  query searchAgendasByCategory($input: SearchAgendasByCategoryInput!) {
    searchAgendasByCategory(input: $input) {
      ok
      error
      totalPage
      agendas {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const GET_MOST_VOTED_AGENDAS = gql`
  query getMostVotedAgendas {
    getMostVotedAgendas {
      ok
      error
      agendas {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const CREATE_AGENDA = gql`
  mutation createAgenda($input: CreateAgendaInput!) {
    createAgenda(input: $input) {
      ok
      error
      result {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const DELETE_AGENDA = gql`
  mutation deleteAgenda($input: DeleteAgendaInput!) {
    deleteAgenda(input: $input) {
      ok
      error
    }
  }
`;

export const GET_MY_AGENDAS = gql`
  query getMyAgendas($input: GetMyAgendasInput!) {
    getMyAgendas(input: $input) {
      ok
      error
      totalPage
      agendas {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const GET_VOTED_OPINIONS = gql`
  query getVotedOpinions($input: GetVotedOpinionsInput!) {
    getVotedOpinions(input: $input) {
      ok
      error
      totalPage
      opinions {
        id
        opinionText
        votedUserCount
        agenda {
          id
          subject
          createdAt
        }
      }
    }
  }
`;
