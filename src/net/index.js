// import from production
import get from "lodash/get";

let netRoutes = null;
if (process.env.NODE_ENV === "development") {
  netRoutes = {
    block: require("./dev/block"),
    user: require("./dev/user")
  };
}

export default async function netInterface(path, data) {
  let route = get(netRoutes, path);
  if (route) {
    return await route(data);
  }

  return null;
}
