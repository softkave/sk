const serverAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:5000/graphql`
    : "https://api.softkave.com/graphql";

const sockAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:5000/socket`
    : "https://api.softkave.com/socket";

export function getServerAddr() {
  return serverAddr;
}

export function getSockAddr() {
  return sockAddr;
}
