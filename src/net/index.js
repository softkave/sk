import get from "lodash/get";

let netRoutes = null;
// netRoutes = {
//   block: require("./dev/block"),
//   user: require("./dev/user")
// };

netRoutes = {
  block: require("./block"),
  user: require("./user")
};

export default async function netInterface(path, data) {
  let route = get(netRoutes, path);
  if (route) {
    return await route(data);
  }

  return null;
}
