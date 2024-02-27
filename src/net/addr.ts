const rootAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:5000`
    : "https://api.softkave.com";

const graphQLServerAddr =
  process.env.NODE_ENV === "development"
    ? `${rootAddr}/graphql`
    : `${rootAddr}/graphql`;

const RESTServerAddr =
  process.env.NODE_ENV === "development"
    ? `${rootAddr}/api`
    : `${rootAddr}/api`;

export function getRootServerAddr() {
  return rootAddr;
}

export function getGraphQLServerAddr() {
  return graphQLServerAddr;
}

export function getRESTServerAddr() {
  return RESTServerAddr;
}

export function getSockAddr() {
  return {
    url: rootAddr,
    path: "/socket",
  };
}
