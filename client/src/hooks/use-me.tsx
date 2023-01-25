import { gql, useQuery } from "@apollo/client";
import { MeQuery } from "../gql/graphql";

const ME = gql`
  query me {
    me {
      id
      email
      name
      role
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery>(ME);
};
