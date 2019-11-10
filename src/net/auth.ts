import { OutgoingHttpHeaders } from "http";
import { getUserToken } from "../redux/session/selectors";
import store from "../redux/store";
import { defaultOperationError } from "../utils/operation-error/OperationError";
import { IAnyObject } from "../utils/types";
import query, { NetResultProcessor } from "./query";

function getToken() {
  return getUserToken(store.getState());
}

export default async function queryWithAuth(
  headers: { [key: string]: string } | null,
  netQuery: string,
  variables: IAnyObject,
  process: NetResultProcessor,
  tokenParam?: string
) {
  const requestToken = tokenParam || getToken();

  if (!requestToken) {
    throw defaultOperationError;
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
