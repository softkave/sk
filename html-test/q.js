let auth = null;

async function q(query, variable) {
  let headers = {};

  if (auth) {
    headers["Authorization"] = `Bearer ${auth}`;
  }

  let result = await fetch("http://localhost:5000/graphql", {
    headers,
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      query,
      variable
    })
  });

  if (result.ok) {
    result = await result.json();
    console.log(result);

    if (result.error) {
      throw new Error("error");
    }

    return result;
  }
}

function setAuth(authorization) {
  auth = authorization;
}