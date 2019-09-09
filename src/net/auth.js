import store from "../redux/store";
import get from "lodash/get";
import query from "./query";

let token = null;
store.subscribe(() => {
  const state = store.getState();
  const session = get(state, "session");
  token = session.token;
});

export default async function queryWithAuth(
  headers,
  netQuery,
  variables,
  process,
  tokenParam
) {
  const requestToken = tokenParam || token;

  if (!requestToken) {
    // throw new NetError("error, please try again");
    throw [{ type: "error", message: new Error("An error occurred") }];
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
