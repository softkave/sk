import get from "lodash/get";

let netRoutes = null;
// netRoutes = {
//   block: require("./dev/block"),
//   user: require("./dev/user")
// };

netRoutes = {
  block: require("./block"),
  user: require("./user").default
};

export default async function netInterface(path, data) {
  let route = get(netRoutes, path);
<<<<<<< HEAD
  console.log(netRoutes, path, data);
=======

>>>>>>> cb76368d304ef130b5864922dd098d1785bda3cf
  if (route) {
    return await route(data);
  }

  return null;
}