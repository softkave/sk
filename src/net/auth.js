import store from "../redux/store";
import get from "lodash/get";
import query from "./query";
import NetError from "./NetError";

let user = null;
store.subscribe(() => {
  const state = store.getState();
  user = get(state, "user");
});

export default async function queryWithAuth(
  headers,
  netQuery,
  variables,
  process,
  token
) {
  const requestToken = (user && user.token) || token;

  if (!requestToken) {
    throw new NetError("error, please try again");
  }

  return await query(
    {
      Authorization: `Bearer ${requestToken}`,
      ...headers
    },
    netQuery,
    variables,
    process
  );
}
