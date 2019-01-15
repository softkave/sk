import store from "../redux/store";
import get from "lodash/get";
import query from "./query";
import NetError from "./NetError";

let user = null;
store.subscribe(state => (user = get(state, "user")));

export default async function queryWithAuth(
  headers,
  netQuery,
  variables,
  process
) {
  if (!user) {
    throw new NetError("error, please try again");
  }

  return await query(
    {
      Authentication: `Bearer ${user.token}`,
      ...headers
    },
    netQuery,
    variables,
    process
  );
}
