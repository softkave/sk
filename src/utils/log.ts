export function devConsole(type, location = "unknown") {
    return (...args) => {
        if (process.env.NODE_ENV === "development") {
            console.log(`[${location}] -`);
            console[type](...args);
        }
    };
}

export function devLog(location, ...args) {
    devConsole("log", location)(...args);
}

export function devError(location, ...args) {
    devConsole("error", location)(...args);
}
