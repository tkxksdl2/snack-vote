import { gql, useQuery } from "@apollo/client";
import { MeQuery } from "../gql/graphql";
import { ME } from "../queries/query-users";

export const useMe = () => {
  return useQuery<MeQuery>(ME);
};
