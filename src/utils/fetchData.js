let defaultUrl =
  process.env.NODE_ENV === "development"
    ? "https://api.igeeksng.com/prod_sup/api"
    : "https://api.igeeksng.com/api";

export async function fetchData(url, method, data, headers) {
  if (url) {
    url = `${defaultUrl}${url}`;
  } else {
    throw new Error("error.");
  }

  let options = {
    method,
    headers,
    mode: "cors"
    //cache: "",
  };

  if (data) {
    options.headers = {
      ...options.headers
    };

    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  let result = await fetch(url, options);
  let errorMessage = "server error, please try again later";

  if (result.ok) {
    try {
      // result = await result.json();
      return result.text();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      throw new Error(errorMessage);
    }
  }

  let body = await result.json();
  throw new Error(body.Message || result.statusText || errorMessage);
}
