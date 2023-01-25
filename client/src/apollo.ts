import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { LOCAL_STARAGE_TOKEN, LOCAL_STARAGE_REFRESH_ID } from "./constants";
import { setContext } from "@apollo/client/link/context";

const token = localStorage.getItem(LOCAL_STARAGE_TOKEN);
const refreshId = localStorage.getItem(LOCAL_STARAGE_REFRESH_ID);

export const isLoggedInVar = makeVar(Boolean(token));
export const accessTokenVar = makeVar(token);
export const refreshTokenIdVar = makeVar(refreshId);

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-JWT": accessTokenVar() || "",
    },
  };
});

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
