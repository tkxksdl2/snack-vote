import { accessTokenVar, isLoggedInVar, userIdvar } from "../apollo";
import { LOCAL_STARAGE_TOKEN, LOCAL_STARAGE_USER_ID } from "../constants";

export const setLoginVars = (accessToken: string, userId: number) => {
  localStorage.setItem(LOCAL_STARAGE_TOKEN, accessToken);
  localStorage.setItem(LOCAL_STARAGE_USER_ID, userId + "");
  isLoggedInVar(true);
  accessTokenVar(accessToken);
  userIdvar(userId + "");
};
