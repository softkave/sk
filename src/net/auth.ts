import { OutgoingHttpHeaders } from "http";
import { getUserToken } from "../redux/session/selectors";
import store from "../redux/store";
import { IAnyObject } from "../utils/types";
import query, { NetResultProcessor } from "./query";

function getToken() {
  return getUserToken(store.getState());
}

export default async function queryWithAuth(
  headers: OutgoingHttpHeaders | null,
  netQuery: string,
  variables: IAnyObject,
  process: NetResultProcessor,
  tokenParam?: string
) {
  const requestToken = tokenParam || getToken();

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
