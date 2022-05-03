import { messages } from "../models/messages";

export class UnsurportedBrowserError extends Error {
  name = "UnsurportedBrowserError";
  message =
    "Your browser lack some features we rely on for a smooth experience. Please consider updating your browser.";
}

export class UnknownError extends Error {
  name = "UnknownError";
  message = "An unknown error has occurred.";
}

export function assertInternalError<T>(check: T): check is NonNullable<T> {
  if (!check) {
    throw new Error(messages.internalError);
  }

  return true;
}
