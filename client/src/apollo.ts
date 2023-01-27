import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  from,
  fromPromise,
  gql,
} from "@apollo/client";
import { LOCAL_STARAGE_TOKEN, LOCAL_STARAGE_REFRESH_ID } from "./constants";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RefreshMutation, RefreshMutationVariables } from "./gql/graphql";

const token = localStorage.getItem(LOCAL_STARAGE_TOKEN);
const refreshId = localStorage.getItem(LOCAL_STARAGE_REFRESH_ID);

export const isLoggedInVar = makeVar(Boolean(token));
export const accessTokenVar = makeVar(token);
export const refreshTokenIdVar = makeVar(refreshId);

export let client: ApolloClient<object>;

const REFRESH = gql`
  mutation refresh($input: RefreshInput!) {
    refresh(input: $input) {
      ok
      error
      newAccessToken
    }
  }
`;

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const linkOnError = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.[0].message === "Expired Token") {
    const accessToken = accessTokenVar();
    const refreshTokenId = refreshTokenIdVar();
    if (accessToken && refreshTokenId) {
      fromPromise(
        client
          .mutate<RefreshMutation, RefreshMutationVariables>({
            mutation: REFRESH,
            variables: {
              input: {
                accessToken,
                refreshTokenId: +refreshTokenId,
              },
            },
          })
          .then(({ data }) => {
            if (data?.refresh.ok && data.refresh.newAccessToken) {
              accessTokenVar(data.refresh.newAccessToken);
              localStorage.setItem(
                LOCAL_STARAGE_TOKEN,
                data.refresh.newAccessToken
              );
              forward(operation);
            } else {
              accessTokenVar(null);
              refreshTokenIdVar(null);
              isLoggedInVar(false);
              localStorage.removeItem(LOCAL_STARAGE_TOKEN);
              localStorage.removeItem(LOCAL_STARAGE_REFRESH_ID);
              cache.reset();
            }
          })
      );
    }
  }
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-JWT": accessTokenVar() || "",
    },
  };
});
const additiveLink = from([authLink, linkOnError, httpLink]);

export const cache = new InMemoryCache();

client = new ApolloClient({
  link: additiveLink,
  cache,
});
