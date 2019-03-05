export function devConsole(type) {
  return function(...args) {
    if (process.env.NODE_ENV === "development") {
      console[type](...args);
    }
  };
}

export function devLog(...args) {
  devConsole("log")(...args);
}

export function devError(...args) {
  devConsole("error")(...args);
}
