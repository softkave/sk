import NetError from "./NetError";
import get from "lodash/get";

const serverAddr =
  process.env.NODE_ENV === "development"
    ? `localhost:${process.env.DEV_SERVER_PORT || 5000}`
    : "";

export default async function query(headers, netQuery, variables, process) {
  try {
    const result = await fetch(serverAddr, {
      headers,
      body: JSON.stringify({ netQuery, variables }),
      contentType: "application/json",
      accept: "application/json",
      method: "POST"
    });

    if (result.ok()) {
      let resultBody = await result.json();
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
    if (error.name === "NetError") {
      throw error;
    }

    throw new NetError("an error occurred");
  }
}
