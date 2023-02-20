import { gql } from "@apollo/client";
import { AGENDA_FRAGMENT } from "./fragments";

export const GET_AGENDA_BY_CATEGORY = gql`
  query getAgendasByCategory($input: GetAgendasByCategoryInput!) {
    getAgendasByCategory(input: $input) {
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
