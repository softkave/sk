import get from "lodash/get";

let netRoutes = null;

const remoteNetRoutes = {
  block: require("./block"),
  user: require("./user")
};

netRoutes = remoteNetRoutes;

export default async function netInterface(path, ...data) {
  let route = get(netRoutes, path);

  if (route) {
    return await route(...data);
  }

  return null;
}
