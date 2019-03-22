import get from "lodash/get";

let netRoutes = null;
netRoutes = {
  block: require("./dev/block"),
  user: require("./dev/user")
};

// netRoutes = {
//   block: require("./block"),
//   user: require("./user").default
// };

export default async function netInterface(path, data) {
  let route = get(netRoutes, path);
  console.log(route, netRoutes, path, data);
  if (route) {
    return await route(data);
  }

  return null;
}
