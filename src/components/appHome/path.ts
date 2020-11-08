const appPath = "app";
const pathSeparator = "/";

export const paths = {
    appPath,
};

export const isPath0App = () => {
    const pathArray = window.location.pathname.split(pathSeparator);
    const appPathIndex = pathArray.indexOf(appPath);

    if (appPathIndex !== -1) {
        return pathArray[appPathIndex] === appPath;
    }

    return false;
};
