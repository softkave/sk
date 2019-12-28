const appPath = "app";
const baseNavPaths = ["notifications", "assigned-tasks", "organizations"];
const pathSeparator = "/";

export const paths = {
  appPath,
  baseNavPaths
};

export const makePath = (path: string) => {
  return `${path[0] !== pathSeparator ? "/" : ""}${path}`;
};

export const getSplitPath = () => {
  return window.location.pathname.split(pathSeparator);
};

export const getAppPathIndex = (pathArray: string[]) => {
  return pathArray.indexOf(appPath);
};

export const isPath0App = () => {
  const pathArray = getSplitPath();
  const appPathIndex = getAppPathIndex(pathArray);

  if (appPathIndex !== -1) {
    return pathArray[appPathIndex] === appPath;
  }

  return false;
};

export const getCurrentBaseNavPath = () => {
  const pathArray = getSplitPath();
  const appPathIndex = pathArray.indexOf(appPath);
  const baseNavigationPathIndex = appPathIndex + 1;

  if (appPathIndex !== -1) {
    if (pathArray.length > baseNavigationPathIndex) {
      return pathArray[baseNavigationPathIndex];
    }
  }
};

export const makeBaseNavPath = (path?: string) => {
  if (path) {
    return `/${appPath}${path[0] !== pathSeparator ? "/" : ""}${path}`;
  }

  return `/${appPath}`;
};

export const getFullBaseNavPath = () => {
  return makeBaseNavPath(getCurrentBaseNavPath());
};

export const concatPaths = (pathA: string, pathB: string) => {
  pathA =
    pathA[pathA.length - 1] === "/" ? pathA.slice(0, pathA.length - 1) : pathA;
  pathB = pathB[0] === "/" ? pathB.slice(1) : pathB;
  return `${pathA}/${pathB}`;
};
