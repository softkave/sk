import NetError from "./NetError";
import get from "lodash/get";
import { devLog, devError } from "../utils/log";
// import dotProp from "dot-prop-immutable";

const serverAddr =
  process.env.NODE_ENV === "development"
    ? `http://192.168.1.73:5000/graphql`
    : "/graphql";

// function getDataFromResult(result, path) {
//   return dotProp.get(result, path);
// }

export default async function query(headers, netQuery, variables, process) {
  console.log(arguments);
  try {
    let hd = {
      "Content-Type": "application/json",
      ...headers
    };

    const result = await fetch(serverAddr, {
      headers: hd,
      body: JSON.stringify({ query: netQuery, variables }),
      method: "POST",
      mode: "cors"
    });

    if (result.ok()) {
      let resultBody = await result.json();
      devLog(resultBody);

      resultBody =
        typeof process === "string"
          ? get(resultBody, process)
          : process(resultBody);

      if (resultBody.errors) {
        throw new NetError(resultBody.errors);
      }

      return resultBody;
    }

    throw new NetError(result.statusText || "an error occurred");
  } catch (error) {
    devError(error);

    if (error.name === "NetError") {
      throw error;
    }

    throw new NetError("an error occurred");
  }
}
