import get from "lodash/get";

let netRoutes = null;
// const localNetRoutes = {
//   block: require("./dev/block"),
//   user: require("./dev/user")
// };

// netRoutes = localNetRoutes;

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
